#!/bin/bash
docker image build --rm -f docker/bitcoin.Dockerfile -t bitcoin-core .
docker image build --rm -f docker/js-proxy-electrs.Dockerfile -t js-proxy-electrs .
docker image build --rm -f docker/electrs.Dockerfile -t electrs .
