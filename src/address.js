const bitcoin = require('bitcoinjs-lib');

let address = 'bc1qkks4d484aluphnwreq6eta0gq9n9sw6mqw7nuk';

let script = bitcoin.address.toOutputScript(address);
let hash = bitcoin.crypto.sha256(script);
let reversedHash = Buffer.from(hash.reverse());

console.log(address, ' maps to ', reversedHash.toString('hex'));
