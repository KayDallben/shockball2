//es6+ javascript selected! Can delete this comment
import Joi from 'joi'

export default {
  listOneParams: Joi.object().keys({
    uid: Joi.string().required()
  })
}
