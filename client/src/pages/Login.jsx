import { useMutation, gql } from '@apollo/client'

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Form } from 'semantic-ui-react'
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
	const navigate = useNavigate()
	const [errors, setErrors] = useState({})

	const initialState = {
		username: '',
		password: '',
	}

	const { onChange, onSubmit, values } = useForm(
		loginUserCallback,
		initialState
	)

	const [loginUser, { loading }] = useMutation(LOGIN_USER, {
		update(_, result) {
			// eslint-disable-next-line no-console
			console.log(result)
			setErrors({})
			navigate('/', { replace: true })
		},
		onError(err) {
			console.log(err.graphQLErrors[0].extensions.errors)
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
