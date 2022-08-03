import React from 'react'
import {
	ApolloClient,
	ApolloProvider,
	createHttpLink,
	InMemoryCache,
} from '@apollo/client'

const uri = 'http://localhost:5000'

const httpLink = createHttpLink({
	uri,
})

const client = new ApolloClient({
	link: httpLink,
	cache: new InMemoryCache(),
})

export default function WithApolloProvider({ children }) {
	return <ApolloProvider client={client}>{children}</ApolloProvider>
}
