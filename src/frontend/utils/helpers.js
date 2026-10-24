// import { entities } from './types'
const {entities} = require('./types')

const findField = function (fieldName, entity, fields) {
  let field = null
  fields = !fields ? entities[entity] : fields
  if (!fieldName || !fields) {
    return 
  }
  Object.keys(fields).find((ef) => {
    if (field) {
      return
    } else if (fields[ef].type === 'button') {
      return
    } else if (fields[ef].type === 'group') {
      field = findField(fieldName, entity, fields[ef].items)
      return
    }else {
      if (fields[ef].name === fieldName) {
        field = fields[ef];
      }
    }
  })

  return field;
}

const validateFields = (entity, fields, data) => {
  let invalidFields = []
  fields.forEach((key) => {
    let field = findField(key, entity)
    if (field.required) {
      var isValid = (!!data[key] && !!data[key] !== "")
      if (!isValid) {
        invalidFields.push(key)
      }
    }
  })
  return invalidFields
}

const serverHost = 'http://' + process.env.VUE_APP_HOST + ':' + process.env.VUE_APP_PORT
const wsHost = 'ws://' +  process.env.VUE_APP_HOST + ':' +  process.env.VUE_APP_WS_PORT
// const serverHost = () => {
//   return 'http://' + process.env.VUE_APP_HOST + ':' + process.env.VUE_APP_PORT
// }

module.exports = { findField, validateFields, serverHost, wsHost };