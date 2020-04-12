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
  const owner = await context.prisma.owner({ primary_email: args.primary_email })
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
    primary_email: args.primary_email,
    alt_email: args.alt_email,
    password: args.password,
    perm_phone_number: args.perm_phone_number,
    other_phone_number: args.other_phone_number
  });
}

function createPermAddress(parent, args, context, info) {
  const ownerId = getOwnerId(context)
  return context.prisma.createPermAddress({
    address: args.address,
    city: args.city,
    state: args.state,
    zip_code: args.zip_code,
    createdBy: { connect: { id: ownerId } },
  })
}

function createSite(parent, args, context, info) {
  return context.prisma.createSite({
    site_number: args.site_number,
    tl_road_side: args.tl_road_side,
    tl_address: args.tl_address,
    land_company: args.land_company,
    owners_association: args.owners_association,
    trout_lake_water: args.trout_lake_water,
    site_phone_number: args.site_phone_number
  });
}

module.exports = {
  signup,
  login,
  createNewOwner,
  createSite,
  createPermAddress
}