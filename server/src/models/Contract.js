import Joi from 'joi'

export default {
  listParams: Joi.object().keys({
    queryProp: Joi.string().required(),
    queryVal: Joi.string().required(),
    access_token: Joi.string().required()
  }),
  listOneParams: Joi.object().keys({
    id: Joi.string().required()
  })
}