/* eslint-disable no-console */
require('dotenv').config()

const { ApolloServer } = require('apollo-server')
const mongoose = require('mongoose')

const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ req }) => req,
})

mongoose
	.connect(process.env.MONGODB)
	.then(() => {
		console.log('MongoDB Connected')
		return server.listen('5000')
	})
	.then(res => {
		console.log(`Server is running on ${res.url}`)
	})
