import Joi from 'joi'

export default {
  listParams: Joi.object().keys(),
  listSearchParams: Joi.object().keys({
    queryProp: Joi.string(),
    queryVal: Joi.string(),
  }),
  listOneParams: Joi.object().keys({
    id: Joi.string().required()
  }),
  updateParams: Joi.object().keys({
    regimen: {
      value: Joi.string().required(),
      label: Joi.string().required()
    },
    access_token: Joi.string().required()
  })
}