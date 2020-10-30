# Docker Bitcoin & ElectRS
Runs `bitcoind` and `electrs` inside one Docker network. Also runs a NodeJS proxy server to `electrs` RPC, so that it can accept HTTP calls.

## Auth Notes
This uses `.cookie` authentication. To find the username and password for BTC RPC, open the `.cookie` file in the Bitcoin datadir. It has the format:
* username: `__cookie__`
* password: everything after `:`

## Local Usage
1. Have an external volume
2. Set directories in `local-start.sh`
3. In `bitcoin.conf`:
```
rpcallowip=127.0.0.1
```

## Docker Usage
1. Have an external volume
2. Set the appropriate directory variable in `start.sh`
3. In `bitcoin.conf`:
```
rpcallowip=0.0.0.0/0
rpcbind=0.0.0.0
```

### Data storage
`docker-compose` creates volumes to store the bitcoin and electrs data. If you're already using a local directory for a full bitcoin node, edit the top of docker-compose.yml and change the volumes there to your local directories you'd like to mount.

### Initialize `git` Modules
```
git submodule init
git submodule update
```

### Build Docker Containers
```
docker-compose build
```

Once the containers are built, you can either run the system as a foreground process or as a daemon.
#### Run in the Foreground
```
docker-compose up

# to stop, use Ctrl-c once: 
# bitcoind will stop gracefully and write its cache to disk
```

#### Run as a Daemon
```
docker-compose up -d
docker-compose logs -f

# to stop, run
docker-compose down
```

### Retrieve rpc password
```
./get_rpc_password.sh
```

## Proxy REST API
* `/addresses/balance/:address`
* `/addresses/utxos/:address`
