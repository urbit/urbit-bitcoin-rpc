const express = require('express');
const net = require('net');
const bitcoin = require('bitcoinjs-lib')

//var electrsHost = 'electrs';
const electrsHosts = '127.0.0.1'
const electrsPort = 50001;

const app = express();
const port = 50002;

const addressToScriptHash = (address) => {
    let script = bitcoin.address.toOutputScript(address);
    let hash = bitcoin.crypto.sha256(script);
    let reversedHash = Buffer.from(hash.reverse());
    return reversedHash.toString('hex');
};

app.get('/addresses/balance/:address', (req, res) => {
    const scriptHash = addressToScriptHash(req.params.address);
    res.send(scriptHash);
});

app.post('/electrum-rpc', (req, res) => {
    console.log(req);
    res.send("done");
});

app.listen(port, () => console.log(`Electrs proxy listening on port ${port}`));
