// const Models = require('../models');
const Constant = require('../libs/Constants');
const FabricWalletsHelper = require('../fabrics/wallets');
const FabricCAServices = require('fabric-ca-client');

const setErrorReturn = async (errorCode, msg) => {
    return {
        message: msg,
        errorCode: errorCode,
        success: false,
        identity: null,
    };
}

const setSuccessReturn = async (msg, identity) => {
    return {
        message: msg,
        errorCode: null,
        success: true,
        identity: identity
    };
}

const createNewCA = async (ccp, org) => {
    const caInfo = ccp.certificateAuthorities[org];
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    return new FabricCAServices(caInfo.url, {trustedRoots: caTLSCACerts, verify: false}, caInfo.caName);
}

exports.enrollAdmin = async (orgInfo) => {
    try {
        const { ccp, wallet } = await FabricWalletsHelper.getCCPAndWallet();

        // Check to see if we've already enrolled the admin user.
        const adminUser = orgInfo.email;

        const identity = await wallet.get(adminUser);
        if (identity) {
            console.log('An identity for the admin user "admin" already exists in the wallet.');
            return setErrorReturn(1, `An identity for the admin user ${adminUser} already exists in the wallet.`);
        }

        // const org = 'ca1.vku.udn.vn';//TMP
        const org = `ca1.${orgInfo.mspid}`; // mspid must same name with CA
        const ca = await createNewCA(ccp, org);

        // Enroll the admin user, and import the new identity into the wallet.
        // const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
        const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: orgInfo.mspid,
            type: 'X.509',
        };
        await wallet.put(adminUser, x509Identity);
        console.log('Successfully enrolled admin user "admin" and imported it into the wallet');
        return setSuccessReturn('Enroll Admin successfully', x509Identity)
    } catch (error) {
        console.error(`Failed to enroll admin user "admin": ${error}`);
        console.log(error);
        return setErrorReturn(100, '[Fabric API]: '+ error.message);
    }
};

exports.registerUser = async (orgInfo) => {
    try {
        const caOrg = `ca1.${orgInfo.mspid}`;
        const requireCA = { caOrg: caOrg };

        const { ccp, wallet } = await FabricWalletsHelper.getCCPAndWallet(requireCA);
        // const userIdentity = await wallet.get('appUser');
        const userIdentity = await wallet.get(email);

        if (userIdentity) {
            console.log(`An identity for the user "${orgInfo.email}" already exists in the wallet`);
            return setErrorReturn(1, `Account ${orgInfo.email} already exist in the wallet`);
        }

        // Check to see if we've already enrolled the admin user.
        const adminIdentity = await wallet.get('admin');
        if (!adminIdentity) {
            console.log('An identity for the admin user "admin" does not exist in the wallet');
            return setErrorReturn(1, `Admin account does not exist in the wallet`);
        }

        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'admin');

        // const org = 'ca1.vku.udn.vn';//TMP
        const ca = await createNewCA(ccp, caOrg);

        // Register the user, enroll the user, and import the new identity into the wallet.
        const secret = await ca.register({
            // affiliation: 'it.vku.udn.vn',
            // enrollmentID: 'appUser',
            enrollmentID: orgInfo.email,
            role: 'client'
        }, adminUser);

        const enrollment = await ca.enroll({
            // enrollmentID: 'appUser',
            enrollmentID: orgInfo.email,
            enrollmentSecret: secret
        });
        // const mspId = await FabricWalletsHelper.getMspId(ccp,'vku.udn.vn');
        const mspId = await FabricWalletsHelper.getMspId(ccp, orgInfo.mspid);
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            // mspId: 'Org1MSP',
            mspId: mspId,
            type: 'X.509',
        };
        // await wallet.put('appUser', x509Identity);
        await wallet.put(email, x509Identity);
        console.log(`Successfully registered and enrolled user ${email} and imported it into the wallet`);
        return setSuccessReturn(Constant.messages.REGISTER_USER_SUCCESS, x509Identity)
    } catch (error) {
        console.error(`Failed to enroll user ": ${error}`);
        console.log(error);
        // process.exit(1);
        return setErrorReturn(100, '[Fabric API]: '+ error.message);
    }
}