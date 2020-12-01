const express = require('express');
const net = require('net');
const bitcoin = require('bitcoinjs-lib');
const request = require("request");

//var electrsHost = 'electrs';
const btcCookiePass = process.env.BTC_RPC_COOKIE_PASS;
const btcRpcUrl = '127.0.0.1:8332/';
const electrsHost = process.env.ELECTRS_HOST;
const electrsPort = process.env.ELECTRS_PORT;
console.log(`INFO PROXY: btc rpc pass: ${btcCookiePass}`)
console.log(`INFO PROXY: Electrs host: ${electrsHost}:${electrsPort}`);

const app = express();
const port = 50002;

const addressToScriptHash = (address) => {
    let script = bitcoin.address.toOutputScript(address);
    let hash = bitcoin.crypto.sha256(script);
    let reversedHash = Buffer.from(hash.reverse());
    return reversedHash.toString('hex');
};

/* takes BTC amount, returns Satoshis */
const toSats = (btc) => Math.ceil(btc * 100000000);

// electrs rpc
const eRpc = (addr, rpcCall) => {
    return new Promise((resolve, reject) => {
        let scriptHash;
        try { scriptHash = addressToScriptHash(addr); }
        catch (e) { return reject({code: 400, msg: 'bad address to e-rpc'}); }

        const client = new net.Socket();
        client.connect(electrsPort, electrsHost, () => {
            const rc = Object.assign({params: [scriptHash]}, rpcCall);
            client.write(JSON.stringify(rc));
            client.write('\r\n');
        });
        client.on('error', err => { return reject({code: 502, msg: "e-rpc error"}); });
        client.on('data', data => {
            client.destroy();
            resolve(JSON.parse(data.toString()));
        });
    });
};

// btc rpc
const bRpc = (rpcCall) => {
    return new Promise((resolve, reject) => {
        const headers = {
            "content-type": "text/plain;"
        };
        const options = {
            url: `http://__cookie__:${btcCookiePass}@${btcRpcUrl}`,
            method: "POST",
            headers: headers,
            body: JSON.stringify(rpcCall)
        };
        const callback = (error, response, body) => {
            if (!error && response.statusCode == 200) {
                resolve(JSON.parse(body));
            }
            else {
                console.log(error);
                return reject({code: 400, msg: 'bad btc-rpc call'});
            }
        };
        try { request(options, callback); }
        catch (e) { return reject({code: 502}); }
    });
};

// takes a promise, transforms its JSON result, and responds
const jsonRespond = (rpcPromise, transformer, res) => {
    rpcPromise
        .then(json => {
            res.send(transformer(json));
        })
        .catch(err => {
            console.log(err);
            res.status(err.code).end();
        });
};

/*
  Composes 3 separate RPC calls to:
    - electrs: listunspent
    - electrs: get_history
    - btc:     getblockcount,
  and packages the results into one RPC return
*/
app.get('/addresses/info/:address', (req, res) => {
    const addr = req.params.address;
    const id = 'get-address-info';
    const rpcCall1 = {jsonrpc: '2.0', id, method: 'blockchain.scripthash.listunspent'};
    const rpcCall2 = {jsonrpc: '2.0', id: 'e-rpc', method: 'blockchain.scripthash.get_history'};
    const blockRpc = {jsonrpc: '2.0', id: 'btc-rpc', method: 'getblockcount'};
    const timeRpc = {jsonrpc: '2.0', id: 'btc-rpc', method: 'getblockstats', params: [["time"]]};

    let utxos;
    let used;
    let block;
    eRpc(addr, rpcCall1)
        .then(json => {
            utxos = json.result;
            return eRpc(addr, rpcCall2);
        })
        .then(json => {
            used = utxos.length > 0 || json.result.length > 0;
            return bRpc(blockRpc);
        })
        .then(json => {
            block = json.result;
            const ps = utxos.map((u) => {
                if (u.height == 0) {
                    return {result: {time: 0}};
                }
                else {
                    let params = timeRpc.params;
                    params.unshift(u.height);
                    const call = {...timeRpc, params};
                    console.log(call);
                    return bRpc(call);
                }
            });
            return Promise.all(ps);
        })
        .then(jsons => {
            console.log(jsons);
            for(let i=0; i<jsons.length; i++) {
                utxos[i] = {...utxos[i], time: jsons[i].result.time};
            }
            console.log(utxos);
            res.send({error: null, id, result: {utxos, block, used}});
        })
        .catch(err => {
            console.log(err);
            res.status(err.code).end();
        });
});

app.get('/getblockandfee', (req, res) => {
    const id = 'get-block-and-fee';
    const blockCall = {jsonrpc: '2.0', id: 'btc-rpc', method: 'getblockcount'};
    const feeCall = {jsonrpc: '2.0', id, method: 'estimatesmartfee',
                     params: [1]};
    let blockcount;
    bRpc(blockCall)
        .then(json => {
            blockcount = json.result;
            return bRpc(feeCall);
        })
        .then(json => {
            // fee is per kilobyte, we want in bytes
            res.send({...json, result: {blockcount, fee: toSats(json.result.feerate / 1024)}});
        })
        .catch(err => {
            console.log(err);
            res.status(err.code).end();
        });
});

app.get('/getblockcount', (req, res) => {
    const id = 'get-block-count';
    const rpcCall = {jsonrpc: '2.0', id, method: 'getblockcount'};
    jsonRespond(bRpc(rpcCall), (j) => j, res);
});

app.get('/getrawtx/:txid', (req, res) => {
    const id = 'get-raw-tx';
    const txid = req.params.txid;
    const rpcCall = {jsonrpc: '2.0', id, method: 'getrawtransaction',
                     params: [txid]};
    const addTxId = (json) => {
        return {...json, result: {rawtx: json.result, txid}};
    }
    jsonRespond(bRpc(rpcCall), addTxId, res);
});

app.listen(port, () => console.log(`Electrs proxy listening on port ${port}`));
