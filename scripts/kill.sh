bitcoin-cli -regtest stop
kill -9 $(lsof -t -i:50002)