/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

/*
1. Importing the Fabric SDK modules
2. Creating a new wallet
3. Creating a new gateway
4. Connecting to the gateway
5. Creating a new user
6. Creating a new identity for the user
7. Importing the connection profile
8. Creating a new channel
9. Joining the channel
10. Creating a new chaincode
11. Invoking the chaincode
12. Querying the chaincode
*/

const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const path = require('path');

const ccpPath = path.resolve(__dirname, '..', '..', 'fabric-samples', 'hsc-first-network', 'connection-org1.json');

/*
Creates a configuration object that contains the user's name and the user's affiliation.
*/
let config = {
  userName: 'userHsc',
  affiliation: 'org1.department1'
}

async function main() {
  try {

    // Create a new file system based wallet for managing identities.
    /*
    1. It creates a new wallet object using the wallet path.
    2. It then logs the wallet path to the console.
    */
    const walletPath = path.join(process.cwd(), '../wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    /*
    1. First, it checks if the user already exists in the wallet.
    2. If the user does not exist, it creates a new identity for the user.
    3. If the user already exists, it prints a message to the console.
    */
    const userExists = await wallet.exists(config.userName);
    if (userExists) {
        console.log('An identity for the user "'+config.userName+'" already exists in the wallet');
        return;
    }

    // Check to see if we've already enrolled the admin user.
    /*
    1. First, it checks if the identity for the admin user exists in the wallet. If it does not exist, it will print out an error message and exit.
    2. If the identity for the admin user exists in the wallet, it will then check if the identity has already been enrolled. If it has not been enrolled, it will enroll the admin user using the enrollAdmin.js application.
    3. If the identity for the admin user has already been enrolled, it will print out a message indicating that the admin user has already been enrolled.
    */
    const adminExists = await wallet.exists('admin');
    if (!adminExists) {
        console.log('An identity for the admin user "admin" does not exist in the wallet');
        console.log('Run the enrollAdmin.js application before retrying');
        return;
    }

    // Create a new gateway for connecting to our peer node.
    /*
    1. Create a Gateway object
    2. Connect to the gateway
    3. Create a wallet
    4. Create an identity
    5. Enable discovery
    6. Connect to the gateway using the wallet and identity
    */
    const gateway = new Gateway();
    await gateway.connect(ccpPath, { wallet, identity: 'admin', discovery: { enabled: true, asLocalhost: true } });

    // Get the CA client object from the gateway for interacting with the CA.
    // It creates a new gateway object and connects to the network.
    const ca = gateway.getClient().getCertificateAuthority();
    const adminIdentity = gateway.getCurrentIdentity();

    // Register the user, enroll the user, and import the new identity into the wallet.
    // Calls the register method of the CA client to register a user with the CA. The CA client needs to be initialized
    // with the CA server's URL and the admin's identity's certificate and private key. The register method takes in the
    // user's affiliation, enrollmentID and role and returns the user's secret.
    const secret = await ca.register({ affiliation: config.affiliation, enrollmentID: config.userName, role: 'client' }, adminIdentity);

    // Enrollement
    /*
    1. The first line calls the enroll() method of the Fabric CA client to enroll the admin user.
    2. The second line creates a new identity for the admin user by using the X509WalletMixin.createIdentity() method.
    3. The third line imports the identity into the wallet.
    */
    const enrollment = await ca.enroll({ enrollmentID: config.userName, enrollmentSecret: secret });
    const userIdentity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
    await wallet.import(config.userName, userIdentity);
    console.log('Successfully registered and enrolled admin user "'+config.userName+'" and imported it into the wallet');

  } catch (error) {
    console.error(`Failed to register user "${config.userName}": ${error}`);
    process.exit(1);
  }
}

main();
