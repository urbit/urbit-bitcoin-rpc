#!/bin/sh
#set -ex
# Check if bitcoind container is running.
if ! docker-compose ps --services --filter status=running |grep -q bitcoind ;
then
  echo "ERROR: The bitcoind container is not running.\nERROR: Start the container with the command 'docker-compose up' and try again." >&2
  exit 1
fi
docker-compose exec bitcoind /bin/sh -c 'cat /btc/.cookie' | cut -f 2 -d ':'
