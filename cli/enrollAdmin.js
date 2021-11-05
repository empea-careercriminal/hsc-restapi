/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

/*
1. Importing the Fabric CA client library
2. Importing the Fabric Network library
3. Loading the connection profile
4. Creating a new FileSystemWallet for managing identities
5. Creating a new Fabric client
6. Connecting to the Fabric client
7. Creating a new identity for the admin user
8. Creating a new identity for the user
9. Importing the admin identity
10. Importing the user identity
*/
const FabricCAServices = require('fabric-ca-client');
const { FileSystemWallet, X509WalletMixin } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const ccpPath = path.resolve(__dirname, '..', '..', 'fabric-samples', 'hsc-first-network', 'connection-org1.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

async function main() {
  try {

    // Create a new CA client for interacting with the CA.
    /*
    1. The caInfo object contains the url, tlsCACerts and caName of the CA.
    2. The caTLSCACerts is the PEM encoded CA certificate.
    3. The ca object is an instance of FabricCAServices.
    */
    const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

    // Create a new file system based wallet for managing identities.
    /*
    1. It creates a new wallet object using the FileSystemWallet class.
    2. It creates a wallet path using the process.cwd() method.
    3. It creates a wallet path using the path.join() method.
    4. It prints the wallet path to the console.
    */
    const walletPath = path.join(process.cwd(), '../wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the admin user.
    /*
    1. First, it checks if an identity for the admin user already exists in the wallet.
    2. If an identity for the admin user does not exist in the wallet, it creates a new identity for the admin user using the `createIdentity` method.
    3. Finally, it returns.
    */
    const adminExists = await wallet.exists('admin');
    if (adminExists) {
        console.log('An identity for the admin user "admin" already exists in the wallet');
        return;
    }

    // Enroll the admin user, and import the new identity into the wallet.
    /*
    1. The first line calls the enroll method on the CA to enroll the admin user.
    2. The second line creates a new identity for the admin user.
    3. The third line imports the identity into the wallet.
    */
    const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
    const identity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
    await wallet.import('admin', identity);
    console.log('Successfully enrolled admin user "admin" and imported it into the wallet');

  } catch (error) {
    console.error(`Failed to enroll admin user "admin": ${error}`);
    process.exit(1);
  }
}

/*
The code above creates a function called main, which calls another function called main.
*/
main();
