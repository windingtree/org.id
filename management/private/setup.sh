#!/usr/bin/env sh

set -o errexit

rm -f ./.openzeppelin/private*.json # remove old deployment configs
orgid-tools --network development \
    cmd=task file=./management/private/priv-net-task.json \
    params=FROM:0xf9fb2fac0781b6c2b57d44b1890bcaec20a1cb38 \
    params=HOLDER1:0x8060f19e1b19923ad4b9d54ce64151ed403f9168 \
    params=HOLDER2:0xed2b5876354886089215cd9b501670f886c22faf