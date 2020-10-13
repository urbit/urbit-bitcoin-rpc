#!/bin/bash
docker container logs js-proxy-electrs | tail -20
docker container logs bitcoind | tail -20
docker container logs electrs | tail -20

