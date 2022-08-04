import { useMutation, gql } from '@apollo/client'

import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, Form } from 'semantic-ui-react'
import { AuthContext } from '../context/Auth'
import { useForm } from '../utils/hooks'

const REGISTER_USER = gql`
	mutation register(
		$username: String!
		$password: String!
		$confirmPassword: String!
		$email: String!
	) {
		register(
			registerInput: {
				username: $username
				password: $password
				confirmPassword: $confirmPassword
				email: $email
			}
		) {
			id
			email
			username
			createdAt
			token
		}
	}
`

const Register = () => {
	const location = useLocation()
	const context = useContext(AuthContext)

	const navigate = useNavigate()
	const [errors, setErrors] = useState({})

	useEffect(() => {
		if (context.user) {
			navigate('/')
		}
	}, [location])

	const initialState = {
		username: '',
		email: '',
		password: '',
		confirmPassword: '',
	}

	const { onChange, onSubmit, values } = useForm(registerUser, initialState)

	const [addUser, { loading }] = useMutation(REGISTER_USER, {
		update(_, { data: { register: userData } }) {
			context.login(userData)
			setErrors({})
			navigate('/', { replace: true })
		},
		onError(err) {
			setErrors(err.graphQLErrors[0].extensions.errors)
		},
		variables: values,
	})

	function registerUser() {
		addUser()
	}

	return (
		<div className='form-container'>
			<Form
				onSubmit={onSubmit}
				noValidate
				className={loading ? 'loading' : null}
			>
				<h1>Register</h1>
				<Form.Input
					label='Username'
					placeholder='Username...'
					name='username'
					type='text'
					value={values.username}
					onChange={onChange}
					error={errors.username}
				/>

				<Form.Input
					label='Email'
					placeholder='Email...'
					name='email'
					type='email'
					value={values.email}
					onChange={onChange}
					error={errors.email}
				/>

				<Form.Input
					label='Password'
					placeholder='Password...'
					name='password'
					type='password'
					value={values.password}
					onChange={onChange}
					error={errors.password}
				/>

				<Form.Input
					label='Confirm Password'
					placeholder='Confirm Password...'
					name='confirmPassword'
					type='password'
					value={values.confirmPassword}
					onChange={onChange}
					error={errors.confirmPassword}
				/>
				<Button type='submit' primary>
					Register
				</Button>
			</Form>
			{/* {Object.keys(errors).length > 0 ? (
				<div className='ui error message'>
					<u className='list'>
						{Object.values(errors).map(errorMessage => (
							<li key={errorMessage}>{errorMessage}</li>
						))}
					</u>
				</div>
			) : null} */}
		</div>
	)
}

export default Register
