import { UserModel } from '../models';

export default class UserController {
  static getAdveriser(req, res, next) {
    UserModel.getAdveriser(req.params.id)
      .then((advertiser) => {
        res.status(200)
          .json({
            status: 'success',
            data: advertiser,
          });
      }).catch(next);
  }

  static getAdverisers(req, res, next) {
    UserModel.getAdverisers(req.query)
      .then((advertisers) => {
        res.status(200)
          .json({
            status: 'success',
            data: advertisers,
          });
      }).catch(next);
  }
}
