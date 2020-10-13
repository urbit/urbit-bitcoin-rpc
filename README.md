# Docker Bitcoin
Downloads the official binaries.

## Auth Notes
This uses `.cookie` authentication. To find the username and password for BTC RPC, open the `.cookie` file in the Bitcoin datadir. It has the format:
* username: `__cookie__`
* password: everything after `:`

## Usage
1. Have an external volume
2. Pass that as a Docker volume (see `start.sh`)
3. In `bitcoin.conf`:
```
rpcallowip=0.0.0.0/0
rpcbind=0.0.0.0
```

## Other Apps

### Node Proxy Server (for `electrs`)
```
docker image build --rm -f js-proxy-electrs.Dockerfile -t js-proxy-electrs .
```
