import Joi from 'joi'

export default {
  listParams: Joi.object().keys({
    queryProp: Joi.string().required(),
    queryVal: Joi.string().required(),
    access_token: Joi.string().required()
  }),
  listOneParams: Joi.object().keys({
    id: Joi.string().required()
  }),
  create: Joi.object().keys({
    playerName: Joi.string().required(),
    playerUid: Joi.string().required(),
    purchasePrice: Joi.string().required(),
    currentSeason: Joi.number().required(),
    acceptedDuration: Joi.number().required(),
    status: Joi.string().required(),
    teamName: Joi.string().required(),
    teamUid: Joi.string().required()
  }),
}