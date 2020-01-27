import Joi from '@hapi/joi';

const announcementschema = Joi.object({
  owner: Joi.number()
    .required(),
  status: Joi.string()
    .default('pending'),
  text: Joi.string()
    .required(),
  startDate: Joi.date()
    .required(),
  endDate: Joi.date()
    .required(),
});

const announcements = [];

export default class AnouncementController {
  static create(newAnouncement) {
    return new Promise((resolve, reject) => {
      const { error } = announcementschema.validate(newAnouncement);
      if (error) {
        const newError = new Error(error.message);
        newError.status = 422;
        reject(newError);
      } else {
        const newAnouncementId = Date.now();
        announcements.push({ ...newAnouncement, id: newAnouncementId });
        resolve({ id: newAnouncementId, ...newAnouncement });
      }
    });
  }

  static update(announcementId, newAnnouncement) {
    return new Promise((resolve, reject) => {
      const announcementIndex = announcements.findIndex((ancmt) => ancmt.id === announcementId);
      if (announcementIndex === -1) {
        const newError = new Error(`no announcement with id ${announcementId} found`);
        newError.status = 422;
        reject(newError);
      } else {
        const announcement = announcements.find((ancmt) => ancmt.id === announcementId);
        Object.entries(newAnnouncement).forEach(([property, value]) => {
          announcement[property] = value;
        });
        announcements[announcementIndex] = announcement;
        resolve(announcement);
      }
    });
  }
}
