const express = require('express');
const net = require('net');
const bitcoin = require('bitcoinjs-lib');

//var electrsHost = 'electrs';
const electrsHost = process.env.ELECTRS_HOST;
const electrsPort = process.env.ELECTRS_PORT;
console.log(`Electrs host: ${electrsHost}:${electrsPort}`);

const app = express();
const port = 50002;

const addressToScriptHash = (address) => {
    let script = bitcoin.address.toOutputScript(address);
    let hash = bitcoin.crypto.sha256(script);
    let reversedHash = Buffer.from(hash.reverse());
    return reversedHash.toString('hex');
};

const addressLookup = (addr, rpcCall, res) => {
    let scriptHash;
    try {
        scriptHash = addressToScriptHash(addr);
    }
    catch (e) {
        console.log(e);
        res.status(400).end();
        return;
    }

    const client = new net.Socket();
    client.connect(electrsPort, electrsHost, () => {
        const rc = Object.assign({params: [scriptHash]}, rpcCall);
        client.write(JSON.stringify(rc));
        client.write('\r\n');
    });
    client.on('error', err => {console.error(err); res.status(502).end()});
    client.on('data', (data) => {
        const ret = JSON.parse(data.toString());
        console.log(ret);
        res.send(ret);
        client.destroy();
    });
};

app.get('/addresses/balance/:address', (req, res) => {
    const id = 'get-address-balance';
    const rpcCall = {jsonrpc: '2.0', id, method: 'blockchain.scripthash.get_balance'};
    addressLookup(req.params.address, rpcCall, res);
});

app.get('/addresses/utxos/:address', (req, res) => {
    const id = 'get-address-utxos';
    const rpcCall = {jsonrpc: '2.0', id, method: 'blockchain.scripthash.listunspent'};
    addressLookup(req.params.address, rpcCall, res);

});

app.get('/addresses/history/:address', (req, res) => {
    const id = 'get-address-history';
    const rpcCall = {jsonrpc: '2.0', id, method: 'blockchain.scripthash.get_history'};
    addressLookup(req.params.address, rpcCall, res);

});

app.post('/electrum-rpc', (req, res) => {
    console.log(req);
    res.send("TODO: implement HTTP POST forwarding of requests");
});

app.listen(port, () => console.log(`Electrs proxy listening on port ${port}`));
