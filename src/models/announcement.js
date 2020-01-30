import Joi from '@hapi/joi';
import { Db } from '../util';

const announcementschema = Joi.object({
  id: Joi.number().default(() => Date.now()),
  owner: Joi.number()
    .required(),
  status: Joi.string()
    .default('pending'),
  text: Joi.string()
    .required()
    .trim()
    .replace(/\s+/g, ' '),
  title: Joi.string()
    .required()
    .trim()
    .replace(/\s+/g, ' '),
  startDate: Joi.date()
    .required(),
  endDate: Joi.date()
    .required(),
});

export default class AnouncementController {
  static getAll(currentUser, status = '') {
    return new Promise((resolve, reject) => {
      const query = {
        text: 'select f_get_announcements($1,$2);',
        params: [currentUser, status],
      };
      Db.query(query)
        .then((queryRes) => {
          const results = queryRes.rows[0].f_get_announcements || [];
          resolve(results);
        })
        .catch(reject);
    });
  }

  static getOne(currentUser, announcementId) {
    return new Promise((resolve, reject) => {
      const query = {
        text: 'select f_get_announcement($1,$2);',
        params: [currentUser, announcementId],
      };
      Db.query(query)
        .then((queryRes) => {
          const results = queryRes.rows[0].f_get_announcement;
          if (results.status === 'success') {
            resolve(results.data);
          } else {
            const newError = new Error(results.message);
            newError.status = Number(results.status);
            reject(newError);
          }
        })
        .catch(reject);
    });
  }

  static create(currentUser, newAnouncement) {
    return new Promise((resolve, reject) => {
      const { error, value: validateOutput } = announcementschema
        .validate({
          ...newAnouncement,
          owner: currentUser.id,
        });
      if (error) {
        const newError = new Error(error.message);
        newError.status = 422;
        reject(newError);
      } else {
        const query = {
          text: 'select f_create_announcement($1,$2);',
          params: [currentUser, validateOutput],
        };
        Db.query(query)
          .then((queryRes) => {
            const results = queryRes.rows[0].f_create_announcement;
            resolve(results.data);
          })
          .catch(reject);
      }
    });
  }

  static update(currentUser, announcementId, announcementUpdate) {
    return new Promise((resolve, reject) => {
      const query = {
        text: 'select f_update_announcement($1,$2,$3);',
        params: [currentUser, announcementId, announcementUpdate],
      };
      Db.query(query)
        .then((queryRes) => {
          const results = queryRes.rows[0].f_update_announcement;
          if (results.status === 'success') {
            resolve(results.message);
          } else {
            const newError = new Error(results.message);
            newError.status = Number(results.status);
            reject(newError);
          }
        })
        .catch(reject);
    });
  }

  static delete(currentUser, announcementId) {
    return new Promise((resolve, reject) => {
      const query = {
        text: 'select f_delete_announcement($1,$2);',
        params: [currentUser, announcementId],
      };
      Db.query(query)
        .then((queryRes) => {
          const results = queryRes.rows[0].f_delete_announcement;
          if (results.status === 'success') {
            resolve(results.message);
          } else {
            const newError = new Error(results.message);
            newError.status = Number(results.status);
            reject(newError);
          }
        })
        .catch(reject);
    });
  }
}
