<<<<<<< HEAD
import jwt from 'jsonwebtoken';
import Joi from '@hapi/joi';
import Cryptr from '../util/cryptr';
=======
const jwt = require('jsonwebtoken');
const Joi = require('@hapi/joi');
const { cryptr } = require('../util');
>>>>>>> fd665809b5f19e79f35ecb2e9ace26c64be94a49

const userSchema = Joi.object({
  email: Joi.string().required().email(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  password: Joi.string().required().min(8).max(30),
  phoneNumber: Joi.string().required().min(10).max(13),
  address: Joi.string().required(),
  is_admin: Joi.boolean().required(),
<<<<<<< HEAD
});

const users = [];

export default class User {
  static signUp(newUser) {
    return new Promise((resolve, reject) => {
      const { error } = userSchema
        .validate({ ...newUser, phoneNumber: String(newUser.phoneNumber) });

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
                password: Cryptr.encrypt(newUser.password),
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
  }

  static signIn({ email, password }) {
    return new Promise((resolve, reject) => {
      const encrPasswprd = Cryptr.encrypt(password);
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
  }

  static getAdvertiser(id) {
    return new Promise((resolve, reject) => {
      const advertiser = users.find((user) => !user.is_admin && user.id === id);
      if (advertiser) {
        resolve(advertiser);
      } else {
        const newError = new Error('user not found');
        newError.string = 404;
        reject(newError);
      }
    });
  }

  static getAdvertisers(limit, offset) {
    return users.filter((user) => !user.is_admin).slice(offset, offset + limit);
  }
}
=======
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
>>>>>>> fd665809b5f19e79f35ecb2e9ace26c64be94a49
