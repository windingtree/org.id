#!/usr/bin/env bash

# Exit script as soon as a command fails.
set -o errexit

docker build -t gethserver "${PWD}/management/container"
docker run --rm -it -p 8545:8545 -p 30303:30303 --name gethserver-01 gethserver 