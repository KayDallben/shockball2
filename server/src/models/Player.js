import Joi from 'joi'

export default {
  listParams: Joi.object().keys({}),
  listOneParams: Joi.object().keys({
    id: Joi.string().required()
  })
}