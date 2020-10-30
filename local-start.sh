#!/bin/bash
BTC_DATADIR=/Volumes/sandisk/BTC
ELECTRS_DATADIR=/Volumes/sandisk/electrs
ELECTRS_HOST=127.0.0.1
ELECTRS_PORT=50001
PROXY_PORT=50002

# bitcoind -datadir=$BTC_DATADIR
# node src/server.js

./electrs/target/release/electrs \
    -vvvv  --timestamp \
    --cookie-file $BTC_DATADIR/.cookie \
    --daemon-dir $BTC_DATADIR \
    --db-dir $ELECTRS_DATADIR \
    --daemon-rpc-addr "localhost:8332" \
    --electrum-rpc-addr $ELECTRS_HOST:$ELECTRS_PORT
