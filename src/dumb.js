/*   dumb.js
::    a dumb proxy for BTC and Electrs RPC calls
::
::    Proxies JSON RPC calls directly, to avoid auth on localhost
      and to handle Electrs only accepting TCP calls
*/

const express = require('express');
const net = require('net');
const request = require("request");

const btcCookiePass = process.env.BTC_RPC_COOKIE_PASS;
const btcRpcPort = process.env.BTC_RPC_PORT;
const btcRpcUrl = `127.0.0.1:${btcRpcPort}/`;
const electrsHost = process.env.ELECTRS_HOST;
const electrsPort = process.env.ELECTRS_PORT;
const PORT = parseInt(process.env.PROXY_PORT);

const app = express();
app.use(express.json());

const eRpc = (rpcCall) => {
    return new Promise((resolve, reject) => {
        const client = new net.Socket();
        client.connect(electrsPort, electrsHost, () => {
            client.write(JSON.stringify(rpcCall));
            client.write('\r\n');
        });
        client.on('error', err => {
            console.log(err);
            return reject({code: 502, msg: "Electrs server error"}); });
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
            headers: {"content-type": "application/json"},
            body: JSON.stringify(rpcCall)
        };
        const callback = (error, response, body) => {
            if (!error && response.statusCode == 200) {
                return resolve(JSON.parse(body));
            }
            else {
                let err;
                console.log(error);
                try {
                    err = JSON.parse(body).error;
                }
                catch (e) {
                    return reject({code: 400, msg: 'bad btc-rpc call'});
                }
                if (err != undefined) {
                    return resolve(JSON.parse(body));
                }
                else {
                    return reject({code: 400, msg: 'bad btc-rpc call'});
                }
            }
        };
        try { request(options, callback); }
        catch (e) { return reject({code: 502}); }
    });
};

app.post('/btc-rpc', (req, res) => {
    bRpc(req.body)
        .then(json => {
            res.send(json);
        })
        .catch(err => {
            res.status(502).end();
        });
});

app.post('/electrs-rpc', (req, res) => {
    console.log(req.body);
    eRpc(req.body)
        .then(json => {
            res.send(json);
        })
        .catch(err => {
            console.log("ERROR");
            console.log(err);
            res.status(502).end();
        });
});

app.listen(PORT, () => console.log(`JSON RPC dumb proxy started on port ${PORT}`));
