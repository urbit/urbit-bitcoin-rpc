#!/bin/sh
# Generate a cookie file for bitcoind's rpc by reading 32 bytes from /dev/urandom 
# and transposing them to hex.
set -e
echo -n "__cookie__:$(hexdump -vn 32 -e ' /1 "%02x"' /dev/urandom)" > cookiefile.secret
echo "Generated cookiefile.secret with following contents:"
cat cookiefile.secret
echo
