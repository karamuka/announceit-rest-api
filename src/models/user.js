const jwt = require('jsonwebtoken');
const { isValidEmail } = require('../util').Validators;

const users = [];

const signUp = (newUser) => new Promise((resolve, reject) => {
  if (!isValidEmail(newUser.email)) {
    const newError = new Error('invalid email address');
    newError.status = 400;
    reject(newError);
  } else {
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
