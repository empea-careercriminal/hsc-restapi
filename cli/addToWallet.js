/*
 *  SPDX-License-Identifier: Apache-2.0
 */

'use strict';

/* Bring key classes into scope, most importantly Fabric SDK network class

1. Importing the Fabric SDK
2. Importing the Fabric SDK’s FileSystemWallet and X509WalletMixin
3. Creating a new FileSystemWallet
4. Creating a new X509WalletMixin
5. Creating a new wallet
6. Importing the admin certificate
7. Importing the admin identity
8. Importing the admin identity’s private key
9. Importing the admin identity’s certificate
*/
const fs = require('fs');
const { FileSystemWallet, X509WalletMixin } = require('fabric-network');
const path = require('path');

const fixtures = path.resolve(__dirname, '../../fabric-samples/hsc-first-network');

// A wallet stores a collection of identities
/*
The code above creates a wallet instance using the FileSystemWallet class and the relative path ../wallet.
*/
const wallet = new FileSystemWallet('../wallet');

// config
/*
1. The pathToUser variable is the path to the user’s certificate.
2. The pathToUserSignCert variable is the path to the user’s certificate.
3. The pathToUserPrivKey variable is the path to the user’s private key.
4. The identityLabel variable is the label for the user’s identity.
*/
let config = {
  pathToUser:'/crypto-config/peerOrganizations/org1.example.com/users/User1@org1.example.com',
  pathToUserSignCert: '/msp/signcerts/User1@org1.example.com-cert.pem',
  pathToUserPrivKey: '/msp/keystore/50e3884c17bd8f9ce334fc2c25b36c9332d70de8a47a8abcb8619d6ed79225ff_sk',
  identityLabel: 'User1@org1.example.com'
}


async function main() {

  /* Main try/catch block
  
  1. It first creates a path to the user’s credentials.
  2. It then reads the user’s certificate and private key from the file system.
  3. It then creates an identity from the certificate and private key.
  4. It then imports the identity into the wallet.
  */
  try {

    // Identity to credentials to be stored in the wallet
    /*
    It reads the user's certificate and private key from the file system and stores them in variables.
    */
    const credPath = path.join(fixtures, config.pathToUser);
    const cert = fs.readFileSync(path.join(credPath, config.pathToUserSignCert)).toString();
    const key = fs.readFileSync(path.join(credPath, config.pathToUserPrivKey)).toString();

    // Load credentials into wallet
    /*
    1. The identityLabel is a label that will be used to represent the identity in the wallet.
    2. The identity is created using the X509WalletMixin.createIdentity function.
    3. The X509WalletMixin.createIdentity function takes three parameters:
        * The MSPID of the organization that the identity belongs to.
        * The certificate of the identity.
        * The private key of the identity.
    */
    const identityLabel = config.identityLabel;
    const identity = X509WalletMixin.createIdentity('Org1MSP', cert, key);

    /*
    It imports the identity into the wallet.
    */
    await wallet.import(identityLabel, identity);

  } catch (error) {
    console.log(`Error adding to wallet. ${error}`);
    console.log(error.stack);
  }
}

/*
1. It first calls the main() function.
2. It then waits for the main() function to finish.
3. If main() finishes successfully, it prints “done” to the console.
4. If main() throws an error, it prints the error to the console, and prints the stack trace to the console.
5. Finally, it exits the process with a status code of -1.
*/
main().then(() => {
    console.log('done');
}).catch((e) => {
    console.log(e);
    console.log(e.stack);
    process.exit(-1);
});