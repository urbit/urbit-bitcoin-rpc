# Docker Bitcoin & ElectRS
Runs `bitcoind` and `electrs` inside one Docker network. Also runs a NodeJS proxy server to `electrs` RPC, so that it can accept HTTP calls.

## Auth Notes
This uses `.cookie` authentication. To find the username and password for BTC RPC, open the `.cookie` file in the Bitcoin datadir. It has the format:
* username: `__cookie__`
* password: everything after `:`

## Usage
1. Have an external volume
2. Set the appropriate directory variable in `start.sh`
3. In `bitcoin.conf`:
```
rpcallowip=0.0.0.0/0
rpcbind=0.0.0.0
```

### Build Docker Containers
```
build.sh
```

### Run Docker Containers
```
start.sh
```

## Proxy REST API
* `/addresses/balance/ADDRESS`
