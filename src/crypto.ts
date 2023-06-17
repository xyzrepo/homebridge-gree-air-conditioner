import crypto from 'crypto';

const genericKey = 'a3K8Bx%2r8Y7#xDh';

export default {
  encrypt: (data, key = genericKey) => {
    const string = JSON.stringify(data);
    const cipher = crypto.createCipher('aes-128-ecb', key); // Use createCipher instead of createCipheriv
    let encrypted = cipher.update(string, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
  },
  decrypt: (data, key = genericKey) => {
    const decipher = crypto.createDecipher('aes-128-ecb', key); // Use createDecipher instead of createDecipheriv
    let decrypted = decipher.update(data, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
  },
};
