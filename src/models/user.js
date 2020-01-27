import jwt from 'jsonwebtoken';
import Joi from '@hapi/joi';
import Cryptr from '../util/cryptr';

const userSchema = Joi.object({
  email: Joi.string().required().email(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  password: Joi.string().required().min(8).max(30),
  phoneNumber: Joi.string().required().min(10).max(13),
  address: Joi.string().required(),
  isAdmin: Joi.boolean().default(false),
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
          const encrPayload = Cryptr.encrypt(JSON.stringify({ id: userId, isAdmin: false }));
          jwt.sign({ u: encrPayload }, process.env.TK_CYPHER, { expiresIn: '1 day' }, (err, token) => {
            if (err) {
              reject(err);
            } else {
              users.push({
                ...newUser,
                password: Cryptr.encrypt(newUser.password),
                id: userId,
              });

              resolve({
                id: userId,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
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
        const encrPayload = Cryptr.encrypt(
          JSON.stringify({ id: authUser.id, isAdmin: authUser.isAdmin }),
        );
        jwt.sign({ u: encrPayload }, process.env.TK_CYPHER, { expiresIn: '1 day' }, (err, token) => {
          if (err) {
            reject(err);
          } else {
            resolve({
              token,
              email,
              id: authUser.id,
              firstName: authUser.firstName,
              lastName: authUser.lastName,
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

  static getAdvertisers({ limit = 0, offset = 10 }) {
    return users.filter((user) => !user.is_admin).slice(offset, offset + limit);
  }
}
