#!/bin/bash
BTC_DATADIR=/Volumes/sandisk/BTC

docker network create btc-network
# docker image build --rm -t bitcoin-core .
docker container run --rm \
       -v  $BTC_DATADIR:/btc \
       -p 8332:8332 -p 8333:8333 \
       --network btc-network \
       --name bitcoind \
       -it bitcoin-core

# inside Docker it should run:
# ./bitcoin-0.20.1/bin/bitcoind -datadir=/btc
