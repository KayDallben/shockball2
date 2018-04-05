import Joi from 'joi'

export default {
  listOneParams: Joi.object().keys({
    access_token: Joi.string().required()
  })
}