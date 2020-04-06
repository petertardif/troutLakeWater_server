const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// will use getOwnerId for any resolver that requires authentication
const { APP_SECRET, getOwnerId } = require('../utils')

async function signup(parent, args, context, info) {
  const password = await bcrypt.hash(args.password, 10)
  const owner = await context.prisma.createOwner({ ...args, password })
  const token = jwt.sign({ ownerId: owner.id }, APP_SECRET)

  return {
    token,
    owner,
  }
}

async function login(parent, args, context, info) {
  const owner = await context.prisma.owner({ email: args.email })
  if (!owner) {
    throw new Error('No such owner exists, please create an account.')
  }
  const valid = await bcrypt.compare(args.password, owner.password)
  if (!valid) {
    throw new Error('Invalid password')
  }

  const token = jwt.sign({ ownerId: owner.id }, APP_SECRET)

  return {
    token,
    owner,
  }
}

function createNewOwner(parent, args, context, info) {
  return context.prisma.createOwner({
    last_name: args.last_name,
    first_name: args.first_name,
    email: args.email,
    password: args.password,
    phone_number: args.phone_number
  });
}

module.exports = {
  signup,
  login,
  createNewOwner,
}