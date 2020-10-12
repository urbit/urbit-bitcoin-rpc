docker container run --rm \
       -p  50002:50002 \
       --network btc-network \
       --name js-proxy-electrs \
       -it js-proxy-electrs