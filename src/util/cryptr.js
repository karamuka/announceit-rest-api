import { createCipher, createDecipher } from 'crypto';

export default class Cryptr {
  static encrypt(payload) {
    const key = process.env.TK_CYPHER;
    const cipher = createCipher('aes-256-cbc', key);
    let encrypted = cipher.update(payload, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  static decrypt(payload) {
    const key = process.env.TK_CYPHER;
    const decipher = createDecipher('aes-256-cbc', key);
    let decrypted = decipher.update(payload, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
