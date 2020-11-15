# Bitcoin & ElectRS
*TODO*
Make test vectors for these addresses:
curl -v http://localhost:50002/addresses/info/bc1q59u5epktervh6fxqay2dlph0wxu9hjnx6v8n66
curl -v http://localhost:50002/addresses/info/bc1qlwd7mw33uea5m8r2lsnsrkc7gp2qynrxsfxpfm
curl -v http://localhost:50002/addresses/info/bc1qglkc9zfcn04vcc88nn0ljtxcpu5uxfznc3829k
::  first is an address w balance
::  second has no balance but is used
::  third is unused

curl http://localhost:50002/getfee/1000
curl http://localhost:50002/getrawtx/f107fd63c7b78df447dd4355d39e474786998d78ff1c152602fafe7e96c10e4d
curl http://localhost:50002/getblockcount

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
