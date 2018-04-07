import Joi from 'joi'

export default {
  listParams: Joi.object().keys({
    queryProp: Joi.string().required(),
    queryVal: Joi.string().required()
  })
}