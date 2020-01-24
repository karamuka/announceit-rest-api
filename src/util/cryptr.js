<<<<<<< HEAD
import { createCipher, createDecipher } from 'crypto';

const key = '123';

export default class Cryptr {
  static encrypt(payload) {
    const cipher = createCipher('aes-256-cbc', key);
    let encrypted = cipher.update(payload, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  static decrypt(payload) {
    const decipher = createDecipher('aes-256-cbc', key);
    let decrypted = decipher.update(payload, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
=======
const { createCipher, createDecipher } = require('crypto');

const key = '123';

const encrypt = (payload) => {
  const cipher = createCipher('aes-256-cbc', key);
  let encrypted = cipher.update(payload, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

const decrypt = (payload) => {
  const decipher = createDecipher('aes-256-cbc', key);
  let decrypted = decipher.update(payload, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

module.exports = {
  encrypt,
  decrypt,
};
>>>>>>> fd665809b5f19e79f35ecb2e9ace26c64be94a49
