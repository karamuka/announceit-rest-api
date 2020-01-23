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
