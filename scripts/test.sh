#!/usr/bin/env bash

# Exit script as soon as a command fails.
set -o errexit

# Executes cleanup function at script exit.
trap cleanup EXIT

cleanup() {
  # Kill the ganache instance that we started (if we started one and if it's still running).
  if [ -n "$ganache_pid" ] && ps -p $ganache_pid > /dev/null; then
    kill -9 $ganache_pid
  fi
}

if [ "$SOLIDITY_COVERAGE" = true ]; then
  ganache_port=8555
else
  ganache_port=8545
fi

start_ganache() {
  if [ "$SOLIDITY_COVERAGE" = true ]; then
    echo "Testing coverage mode"
    # solidity-coverage will runs it own instance
  else
    npx ganache-cli --gasLimit 0xfffffffffff --gasPrice 0x01 --port "$ganache_port" --accounts 20 --defaultBalanceEther 1000000 > /dev/null &
    ganache_pid=$!
    echo "Server is listening on the port $ganache_port (pid: $ganache_pid)"
  fi
}

ganache_running() {
  nc -z localhost "$ganache_port"
}

if ganache_running; then
  echo "Using existing ganache instance"
else
  echo "Starting our own ganache instance"
  start_ganache
fi

export NODE_ENV=test

npx truffle compile --all

if [ "$SOLIDITY_COVERAGE" = true ]; then
  npx truffle run coverage

  if [ "$CONTINUOUS_INTEGRATION" = true ]; then
    cat coverage/lcov.info | npx coveralls
  fi
else
  npx truffle test "$@" -f
fi
