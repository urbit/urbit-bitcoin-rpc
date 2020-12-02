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
curl http://localhost:50002/getfee/1000
curl http://localhost:50002/getrawtx/f107fd63c7b78df447dd4355d39e474786998d78ff1c152602fafe7e96c10e4d
curl http://localhost:50002/getblockcount

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
