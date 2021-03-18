const { getUserId } = require('../utils')

async function users(root, args, context, info) {
  const userId = getUserId(context);
  const requestingUserIsAdmin = await context.prisma.$exists.user({
    id: userId,
    role: 'ADMIN',
  })
  if (requestingUserIsAdmin) {
    return context.prisma.users();
  }
  throw new Error(
    'You must be an admin to view all Owners.'
  )
}

async function user(root, args, context, info) {
  const userId = getUserId(context);
  const requestingUserIsAdmin = await context.prisma.$exists.user({
    id: userId,
    role: 'ADMIN',
  })
  if (requestingUserIsAdmin) {
    return context.prisma.user({ id: args.id });
  }
  throw new Error(
    'You must be an admin to view an Owner.'
  )
}

const sites = (root, args, context, info) => {
  return context.prisma.sites();
}

async function site(root, { id }, context, info) {
  const userId = getUserId(context);
  const requestingUserIsOwner = await context.prisma.$exists.site({
    id,
    users: {
      id: userId,
      role: 'OWNER',
    },
  })
  const requestingUserIsAdmin = await context.prisma.$exists.user({
    id: userId,
    role: 'ADMIN',
  })

  if (requestingUserIsAdmin || requestingUserIsOwner) {
    return context.prisma.site({ id: id });
  }
  throw new Error(
    'Invalid permissions: you need to be an admin or owner of the site to view it.'
  )
}

module.exports = {
  users,
  user,
  sites,
  site
}