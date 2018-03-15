import Joi from 'joi'

export default {
  listParams: Joi.object().keys({}),
  listOneParams: Joi.object().keys({
    access_token: Joi.string().required()
  })
}