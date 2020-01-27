import { UserModel } from '../models';

export default class UserController {
  static getAdvertiser(req, res, next) {
    UserModel.getAdvertiser(req.params.id)
      .then((advertiser) => {
        res.status(200)
          .json({
            status: 'success',
            data: advertiser,
          });
      }).catch(next);
  }

  static getAdvertisers(req, res, next) {
    UserModel.getAdvertisers(req.query)
      .then((advertisers) => {
        res.status(200)
          .json({
            status: 'success',
            data: advertisers,
          });
      }).catch(next);
  }
}
