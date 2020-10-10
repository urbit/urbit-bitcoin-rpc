#!/bin/bash
docker image build --rm -t bitcoin-core .
docker container run --rm \
       -v /Volumes/sandisk/BTC:/btc \
       -p 8332:8332 -p 8333:8333 \
       -it bitcoin-core

# inside Docker it should run:
# ./bitcoin-0.20.1/bin/bitcoind -datadir=/btc
