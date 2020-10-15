#!/bin/bash
echo "------------ js-proxy-electrs ------------"
docker container logs --tail 10 js-proxy-electrs

echo "------------ electrs ---------------------"
docker container logs --tail 10 electrs

echo "------------ bitcoind --------------------"
docker container logs --tail 20 bitcoind
