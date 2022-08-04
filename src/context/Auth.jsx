import jwtDecode from 'jwt-decode'
import React, { createContext, useReducer } from 'react'

const initialState = {
	user: null,
}

if (localStorage.getItem('jwtToken')) {
	const decodedToken = jwtDecode(localStorage.getItem('jwtToken'))

	if (decodedToken.exp * 1000 < Date.now()) {
		localStorage.removeItem('jwtToken')
	} else {
		initialState.user = decodedToken
	}
}

const AuthContext = createContext({
	user: null,
	// eslint-disable-next-line no-unused-vars
	login: userData => {},
	logout: () => {},
})

function authReducer(state, action) {
	switch (action.type) {
		case 'LOGIN':
			return {
				...state,
				user: action.payload,
			}
		case 'LOGOUT':
			return {
				...state,
				user: null,
			}

		default:
			return state
	}
}

function AuthProvider(props) {
	const [state, dispatch] = useReducer(authReducer, initialState)

	function login(userData) {
		localStorage.setItem('jwtToken', userData.token)

		dispatch({
			type: 'LOGIN',
			payload: userData,
		})
	}

	function logout() {
		localStorage.removeItem('jwtToken')

		dispatch({
			type: 'LOGOUT',
		})
	}

	return (
		<AuthContext.Provider
			// eslint-disable-next-line react/jsx-no-constructed-context-values
			value={{ user: state.user, login, logout }}
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...props}
		/>
	)
}

export { AuthContext, AuthProvider }
