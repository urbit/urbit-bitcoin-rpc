#!/bin/bash
##########################
#  Variables:
#  DRIVE: location of the (probably external) drive holding a /BTC directory
##########################
DRIVE=/drive/goes/here

# Start BTC first so that proxy can access BTC's .cookie file
# Sleep so that the .cookie file is generated
bitcoind -datadir="$DRIVE" -regtest -daemon &
sleep 2

ELECTRS_DATADIR="$DRIVE"/electrs
COOKIE=$(cat "$DRIVE"/regtest/.cookie)
export BTC_RPC_COOKIE_PASS=${COOKIE:11}
export BTC_RPC_PORT=18443
export BTC_NETWORK=REGTEST
export ELECTRS_HOST=127.0.0.1
export ELECTRS_PORT=60401
export PROXY_PORT=50002

node src/server.js &

./electrs/target/release/electrs \
    -vvvv  --timestamp \
    --network regtest \
    --cookie-file "$DRIVE"/regtest/.cookie \
    --daemon-dir "$DRIVE" \
    --db-dir $ELECTRS_DATADIR \
    --daemon-rpc-addr "127.0.0.1:${BTC_RPC_PORT}" \
    --electrum-rpc-addr $ELECTRS_HOST:$ELECTRS_PORT
