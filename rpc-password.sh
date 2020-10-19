#!/bin/bash
RPC=$(cat /Volumes/sandisk/BTC/.cookie)
echo ${RPC:11}
# bitcoin-cli -rpcuser=__cookie__ -rpcpassword=${RPC:11} getblockcount
