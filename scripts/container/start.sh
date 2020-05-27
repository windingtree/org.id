#!/usr/bin/env sh

geth \
    --identity development \
    --networkid 15 \
    --nousb \
    --ipcdisable \
    --nodiscover \
    --maxpeers 0 \
    --rpc \
    --rpcaddr 0.0.0.0 \
    --rpccorsdomain "*" \
    --rpcapi debug,web3,eth,personal,miner,net \
    --ws \
    --wsaddr 0.0.0.0 \
    --wsorigins "*" \
    --wsapi debug,web3,eth,personal,miner,net \
    --mine \
    --miner.threads 1 \
    --datadir /data \
    --keystore /gethdata/keystore \
    --allow-insecure-unlock \
    --unlock 0xf9fb2fac0781b6c2b57d44b1890bcaec20a1cb38,0x8060f19e1b19923ad4b9d54ce64151ed403f9168,0xed2b5876354886089215cd9b501670f886c22faf,0xba85636c46b959e14b484d77e513e522efaac668,0x608f52e92ce1f22d518a076b569512b66c7266ad,0xa284d6724ab7d8194b0d894c74c34318c1319391,0xa3e88ebb257a8f5fd84407752d6f398ab2017b29,0x22be231c3e89230d0db8711b83ce418d8ee04893,0xdf1e51b52b3840361d53e86fecff9b5d53e99471,0x9e8db406afa39f2c9427face163c745fbdcedd79 \
    --password /gethdata/password.txt