#!/bin/bash
BTC_DATADIR=/Volumes/sandisk/BTC
ELECTRS_DATADIR=/Volumes/sandisk/electrs
ELECTRS_HOST=electrs
ELECTRS_PORT=50001
PROXY_PORT=50002

function cleanup() {
    echo ""
    echo "Stopping js-proxy server..."
    docker container stop js-proxy-electrs
    echo "Stopping bitcoind..."
    docker container stop bitcoind
    echo "Stopping electrs..."
    docker container stop electrs
    echo "Deleting btc-network..."
    docker network rm btc-network

    exit 0
}

trap 'cleanup' 2

docker network create btc-network

# Start bitcoind
docker container run --rm \
       -v  $BTC_DATADIR:/btc \
       -p 8332:8332 -p 8333:8333 \
       --network btc-network \
       --name bitcoind \
       -d bitcoin-core

# Start electrs
docker container run --rm \
       --network btc-network \
       --volume $BTC_DATADIR:/home/user/.bitcoin:ro \
       --volume $ELECTRS_DATADIR:/home/user \
       -p 50001:50001 \
       --name electrs \
       -d electrs \
       electrs -vvvv --daemon-rpc-addr "bitcoind:8332" --db-dir /home/user/db --timestamp \
       --electrum-rpc-addr 0.0.0.0:$ELECTRS_PORT \
       --jsonrpc-import

# Start js-proxy server to electrs
docker container run --rm \
       -p $PROXY_PORT:$PROXY_PORT \
       --network btc-network \
       --name js-proxy-electrs \
       -e ELECTRS_HOST=$ELECTRS_HOST -e ELECTRS_PORT=$ELECTRS_PORT \
       -d js-proxy-electrs

echo "INFO: started bitcoind"
echo "INFO: started electrs"
echo "INFO: started js-proxy-electrs on port $PROXY_PORT"
echo "INFO: use monitor.sh to view process status"
read -p  "hit CTRL+C to shutdown all processes..."
