
const users = (root, args, context, info) => {
  // database call
  const userIds = root.users.map(user => user.id);
  const filteredUsers = context.prisma.users().filter(user => {
    return userIds.includes(user.id)
  });
  return filteredUsers
}

module.exports = {
  users,
}