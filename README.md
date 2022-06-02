# Utilities for Running an Urbit Bitcoin Full Node

**NOTE 1**
Make sure that your `bitcoin.conf` settings match those of the included `bitcoin.conf`. In particular, if you don't have `blockfilterindex=1` set, the server won't work.

**NOTE 2**
`src/dumb.js` works, but is not currently implemented on the Hoon side. Use the scripts in the manner done in `mainnet-start.sh` and `testnet-start.sh` for now.

## Simple Usage

1. Initialize and build electrs

```
git submodule init
git submodule update
cd electrs
cargo build --locked --release
cd ..
```

2. Set the `$DRIVE` variable at the top of `mainnet-start.sh`, `testnet-start.sh`, or `regnet-start.sh` to a directory that contains a `BTC` directory for Bitcoin core data.
3. Copy the included `bitcoin.conf` to the `/BTC` directory in that `DRIVE`
4. Run `./mainnet-start.sh` or `./testnet-start.sh`
5. When done, kill with `Ctrl-C`, and wait to see `Shutdown: done` from Bitcoin core.

## Components

- Electrs as a submodule (for random lookup of address info)
- JS Proxy to act as an API
- Scripts to start the above with `bitcoind`

## Auth Notes

This uses `.cookie` authentication. To find the username and password for BTC RPC, open the `.cookie` file in the Bitcoin datadir. It has the format:

- username: `__cookie__`
- password: everything after `:`

## Sample Calls

curl http://localhost:50002/addresses/info/bc1qm7cegwfd0pvv9ypvz5nhstage00xkxevtrpshc
curl http://localhost:50002/addresses/info/bc1qlwd7mw33uea5m8r2lsnsrkc7gp2qynrxsfxpfm
curl http://localhost:50002/addresses/info/bc1qglkc9zfcn04vcc88nn0ljtxcpu5uxfznc3829k
:: first is an address w balance
:: second has no balance but is used
:: third is unused

curl http://localhost:50002/getblockinfo
curl http://localhost:50002/getrawtx/f107fd63c7b78df447dd4355d39e474786998d78ff1c152602fafe7e96c10e4d
curl http://localhost:50002/getblockcount

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

---

## NEW: dumb.js, a dumb proxy

Start with `testnet-dumb-proxy.sh` or `mainnet-dumb-proxy.sh`.

## Regtest notes

For quicker testing the server be ran in regtest mode. To do so follow steps 1 - 4 under Simple Usage. Once the server is running you can then generate new blocks by running:

```
bitcoin-cli -regtest createwallet <wallet_name>
bitcoin-cli -regtest -rpcwallet=<wallet_name> -generate 101

# you should see a single utxo with a value of 50 BTC
bitcoin-cli -regtest -rpcwallet=<wallet_name> listunspent
```

You should now be able to call any bitcoin-cli command and test as needed.
For more info on regtest take a look at the [btc testing docs](https://developer.bitcoin.org/examples/testing.html) or [this guide](https://gist.github.com/System-Glitch/cb4e87bf1ae3fec9925725bb3ebe223a#file-how_to_regtest-md)

### Example calls

testnet

```bash
# BTC-RPC
curl http://localhost:50002/btc-rpc -X POST -d '{"jsonrpc":"1.0","id":"curltext","method":"getblockchaininfo","params":[]}' -H 'Content-Type: application/json' && echo ""

# Electrs RPC on testnet
curl http://localhost:50002/electrs-rpc -X POST -H 'Content-Type: application/json' -d '{"jsonrpc": "2.0", "id": "get-address-info", "method": "blockchain.scripthash.listunspent", "params": ["34aae877286aa09828803af27ce2315e72c4888efdf74d7d067c975b7c558789"]}' && echo ""
```

mainnet

```bash
# BTC-RPC
curl http://localhost:50002/btc-rpc -X POST -d '{"jsonrpc":"1.0","id":"curltext","method":"getblockchaininfo","params":[]}' -H 'Content-Type: application/json' && echo ""

# Electrs RPC
curl http://localhost:50002/electrs-rpc -X POST -H 'Content-Type: application/json' -d '{"jsonrpc": "2.0", "id": "get-address-info", "method": "blockchain.scripthash.listunspent", "params": ["32259e322cd3a03b39a86160ced01e5aeda3bce36c4958cb0a185baf365ed878"]}' && echo ""
```
