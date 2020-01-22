const jwt = require('jsonwebtoken');

const users = [
  {
    id: 1,
    email: '“email”',
    first_name: 'john',
    last_name: 'doe',
    password: '123',
    phoneNumber: 'String',
    address: 'String',
    is_admin: true,
    token: '',
  },
];

const createUser = (user) => new Promise((resolve, reject) => {
  const newUserId = Date.now();
  const newUser = { ...user, id: newUserId, tokens: [] };
  jwt.sign(newUser.email, process.env.TK_CYPHER, {}, (err, token) => {
    if (err) {
      reject(err);
    } else {
      newUser.token = token;
      users.push(newUser);
      resolve(newUser);
    }
  });
});

module.exports = {
  createUser,
};
