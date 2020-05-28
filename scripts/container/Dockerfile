# Build Geth in a stock Go builder container
FROM golang:1.13-alpine as builder

RUN apk add --no-cache make gcc musl-dev linux-headers git

RUN git clone https://github.com/ethereum/go-ethereum /go-ethereum
RUN cd /go-ethereum && make all

# Pull all binaries into a second stage deploy alpine container
FROM alpine:latest

RUN apk add --no-cache ca-certificates
COPY --from=builder /go-ethereum/build/bin/* /usr/local/bin/

ADD ./keystore /gethdata/keystore
ADD ./genesis.json /gethdata/genesis.json
ADD ./password.txt /gethdata/password.txt
ADD ./start.sh /gethdata/start.sh
RUN chmod +x /gethdata/start.sh
RUN cat /gethdata/start.sh

RUN geth \
    --identity development \
    --networkid 15 \
    --datadir /data \
    init /gethdata/genesis.json

EXPOSE 8545 8546 8547 30303 30303/udp

ENTRYPOINT [ "/gethdata/start.sh" ]
