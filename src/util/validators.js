const isValidEmail = (email) => {
  const parts = String(email).trim().split('@');
  return parts.length === 2 && !(/\W\./.test(parts[2]));
};

module.exports = {
  isValidEmail,
};
