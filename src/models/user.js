import jwt from 'jsonwebtoken';
import Joi from '@hapi/joi';

import Cryptr from '../util/cryptr';
import { Db } from '../util';

const { TK_CYPHER } = process.env;

const userSchema = Joi.object({
  id: Joi.number().default(() => Date.now()),
  email: Joi.string()
    .required()
    .email(),
  firstName: Joi.string()
    .required()
    .trim()
    .regex(/^[a-zA-Z]+$/, { name: 'must contain only alphabet characters' })
    .lowercase(),
  lastName: Joi.string()
    .required()
    .trim()
    .regex(/^[a-zA-Z]+$/, { name: 'must contain only alphabet characters' })
    .lowercase(),
  password: Joi.string()
    .required()
    .min(8)
    .max(30),
  phoneNumber: Joi.string()
    .required()
    .regex(/^\d+$/, { name: 'must be a valid phone number' })
    .min(10)
    .max(12),
  address: Joi.string()
    .required()
    .trim()
    .replace(/\s+/g, ' '),
  isAdmin: Joi.boolean()
    .default(false),
});

const users = [];

export default class User {
  static signUp(userInfo) {
    return new Promise((resolve, reject) => {
      const { error, value: newUser } = userSchema
        .validate({
          ...userInfo,
          phoneNumber: String(userInfo.phoneNumber),
        });
      if (error) {
        const newError = new Error(error.message);
        newError.status = 422;
        reject(newError);
      } else {
        const query = {
          text: 'select f_signup($1);',
          params: [newUser],
        };
        Db.query(query)
          .then((queryRes) => {
            const results = queryRes.rows[0].f_signup;
            if (results.status === 'success') {
              const encrPayload = Cryptr.encrypt(
                JSON.stringify({
                  id: results.data.id,
                  isAdmin: results.data.isAdmin,
                }),
              );
              jwt.sign({ u: encrPayload }, TK_CYPHER, { expiresIn: '1 day' }, (err, token) => {
                if (err) {
                  reject(err);
                } else {
                  results.data.token = token;
                  resolve(results);
                }
              });
            } else {
              const newError = new Error(results.message);
              newError.status = 422;
              reject(newError);
            }
          })
          .catch(reject);
      }
    });
  }

  static signIn(userCredentials) {
    return new Promise((resolve, reject) => {
      const query = {
        text: 'select f_signin($1);',
        params: [userCredentials],
      };
      Db.query(query)
        .then((queryRes) => {
          const results = queryRes.rows[0].f_signin;
          if (results.status === 'success') {
            const encrPayload = Cryptr.encrypt(
              JSON.stringify({
                id: results.data.id,
                isAdmin: results.data.isAdmin,
              }),
            );
            jwt.sign({ u: encrPayload }, TK_CYPHER, { expiresIn: '1 day' }, (err, token) => {
              if (err) {
                reject(err);
              } else {
                results.data.token = token;
                resolve(results);
              }
            });
          } else {
            const newError = new Error(results.message);
            newError.status = 401;
            reject(newError);
          }
        })
        .catch(reject);
    });
  }

  static getOneAdvertiser(id) {
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

  static getAllAdvertisers({ limit = 0, offset = 10 }) {
    return users.filter((user) => !user.is_admin).slice(offset, offset + limit);
  }
}
