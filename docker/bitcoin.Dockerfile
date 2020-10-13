FROM debian:10.5-slim

WORKDIR bitcoin
RUN apt-get update && apt-get install -y wget
RUN wget -q https://bitcoin.org/bin/bitcoin-core-0.20.1/bitcoin-0.20.1-x86_64-linux-gnu.tar.gz
RUN tar xvzf bitcoin-0.20.1-x86_64-linux-gnu.tar.gz && rm -f bitcoin-0.20.1-x86_64-linux-gnu.tar.gz

CMD ["./bitcoin-0.20.1/bin/bitcoind", "-datadir=/btc"]