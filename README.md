# Bitcoin & ElectRS
*TODO*
Make test vectors for these addresses:
curl http://localhost:50002/addresses/info/bc1qm7cegwfd0pvv9ypvz5nhstage00xkxevtrpshc
curl http://localhost:50002/addresses/info/bc1qlwd7mw33uea5m8r2lsnsrkc7gp2qynrxsfxpfm
curl http://localhost:50002/addresses/info/bc1qglkc9zfcn04vcc88nn0ljtxcpu5uxfznc3829k
::  first is an address w balance
::  second has no balance but is used
::  third is unused

curl http://localhost:50002/getblockandfee
curl http://localhost:50002/getrawtx/f107fd63c7b78df447dd4355d39e474786998d78ff1c152602fafe7e96c10e4d
curl http://localhost:50002/getblockcount

curl -XPOST -d '{"inputs": [{"txid": "0e868771b3bff789525e21bac735e28070d1eff0fb4df59adc98e9148e2f85d4", "vout": 0}], "outputs": [{"bc1q0ydcskwye4rqky4qankhl4kegajl8nh50plmx0": 12500000}]}' -H 'content-type: application/json' http://localhost:50002/createrawtx

gives: 
`{"result":{"rawtx":"0200000001d4852f8e14e998dc9af54dfbf0efd17080e235c7ba215e5289f7bfb37187860e0000000000ffffffff0120bcbe0000000000160014791b8859c4cd460b12a0eced7fd6d94765f3cef400000000","txid":"a2961f5bafe863f59b03d38c632380e1252caceb9a590f31d51e97859c3830c1"},"error":null,"id":"create-raw-tx"}`


Runs `bitcoind` and `electrs`. Also runs a NodeJS proxy server to `electrs` RPC, so that it can accept HTTP calls.

## Auth Notes
This uses `.cookie` authentication. To find the username and password for BTC RPC, open the `.cookie` file in the Bitcoin datadir. It has the format:
* username: `__cookie__`
* password: everything after `:`

## Local Usage

### Initialize `git` Modules for `electrs`
```
git submodule init
git submodule update
```

1. Have an external volume
2. Set directories in `local-start.sh`
3. In `bitcoin.conf`:
```
rpcallowip=127.0.0.1
```

## Raspberry Pi Setup
Rust install weirdness:
https://www.raspberrypi.org/forums/viewtopic.php?t=289963
```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```
Do a Custom Install, and set the triple to:
```
armv7-unknown-linux-gnueabihf
```
