const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// will use getUserId for any resolver that requires authentication
const { APP_SECRET, getUserId } = require('../utils')

async function signup(parent, args, context, info) {
  const password = await bcrypt.hash(args.password, 10)
  const user = await context.prisma.createUser({ ...args, password })
  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user,
  }
}

async function login(parent, args, context, info) {
  const user = await context.prisma.user({ primary_email: args.primary_email })
  if (!user) {
    throw new Error('No such user exists, please create an account.')
  }
  const valid = await bcrypt.compare(args.password, user.password)
  if (!valid) {
    throw new Error('Invalid password')
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user,
  }
}

async function createNewUser(parent, args, context, info) {
  const userId = getUserId(context);
  const requestingUserIsAdmin = await context.prisma.$exists.user({
    id: userId,
    role: 'ADMIN',
  })
  if (requestingUserIsAdmin) {
    return context.prisma.createUser({
      last_name: args.last_name,
      first_name: args.first_name,
      primary_email: args.primary_email,
      alt_email: args.alt_email,
      password: args.password,
      perm_phone_number: args.perm_phone_number,
      other_phone_number: args.other_phone_number
    });
  }
  throw new Error(
    'You must be an admin to create a new User.'
  )
}

function createPermAddress(parent, args, context, info) {
  const userId = getUserId(context)
  return context.prisma.createPermAddress({
    address: args.address,
    city: args.city,
    state: args.state,
    zip_code: args.zip_code,
    createdBy: { connect: { id: userId } },
  })
}

async function createSite(parent, args, context, info) {
  const userId = getUserId(context);
  const requestingUserIsAdmin = await context.prisma.$exists.user({
    id: userId,
    role: 'ADMIN',
  })
  if (requestingUserIsAdmin) {
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
  throw new Error(
    'You must be an admin to create a new site.'
  )
}

async function createBill(parent, args, context, info) {
  const userId = getUserId(context);
  const requestingUserIsAdmin = await context.prisma.$exists.user({
    id: userId,
    role: 'ADMIN',
  })
  if (requestingUserIsAdmin) {
    return context.prisma.createBill({
      year: args.year,
      payment_due: args.payment_due,
      site: args.site
    });
  }
  throw new Error(
    'You must be an admin to create bills.'
  )
}

async function createPayment(parent, args, context, info) {
  const userId = getUserId(context);
  const requestingUserIsAdmin = await context.prisma.$exists.user({
    id: userId,
    role: 'ADMIN',
  })
  const requestingUserIsOwner = await context.prisma.$exists.bill({
    site: {
      users: {
        id: userId,
        role: 'OWNER',
      },
    }
  })
  if (requestingUserIsAdmin || requestingUserIsOwner) {
    return context.prisma.createPayment({
      paid: true,
      payment_type: args.payment_type,
      bills: args.bills
    });
  }
  throw new Error(
    'You are trying to pay someone else\'s bills or your are not an admin'
  )
}

module.exports = {
  signup,
  login,
  createNewUser,
  createSite,
  createPermAddress,
  createBill,
  createPayment
}