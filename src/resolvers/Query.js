
const owners = (root, args, context, info) => {
  return context.prisma.owners();
}

const owner = (root, args, context, info) => {
  return context.prisma.owner({ id: args.id });
}

const sites = (root, args, context, info) => {
  return context.prisma.sites();
}

const site = (root, { id }, context, info) => {
  return context.prisma.site({ id: id });
}

module.exports = {
  owners,
  owner,
  sites,
  site
}