import Joi from 'joi'

export default {
  listParams: Joi.object().keys({}),
  listSearchParams: Joi.object().keys({
    queryProp: Joi.string().required(),
    queryVal: Joi.string().required()
  }),
  listOneParams: Joi.object().keys({
    id: Joi.string().required()
  })
}