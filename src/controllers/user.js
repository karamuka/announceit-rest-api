import { UserModel } from '../models';

export default class UserController {
  static getAllAdvertisers(req, res, next) {
    UserModel.getAllAdvertisers(req.params.id)
      .then((advertiser) => {
        res.status(200)
          .json({
            status: 'success',
            data: advertiser,
          });
      }).catch(next);
  }

  static getOneAdvertiser(req, res, next) {
    UserModel.getOneAdvertiser(req.query)
      .then((advertisers) => {
        res.status(200)
          .json({
            status: 'success',
            data: advertisers,
          });
      }).catch(next);
  }
}
