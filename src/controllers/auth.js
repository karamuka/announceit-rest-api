import { UserModel } from '../models';

export default class AuthController {
  static signUp(req, res) {
    UserModel.signUp(req.body)
      .then((newUser) => {
        res.status(201).json(newUser);
      })
      .catch((err) => {
        res.status(err.status || 500)
          .json({
            status: 'error',
            error: err.message || err,
          });
      });
  }

  static signIn(req, res) {
    UserModel.signIn(req.body)
      .then((authUser) => {
        res.status(201)
          .json(authUser);
      })
      .catch((err) => {
        res.status(err.status || 500)
          .json({
            status: 'error',
            error: err.message,
          });
      });
  }
}
