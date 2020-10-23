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

const addressLookup = (rpcCall, res) => {
    const client = new net.Socket();

    client.connect(electrsPort, electrsHost, () => {
        client.write(JSON.stringify(rpcCall));
        client.write('\r\n');
    });
    client.on('data', (data) => {
        const ret = JSON.parse(data.toString());
        console.log(ret);
        res.send(ret);
        client.destroy();
    });
};

app.get('/addresses/balance/:address', (req, res) => {
    const scriptHash = addressToScriptHash(req.params.address);
    const id = 'get-address-balance';
    const rpcCall = {jsonrpc: '2.0', id, method: 'blockchain.scripthash.get_balance',
                     params: [scriptHash]};
    addressLookup(rpcCall, res);
});

app.get('/addresses/utxos/:address', (req, res) => {
    const scriptHash = addressToScriptHash(req.params.address);
    const id = 'get-address-utxos';
    const rpcCall = {jsonrpc: '2.0', id, method: 'blockchain.scripthash.listunspent',
                     params: [scriptHash]};
    addressLookup(rpcCall, res);

});

app.post('/electrum-rpc', (req, res) => {
    console.log(req);
    res.send("TODO: implement HTTP POST forwarding of requests");
});

app.listen(port, () => console.log(`Electrs proxy listening on port ${port}`));
