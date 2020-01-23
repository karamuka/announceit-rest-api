const isValidEmail = (email) => {
  const parts = String(email).trim().split('@');
  return parts.length === 2 && !(/\W\./.test(parts[2]));
};

const isValidPassword = (password) => {
  const isLong = String(password).length >= 8;
  const hasCaps = String(password).includes(/[A-z]/g);
  const hasNumbers = String(password).includes(/[0-9]/g);
  return isLong && hasCaps && hasNumbers;
};

module.exports = {
  isValidEmail,
  isValidPassword,
};
