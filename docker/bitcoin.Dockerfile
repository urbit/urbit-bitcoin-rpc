FROM debian:10.6-slim

WORKDIR bitcoin
ENV BITCOIN_VERSION=0.20.1
ENV BITCOIN_SHA256=376194f06596ecfa40331167c39bc70c355f960280bd2a645fdbf18f66527397
RUN apt-get update \
      && apt-get install -y wget \
      && mkdir -p /opt/bitcoin \
      && echo "Starting download of bitcoind... https://bitcoin.org/bin/bitcoin-core-${BITCOIN_VERSION}/bitcoin-${BITCOIN_VERSION}-x86_64-linux-gnu.tar.gz" \
      && wget --progress=dot:giga --show-progress -q https://bitcoin.org/bin/bitcoin-core-${BITCOIN_VERSION}/bitcoin-${BITCOIN_VERSION}-x86_64-linux-gnu.tar.gz \
      && echo "${BITCOIN_SHA256} bitcoin-${BITCOIN_VERSION}-x86_64-linux-gnu.tar.gz" \
        | sha256sum --check --status \
      && tar xvzf bitcoin-${BITCOIN_VERSION}-x86_64-linux-gnu.tar.gz --strip-components=1 -C /opt/bitcoin \
      && rm -f bitcoin-${BITCOIN_VERSION}-x86_64-linux-gnu.tar.gz \
      && apt-get remove -y wget \
      && apt-get autoremove -y \
      && apt-get clean \
      && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/bitcoin

CMD ["./bin/bitcoind", "-prune=0", "-datadir=/btc"]
