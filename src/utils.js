const jwt = require('jsonwebtoken')
const APP_SECRET = 'IfIWasBobMarleyIdSayCouldYouBeLoved';

function getOwnerId(context) {
  const Authorization = context.request.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const { ownerId } = jwt.verify(token, APP_SECRET)
    return ownerId
  }

  throw new Error('Not authenticated')
}

module.exports = {
  APP_SECRET,
  getOwnerId,
}