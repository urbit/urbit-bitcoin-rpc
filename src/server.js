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

const headers = {
    "content-type": "text/plain;"
};

const addressToScriptHash = (address) => {
    let script = bitcoin.address.toOutputScript(address);
    let hash = bitcoin.crypto.sha256(script);
    let reversedHash = Buffer.from(hash.reverse());
    return reversedHash.toString('hex');
};


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

const bRpc = (rpcCall) => {
    return new Promise((resolve, reject) => {
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
            else { return reject({code: 502, msg: 'bad btc-rpc call'}); }
        };
        try { request(options, callback); }
        catch (e) { return reject({code: 502}); }
    });
};

/* withBlockCount
   Merges BTC RPC blockcount into the electRS result
   - eRpcCall: rpc call for electrs
   - res: Express response to write to
 */
const withBlockCount = (addr, eRpcCall, res) => {
    const bRpcCall = {jsonrpc: '2.0', id: 'btc-rpc', method: 'getblockcount'};
    let eRes;
    eRpc(addr, eRpcCall)
        .then(json => {
            eRes = json;
            console.log(eRes);
            return bRpc(bRpcCall);
        })
        .then(json => {
            res.send({...eRes, result: {...eRes.result, blockcount: json.result}});
        })
        .catch(err => {
            console.log(err);
            res.status(err.code).end();
        });
};

app.get('/addresses/info/:address', (req, res) => {
    const addr = req.params.address;
    const id = 'get-address-info';
    const rpcCall1 = {jsonrpc: '2.0', id, method: 'blockchain.scripthash.listunspent'};
    const rpcCall2 = {jsonrpc: '2.0', id: 'e-rpc', method: 'blockchain.scripthash.get_history'};
    const bRpcCall = {jsonrpc: '2.0', id: 'btc-rpc', method: 'getblockcount'};

//    TODO: used but no utxos should have blank UTXOs, but doesn't
    let eRes;
    eRpc(addr, rpcCall1)
        .then(json => {
            eRes = json;
            return eRpc(addr, rpcCall2);
        })
        .then(json => {
            console.log(eRes);
            const used = eRes.result.length > 0 || json.result.length > 0;
            eRes = {...eRes, result: {utxos: eRes.result, used}};
            console.log(eRes);
            return bRpc(bRpcCall);
        })
        .then(json => {
            res.send({...eRes, result: {...eRes.result, blockcount: json.result}});
        })
        .catch(err => {
            console.log(err);
            res.status(err.code).end();
        });
});

/*
app.get('/addresses/balance/:address', (req, res) => {
    const id = 'get-address-balance';
    const rpcCall = {jsonrpc: '2.0', id, method: 'blockchain.scripthash.get_balance'};
    withBlockCount(req.params.address, rpcCall, res);
});

app.get('/addresses/utxos/:address', (req, res) => {
    const id = 'get-address-utxos';
    const rpcCall = {jsonrpc: '2.0', id, method: 'blockchain.scripthash.listunspent'};
    withBlockCount(req.params.address, rpcCall, res);
});

app.get('/addresses/history/:address', (req, res) => {
    const id = 'get-address-history';
    const rpcCall = {jsonrpc: '2.0', id, method: 'blockchain.scripthash.get_history'};
    withBlockCount(req.params.address, rpcCall, res);
});
*/

app.get('/getblockcount', (req, res) => {
    const id = 'getblockcount';
    const rpcCall = {jsonrpc: '2.0', id, method: 'getblockcount'};
    bRpc(rpcCall)
        .then(json => {
            res.send(json);
        })
        .catch(err => {
            console.log(err);
            res.status(err.code).end();
        });
});

app.listen(port, () => console.log(`Electrs proxy listening on port ${port}`));
