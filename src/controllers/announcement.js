import { AnnouncementModel } from '../models';

export default class AnouncementController {
  static getAll(req, res, next) {
    AnnouncementModel.getAll(req.currentUser, req.query.status)
      .then((announcements) => {
        res.status(200)
          .json({
            status: 'success',
            data: announcements,
          });
      }).catch(next);
  }

  static getOne(req, res, next) {
    AnnouncementModel.getOne(req.currentUser, +req.params.id)
      .then((announcement) => {
        res.status(200)
          .json({
            status: 'success',
            data: announcement,
          });
      }).catch(next);
  }

  static create(req, res, next) {
    AnnouncementModel.create(req.currentUser, req.body)
      .then((announcement) => {
        res.status(201)
          .json({
            status: 'success',
            data: announcement,
          });
      }).catch(next);
  }

  static update(req, res, next) {
    AnnouncementModel.update(req.currentUser, +req.params.id, req.body)
      .then((message) => {
        res.status(200)
          .json({
            status: 'success',
            message,
          });
      }).catch(next);
  }

  static delete(req, res, next) {
    AnnouncementModel.delete(req.currentUser, +req.params.id)
      .then((message) => {
        res.status(200)
          .json({
            status: 'success',
            message,
          });
      }).catch(next);
  }
}
