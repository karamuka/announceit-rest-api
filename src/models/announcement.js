import Joi from '@hapi/joi';

const announcementschema = Joi.object({
  owner: Joi.number()
    .required(),
  status: Joi.string()
    .default('pending'),
  text: Joi.string()
    .required(),
  title: Joi.string()
    .required(),
  startDate: Joi.date()
    .required(),
  endDate: Joi.date()
    .required(),
});

const announcements = [];

export default class AnouncementController {
  static getAll(currentUser, { limit = 0, offset = 10 }) {
    return new Promise((resolve) => {
      const data = announcements
        .filter((ancmt) => ancmt.owner === currentUser.id || currentUser.isAdmin)
        .slice(offset, offset + limit);
      resolve(data);
    });
  }

  static getOne(currentUser, anouncementId) {
    return new Promise((resolve, reject) => {
      const announcement = announcements.filter((ancmt) => ancmt.id === anouncementId);
      if (announcement) {
        const hasAccess = announcement.owner === currentUser.id || currentUser.isAdmin;
        if (hasAccess) {
          resolve(announcement);
        } else {
          const newError = new Error('access denied to that resource');
          newError.status = 401;
          reject(newError);
        }
      } else {
        const newError = new Error('no such announcement found');
        newError.status = 404;
        reject(newError);
      }
    });
  }

  static create(currentUser, newAnouncement) {
    return new Promise((resolve, reject) => {
      const { error } = announcementschema.validate({ ...newAnouncement, owner: currentUser.id });
      if (error) {
        const newError = new Error(error.message);
        newError.status = 422;
        reject(newError);
      } else {
        const newAnouncementId = Date.now();
        const announcement = { ...newAnouncement, id: newAnouncementId, owner: currentUser.id };
        announcements.push(announcement);
        resolve(announcement);
        console.log(announcements);
      }
    });
  }

  static update(currentUser, announcementId, newAnnouncement) {
    return new Promise((resolve, reject) => {
      const announcementIndex = announcements.findIndex((ancmt) => ancmt.id === announcementId);
      if (announcementIndex === -1) {
        const newError = new Error('no such announcement found');
        newError.status = 404;
        reject(newError);
      } else {
        const hasAccess = announcements[announcementIndex].owner === currentUser.id
         || currentUser.isAdmin;
        if (hasAccess) {
          const announcement = announcements[announcementIndex];
          Object.entries(newAnnouncement).forEach(([property, value]) => {
            announcement[property] = value;
          });
          announcements[announcementIndex] = announcement;
          resolve(announcement);
        } else {
          const newError = new Error('access denied to that resource');
          newError.status = 401;
          reject(newError);
        }
      }
    });
  }
}
