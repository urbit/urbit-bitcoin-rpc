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

const responseHandler = (res) => (data) => {
    res.send(JSON.parse(data.toString()));
};

const addressToScriptHash = (address) => {
    let script = bitcoin.address.toOutputScript(address);
    let hash = bitcoin.crypto.sha256(script);
    let reversedHash = Buffer.from(hash.reverse());
    return reversedHash.toString('hex');
};


/* eRpc: do an electrs call
   - addr: address to lookup as a param
   - rpcCall: JSON call
   - res: Express res object (if we need to terminate early)
   - returnVar: write the result of the RPC call here
*/
const eRpc = (addr, rpcCall) => {
    return new Promise((resolve, reject) => {
        let scriptHash;
        try {
            scriptHash = addressToScriptHash(addr);
        }
        catch (e) {
            return(reject(e));
        }

        const client = new net.Socket();
        client.connect(electrsPort, electrsHost, () => {
            const rc = Object.assign({params: [scriptHash]}, rpcCall);
            client.write(JSON.stringify(rc));
            client.write('\r\n');
        });
        client.on('error', err => { return reject(err); });
        client.on('data', data => {
            client.destroy();
            resolve(data);
        });
    });
};

/* bRpc: BTC RPC call

 */
const bRpc = (rpcCall, res, callback) => {
    const options = {
        url: `http://__cookie__:${btcCookiePass}@${btcRpcUrl}`,
        method: "POST",
        headers: headers,
        body: JSON.stringify(rpcCall)
    };
    const handler = (error, response, body) => {
        if (!error && response.statusCode == 200) {
            callback(JSON.parse(body));
        }
        else {
            res.status(502).end();
        }
    };
    try {
        request(options, handler);
    }
    catch (e) {
        res.status(502).end();
    }
};

app.get('/addresses/balance/:address', (req, res) => {
    const id = 'get-address-balance';
    const rpcCall = {jsonrpc: '2.0', id, method: 'blockchain.scripthash.get_balance'};
    //    res.send(JSON.parse(data.toString()));
    eRpc(req.params.address, rpcCall)
        .then(data => {
            res.send(JSON.parse(data.toString()));
        })
        .catch(err => {
            console.log(err);
            res.status(502).end();
        });
});

/*
app.get('/addresses/utxos/:address', (req, res) => {
    const id = 'get-address-utxos';
    const rpcCall = {jsonrpc: '2.0', id, method: 'blockchain.scripthash.listunspent'};
    eRpc(req.params.address, rpcCall, res, responseHandler(res));

});

app.get('/addresses/history/:address', (req, res) => {
    const id = 'get-address-history';
    const rpcCall = {jsonrpc: '2.0', id, method: 'blockchain.scripthash.get_history'};
    eRpc(req.params.address, rpcCall, res, responseHandler(res));

});

app.get('/getblockcount', (req, res) => {
    const id = 'getblockcount';
    const rpcCall = {jsonrpc: '2.0', id, method: 'getblockcount'};
    bRpc(rpcCall, res);
});

*/

app.listen(port, () => console.log(`Electrs proxy listening on port ${port}`));
