import { AnnouncementModel } from '../models';

export default class AnouncementController {
  static create(req, res, next) {
    AnnouncementModel.create(req.body)
      .then((announcement) => {
        res.status(200)
          .json({
            status: 'success',
            data: announcement,
          });
      }).catch(next);
  }
}
