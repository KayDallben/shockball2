import Joi from 'joi'

export default {
  listOneParams: Joi.object().keys({
    authorization_code: Joi.string().required()
  })
}