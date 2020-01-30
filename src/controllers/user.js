import { UserModel } from '../models';

export default class AnouncementController {
  static getAll(req, res, next) {
    UserModel.getAll(req.currentUser)
      .then((users) => {
        res.status(200)
          .json({
            status: 'success',
            data: users,
          });
      }).catch(next);
  }

  static getOne(req, res, next) {
    UserModel.getOne(req.currentUser, +req.params.id)
      .then((user) => {
        res.status(200)
          .json({
            status: 'success',
            data: user,
          });
      }).catch(next);
  }

  static delete(req, res, next) {
    UserModel.delete(req.currentUser, req.params.id)
      .then((message) => {
        res.status(200)
          .json({
            status: 'success',
            message,
          });
      }).catch(next);
  }
}
