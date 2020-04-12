function permAddresses(parent, args, context) {
  return context.prisma.owner({ id: parent.id }).permAddresses()
}

module.exports = {
  permAddresses,
}