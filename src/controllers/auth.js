const { UserModel } = require('../models');

class AuthController {
  static signUp(req, res, next) {
    UserModel.createUser(req.body)
      .then((newUser) => {
        res.status(201)
          .json({
            status: 'success',
            data: {
              ...newUser,
            },
          });
      }).catch(next);
  }
}

module.exports = AuthController;
