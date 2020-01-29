import { verify } from 'jsonwebtoken';
import Cryptr from '../util/cryptr';

export default class Auth {
  static getCurrentUser(req, res, next) {
    const token = String(req.get('Authorization'));
    if (token && token.length > 0) {
      try {
        const decoded = verify(token, process.env.TK_CYPHER);
        const decrypted = Cryptr.decrypt(decoded.u);
        const currentUser = JSON.parse(decrypted);
        req.currentUser = currentUser;
        return next();
      } catch (err) {
        const newError = new Error('unauthorized');
        newError.status = 401;
        return next(newError);
      }
    } else {
      const newError = new Error('unauthorized');
      newError.status = 401;
      return next(newError);
    }
  }
}
