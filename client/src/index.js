import React from 'react'
import ReactDOM from 'react-dom/client'
import WithApolloProvider from './ApolloProvider'
import App from './App'

import 'semantic-ui-css/semantic.min.css'
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
	<React.StrictMode>
		<WithApolloProvider>
			<App />
		</WithApolloProvider>
	</React.StrictMode>
)
