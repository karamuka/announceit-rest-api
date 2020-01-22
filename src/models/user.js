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
    token: null,
  },
];

const signUp = (newUser) => new Promise((resolve, reject) => {
  const userExists = users.find((user) => user.email === newUser.email);
  if (userExists) {
    const newError = new Error('an account with that email already exists');
    newError.status = 400;
    reject(newError);
  } else {
    jwt.sign(newUser.email, process.env.TK_CYPHER, (err, token) => {
      if (err) {
        reject(err);
      } else {
        const userId = Date.now();
        users.push({
          ...newUser,
          id: userId,
          token,
        });
        resolve({
          id: userId,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          email: newUser.email,
          token,
        });
      }
    });
  }
});

const signIn = ({ email, password }) => new Promise((resolve, reject) => {
  const authUser = users.find((user) => user.email === email && user.password === password);
  if (authUser) {
    jwt.sign(authUser.email, process.env.TK_CYPHER, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          token,
          email,
          id: authUser.id,
          first_name: authUser.first_name,
          last_name: authUser.last_name,
        });
      }
    });
  } else {
    const newError = new Error('access denied');
    newError.status = 401;
    reject(newError);
  }
});

module.exports = {
  signUp,
  signIn,
};
