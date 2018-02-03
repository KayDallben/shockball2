import Joi from 'joi'

export default {
  listOneParams: Joi.object().keys({
    id: Joi.number().required()
  })
}