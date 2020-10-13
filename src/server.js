const express = require('express');
const net = require('net');
const bitcoin = require('bitcoinjs-lib')

//var electrsHost = 'electrs';
const electrsHost = process.env.ELECTRS_HOST;
const electrsPort = process.env.ELECTRS_PORT;
console.log(electrsHost);
console.log(electrsPort);

const app = express();
const port = 50002;

const addressToScriptHash = (address) => {
    let script = bitcoin.address.toOutputScript(address);
    let hash = bitcoin.crypto.sha256(script);
    let reversedHash = Buffer.from(hash.reverse());
    return reversedHash.toString('hex');
};

app.get('/addresses/balance/:address', (req, res) => {
    const client = new net.Socket();
    const scriptHash = addressToScriptHash(req.params.address);
    const rpcCall = {jsonrpc: '2.0', id: 0, method: 'blockchain.scripthash.get_balance',
                     params: [scriptHash]};

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
});

app.post('/electrum-rpc', (req, res) => {
    console.log(req);
    res.send("TODO: implement HTTP POST forwarding of requests");
});

app.listen(port, () => console.log(`Electrs proxy listening on port ${port}`));
