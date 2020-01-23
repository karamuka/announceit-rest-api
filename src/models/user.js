const jwt = require('jsonwebtoken');
const Joi = require('@hapi/joi');
const { cryptr } = require('../util');

const userSchema = Joi.object({
  email: Joi.string().required().email(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  password: Joi.string().required().min(8).max(30),
  phoneNumber: Joi.string().required().min(10).max(13),
  address: Joi.string().required(),
  is_admin: Joi.boolean().required(),
});

const users = [];

const signUp = (newUser) => new Promise((resolve, reject) => {
  const { error } = userSchema.validate({ ...newUser, phoneNumber: String(newUser.phoneNumber) });
  if (error) {
    const newError = new Error(error.message);
    newError.status = 422;
    reject(newError);
  } else {
    const userExists = users.find((user) => user.email === newUser.email);
    if (userExists) {
      const newError = new Error('an account with that email already exists');
      newError.status = 400;
      reject(newError);
    } else {
      const userId = Date.now();
      jwt.sign({ id: userId }, process.env.TK_CYPHER, { expiresIn: '1 day' }, (err, token) => {
        if (err) {
          reject(err);
        } else {
          users.push({
            ...newUser,
            password: cryptr.encrypt(newUser.password),
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
  const encrPasswprd = cryptr.encrypt(password);
  const authUser = users.find((user) => user.email === email && user.password === encrPasswprd);
  if (authUser) {
    jwt.sign({ id: authUser.id }, process.env.TK_CYPHER, { expiresIn: '1 day' }, (err, token) => {
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
