import React from 'react'
import {
	ApolloClient,
	ApolloProvider,
	createHttpLink,
	InMemoryCache,
} from '@apollo/client'
import { setContext } from 'apollo-link-context'

const uri = 'https://merng-tutorial-server.herokuapp.com/'

const authLink = setContext(() => {
	const token = localStorage.getItem('jwtToken')
	return {
		headers: {
			Authorization: token ? `Bearer ${token}` : '',
		},
	}
})

const httpLink = createHttpLink({
	uri,
})

const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
})

export default function WithApolloProvider({ children }) {
	return <ApolloProvider client={client}>{children}</ApolloProvider>
}
