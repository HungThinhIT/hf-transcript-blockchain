// const Models = require('../models');
const { Gateway, Wallets } = require('fabric-network');
const sha256 = require('js-sha256');
const Constant = require('../libs/Constants');
const fs = require('fs');
const path = require('path');
const { BlockDecoder } = require("fabric-common");
const CCPandWallet = require('../fabrics/wallets');
const GatewayAndNetwork = require('../fabrics/gateway-network');

exports.addTranscript = async (studentID, transcript) => {
    try {
       const { ccp , wallet } = await CCPandWallet.getCCPAndWallet();

        // Check to see if we've already enrolled the admin user.
        const identity = await CCPandWallet.isIdentityExist(wallet, 'emailFIXEDTMP');
        if (!identity) {
            console.log('Admin identity can not be found in the wallet');
            return;
        }

        const { gateway, network } = await GatewayAndNetwork.createGatewayAndNetwork(ccp, wallet, 'emailFIXEDTMP', 'udn');

        // Get the contract from the network.
        const contract = network.getContract('transcript');

        const transaction = await contract.createTransaction('addNewTranscript');
        const result = await transaction.submit(studentID, JSON.stringify(transcript));

        const returnPayload = {
            trxID: transaction.getTransactionId(),
            // transaction: transaction
        }

        console.log("=========== RESULT ===========");
        console.log(result.toString('hex'));
        console.log("=========== TxID ===========");
        console.log(transaction.getTransactionId());
        console.log('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

        return returnPayload;
    } catch (error) {
        console.error(`Failed to enroll admin user "admin": ${error}`);
        process.exit(1);
    }
};

exports.beta = async (trxID) => {
    try {
        const ccpPath = path.resolve(__dirname, '../', '../','connection.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        const walletPath = path.join('/home/phoenix/hf-transcript-blockchain/vars/profiles/vscode/fabrics', 'it.vku.udn.vn');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the admin user.
        const identity = await wallet.get('Admin');
        if (! identity) {
            console.log('Admin identity can not be found in the wallet');
            return;
        }

        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'Admin', discovery: { enabled: true, asLocalhost: false } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('vku');

        // Get the contract from the network.
        const contract = network.getContract('qscc');
        const resultBlockByte = await contract.evaluateTransaction('GetBlockByTxID', "vku", trxID);

        let payloadBlockJson = await BlockDecoder.decode(resultBlockByte);

        const channelName = payloadBlockJson.data.data[0].payload.header.channel_header.channel_id;
        const blockNumber = payloadBlockJson.header.number.low;
        const createdAt = payloadBlockJson.data.data[0].payload.header.channel_header.timestamp;
        const trxId = payloadBlockJson.data.data[0].payload.header.channel_header.tx_id;
        const previousHash = payloadBlockJson.header.previous_hash.toString('hex');
        const dataHash = payloadBlockJson.header.data_hash.toString('hex');
        const signatureData = payloadBlockJson.data.data[0].signature.toString('hex');


        let blockDetail = {
            transactionId: trxId,
            channelName: channelName,
            blockNumber: blockNumber,
            createdAt: createdAt,
            signatureData: signatureData,
            blockHash: "... in progress",
            preHash: previousHash,
            dataHash: dataHash
        };

        // Disconnect from the gateway.
        await gateway.disconnect();

        return blockDetail;
    } catch (error) {
        console.error(`Failed to enroll admin user "admin": ${error}`);
        process.exit(1);
    }
}

exports.betaPost = async (payload) => {
    try {
        const user = payload.email;
        const credentials = payload.credentials;

        const ccpPath = path.resolve(__dirname, '../', '../','connection.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        const walletPath = path.join('/home/phoenix/hf-transcript-blockchain/vars/profiles/vscode/fabrics', 'it.vku.udn.vn');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the admin user.
        const identity = await wallet.get('admin');
        if (! identity) {
            console.log('admin identity can not be found in the wallet');
            return;
        }

        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'Admin', discovery: { enabled: true, asLocalhost: false } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('vku');

        // Get the contract from the network.
        const contract = network.getContract('qscc');
        const resultBlockByte = await contract.evaluateTransaction('GetBlockByTxID', "vku", trxID);

        let payloadBlockJson = await BlockDecoder.decode(resultBlockByte);

        const channelName = payloadBlockJson.data.data[0].payload.header.channel_header.channel_id;
        const blockNumber = payloadBlockJson.header.number.low;
        const createdAt = payloadBlockJson.data.data[0].payload.header.channel_header.timestamp;
        const trxId = payloadBlockJson.data.data[0].payload.header.channel_header.tx_id;
        const previousHash = payloadBlockJson.header.previous_hash.toString('hex');
        const dataHash = payloadBlockJson.header.data_hash.toString('hex');
        const signatureData = payloadBlockJson.data.data[0].signature.toString('hex');


        let blockDetail = {
            transactionId: trxId,
            channelName: channelName,
            blockNumber: blockNumber,
            createdAt: createdAt,
            signatureData: signatureData,
            blockHash: "... in progress",
            preHash: previousHash,
            dataHash: dataHash
        };

        // Disconnect from the gateway.
        await gateway.disconnect();

        return blockDetail;
    } catch (error) {
        console.error(`Failed to enroll admin user "admin": ${error}`);
        process.exit(1);
    }
}

