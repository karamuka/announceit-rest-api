import { UserModel } from '../models';

<<<<<<< HEAD
export default class AuthController {
=======
class AuthController {
>>>>>>> fd665809b5f19e79f35ecb2e9ace26c64be94a49
  static signUp(req, res) {
    UserModel.signUp(req.body)
      .then((newUser) => {
        res.status(201)
          .json({
            status: 'success',
            data: {
              ...newUser,
            },
          });
      })
      .catch((err) => {
        res.status(err.status || 500)
          .json({
            status: 'error',
            error: err.message || err,
          });
      });
<<<<<<< HEAD
=======
  }

  static signIn(req, res) {
    UserModel.signIn(req.body)
      .then((authUser) => {
        res.status(200)
          .json({
            status: 'success',
            data: {
              ...authUser,
            },
          });
      })
      .catch((err) => {
        res.status(err.status || 500)
          .json({
            status: 'error',
            error: err.message || err,
          });
      });
>>>>>>> fd665809b5f19e79f35ecb2e9ace26c64be94a49
  }

  static signIn(req, res) {
    UserModel.signIn(req.body)
      .then((authUser) => {
        res.status(200)
          .json({
            status: 'success',
            data: {
              ...authUser,
            },
          });
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
