function createdBy(parent, args, context) {
  return context.prisma.user({ id: parent.id }).createdBy()
}

module.exports = {
  createdBy,
}