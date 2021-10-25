#!/bin/bash
# Script to install chaincode onto a peer node
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_ID=cli
export CORE_PEER_ADDRESS=172.30.127.73:7002
export CORE_PEER_TLS_ROOTCERT_FILE=/vars/keyfiles/peerOrganizations/it.vku.udn.vn/peers/peer1.it.vku.udn.vn/tls/ca.crt
export CORE_PEER_LOCALMSPID=it-vku-udn-vn
export CORE_PEER_MSPCONFIGPATH=/vars/keyfiles/peerOrganizations/it.vku.udn.vn/users/Admin@it.vku.udn.vn/msp
cd /go/src/github.com/chaincode/transcript


if [ ! -f "transcript_node_1.1.tar.gz" ]; then
  peer lifecycle chaincode package transcript_node_1.1.tar.gz \
    -p /go/src/github.com/chaincode/transcript/node/ \
    --lang node --label transcript_1.1
fi

peer lifecycle chaincode install transcript_node_1.1.tar.gz