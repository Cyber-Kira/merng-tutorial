import { useMutation, gql } from '@apollo/client'

import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, Form } from 'semantic-ui-react'
import { AuthContext } from '../context/Auth'
import { useForm } from '../utils/hooks'

const LOGIN_USER = gql`
	mutation login($username: String!, $password: String!) {
		login(username: $username, password: $password) {
			id
			email
			username
			createdAt
			token
		}
	}
`

const Login = () => {
	const location = useLocation()
	const context = useContext(AuthContext)

	const navigate = useNavigate()
	const [errors, setErrors] = useState({})

	useEffect(() => {
		if (context.user) {
			navigate('/')
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location])

	const initialState = {
		username: '',
		password: '',
	}

	const { onChange, onSubmit, values } = useForm(
		loginUserCallback,
		initialState
	)

	const [loginUser, { loading }] = useMutation(LOGIN_USER, {
		update(_, { data: { login: userData } }) {
			context.login(userData)
			setErrors({})
			navigate('/', { replace: true })
		},
		onError(err) {
			setErrors(err.graphQLErrors[0].extensions.errors)
		},
		variables: values,
	})

	function loginUserCallback() {
		loginUser()
	}

	return (
		<div className='form-container'>
			<Form
				onSubmit={onSubmit}
				noValidate
				className={loading ? 'loading' : null}
			>
				<h1>Login</h1>
				<Form.Input
					label='Username'
					placeholder='Username...'
					name='username'
					type='text'
					value={values.username}
					onChange={onChange}
					error={
						errors.username || (errors.general && errors.general.length > 0)
					}
				/>

				<Form.Input
					label='Password'
					placeholder='Password...'
					name='password'
					type='password'
					value={values.password}
					onChange={onChange}
					error={
						errors.password || (errors.general && errors.general.length > 0)
					}
				/>
				<Button type='submit' primary>
					Login
				</Button>
			</Form>
			{Object.keys(errors).length > 0 && errors.general ? (
				<div className='ui error message'>
					<u className='list'>
						{Object.values(errors).map(errorMessage => (
							<li key={errorMessage}>{errorMessage}</li>
						))}
					</u>
				</div>
			) : null}
		</div>
	)
}

export default Login
