function createdBy(parent, args, context) {
  return context.prisma.owner({ id: parent.id }).createdBy()
}

module.exports = {
  createdBy,
}