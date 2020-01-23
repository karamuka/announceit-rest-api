const { UserModel } = require('../models');

class UserController {
  static getOne(req, res, next) {
    UserModel.getOne(req.params)
      .then((user) => {
        res.status(200)
          .json({
            status: 'success',
            data: user,
          });
      }).catch(next);
  }
}

module.exports = UserController;
