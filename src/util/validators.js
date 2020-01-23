const isValidEmail = (email) => {
  const parts = String(email).trim().split('@');
  return parts.length === 2 && !(/\W\./.test(parts[2]));
};

const isValidPassword = (password) => {
  const isLong = String(password).length >= 8;
  return isLong;
};

module.exports = {
  isValidEmail,
  isValidPassword,
};
