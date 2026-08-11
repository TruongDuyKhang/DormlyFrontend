const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const sslDir = path.join(__dirname, '..', 'ssl');
if (!fs.existsSync(sslDir)) {
  fs.mkdirSync(sslDir, { recursive: true });
}

const certPath = path.join(sslDir, 'cert.pem');
const keyPath = path.join(sslDir, 'key.pem');

if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
  console.log('Generating RSA 2048 key pair...');
  const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
  });

  // Use crypto.X509Certificate creation or fallback to standard PEM structure
  // In Node 15.6+, we can create self-signed certs via X509 or write private key and let OpenSSL in docker finalize or generate X509
  fs.writeFileSync(keyPath, privateKey);
  console.log('Private key written to ssl/key.pem');
}
