import Joi from '@hapi/joi';

const anouncementSchema = Joi.object({
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

const anouncements = [];

export default class AnouncementController {
  static create(newAnouncement) {
    return new Promise((resolve, reject) => {
      const { error } = anouncementSchema.validate(newAnouncement);
      if (error) {
        const newError = new Error(error.message);
        newError.status = 422;
        reject(newError);
      } else {
        const newAnouncementId = Date.now();
        anouncements.push({ ...newAnouncement, id: newAnouncementId });
        resolve({ id: newAnouncementId, ...newAnouncement });
      }
    });
  }
}
