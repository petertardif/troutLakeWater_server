const { GraphQLServer } = require('graphql-yoga');
const { prisma } = require('./generated/prisma-client');
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
// const Subscription = require('./resolvers/Subscription')
const User = require('./resolvers/User')
const PermAddress = require('./resolvers/PermAddress')

const resolvers = {
	Query,
	Mutation,
	User,
	PermAddress
};

const server = new GraphQLServer({
	typeDefs: './src/schema.graphql',
	resolvers,
	context: request => {
		return {
			...request,
			prisma,
		}
	}
});
server.start(() => console.log(`Server is running on http://localhost:4000`));
