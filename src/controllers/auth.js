import { UserModel } from '../models';

export default class AuthController {
  static signUp(req, res, next) {
    UserModel.signUp(req.body)
      .then((newUser) => {
        res.status(201).json(newUser);
      })
      .catch(next);
  }

  static signIn(req, res, next) {
    UserModel.signIn(req.body)
      .then((authUser) => {
        res.status(201)
          .json(authUser);
      })
      .catch(next);
  }
}
