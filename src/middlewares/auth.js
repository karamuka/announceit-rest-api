import { verify } from 'jsonwebtoken';
import Cryptr from '../util/cryptr';

export default class Auth {
  static attachCredentials(req, res, next) {
    const token = req.get('Authorization');
    if (token) {
      verify(token, process.env.TK_CYPHER, {}, (err, decoded) => {
        if (err) {
          const newError = new Error(err.message);
          newError.status = 401;
          next(newError);
        } else {
          const currentUser = JSON.parse(Cryptr.decrypt(decoded.u));
          req.currentUser = currentUser;
          next();
        }
      });
    } else {
      const newError = new Error('unauthorized');
      newError.status = 401;
      next(newError);
    }
  }
}
