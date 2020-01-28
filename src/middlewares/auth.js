import { verify } from 'jsonwebtoken';
import Cryptr from '../util/cryptr';
import { UserModel } from '../models';

export default class Auth {
  static getCurrentUser(req, res, next) {
    const token = String(req.get('Authorization'));
    if (token) {
      try {
        const decoded = verify(token, process.env.TK_CYPHER);
        const decrypted = Cryptr.decrypt(decoded.u);
        const currentUser = JSON.parse(decrypted);
        const userExists = UserModel.getAllUsers().find((user) => user.id === currentUser.id);
        if (userExists) {
          req.currentUser = currentUser;
          return next();
        }
        const newError = new Error('invalid session, please login again');
        newError.status = 401;
        return next(newError);
      } catch (err) {
        return next(err);
      }
    } else {
      const newError = new Error('unauthorized');
      newError.status = 401;
      return next(newError);
    }
  }
}
