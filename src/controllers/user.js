<<<<<<< HEAD
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
=======
const { UserModel } = require('../models');

class UserController {
  static getOne(req, res, next) {
    UserModel.getOne(req.params)
      .then((user) => {
        res.status(200)
          .json({
            status: 'success',
            data: user,
>>>>>>> fd665809b5f19e79f35ecb2e9ace26c64be94a49
          });
      }).catch(next);
  }
}
<<<<<<< HEAD
=======

module.exports = UserController;
>>>>>>> fd665809b5f19e79f35ecb2e9ace26c64be94a49
