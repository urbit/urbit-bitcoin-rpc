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

### Data storage
`docker-compose` creates volumes to store the bitcoin and electrs data. If you're already using a local directory for a full bitcoin node, edit the top of docker-compose.yml and change the volumes there to your local directoires you'd like to mount.

### Build Docker Containers
```
docker-compose build
```

### Run Docker Containers
```
docker-compose up
```

### Retrieve rpc password
```
./get_rpc_password.sh
```

## Proxy REST API
* `/addresses/balance/ADDRESS`
