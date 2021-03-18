function p_addresses(parent, args, context) {
  return context.prisma.user({ id: parent.id }).p_addresses()
}

module.exports = {
  p_addresses,
}