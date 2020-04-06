
const owners = (root, args, context, info) => {
  // database call
  const ownerIds = root.owners.map(owner => owner.id);
  const filteredOwners = context.prisma.owners().filter(owner => {
    return ownerIds.includes(owner.id)
  });
  return filteredOwners
}

module.exports = {
  owners,
}