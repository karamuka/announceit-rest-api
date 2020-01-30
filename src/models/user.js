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
                results.data.token = token;
                resolve(results);
              });
            } else {
              const newError = new Error(results.message);
              newError.status = +results.status;
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
              results.data.token = token;
              resolve(results);
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

  static getAll(currentUser) {
    return new Promise((resolve, reject) => {
      const query = {
        text: 'select f_get_users($1);',
        params: [currentUser],
      };
      Db.query(query)
        .then((queryRes) => {
          const results = queryRes.rows[0].f_get_users;
          if (results.status === 'success') {
            resolve(results.data);
          } else {
            const newError = new Error(results.message);
            newError.status = +results.status;
            reject(newError);
          }
        })
        .catch(reject);
    });
  }

  static delete(currentUser, userId) {
    return new Promise((resolve, reject) => {
      const query = {
        text: 'select f_delete_user($1,$2);',
        params: [currentUser, userId],
      };
      Db.query(query)
        .then((queryRes) => {
          const results = queryRes.rows[0].f_delete_user;
          if (results.status === 'success') {
            resolve(results.message);
          } else {
            const newError = new Error(results.message);
            newError.status = +results.status;
            reject(newError);
          }
        })
        .catch(reject);
    });
  }
}
