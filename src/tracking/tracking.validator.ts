import * as Joi from 'joi';

export const createsTrackingModel = Joi.object().keys({
  lat: Joi.number().required(),
  lon: Joi.number().required(),
  id: Joi.string().required()
});
