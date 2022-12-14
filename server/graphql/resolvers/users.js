require('dotenv').config()

const { UserInputError } = require('apollo-server')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../../models/User')
const {
	validateRegisterInput,
	validateLoginInput,
} = require('../../utils/validators')

function generateToken(user) {
	return jwt.sign(
		{
			id: user.id,
			email: user.email,
			username: user.username,
		},
		process.env.SECRET_KEY,
		{ expiresIn: '1h' }
	)
}

module.exports = {
	Mutation: {
		async register(
			_,
			{ registerInput: { username, email, password, confirmPassword } }
		) {
			const { valid, errors } = validateRegisterInput(
				username,
				email,
				password,
				confirmPassword
			)

			if (!valid) {
				throw new UserInputError('Error', { errors })
			}

			const user = await User.findOne({ username })
			if (user) {
				throw new UserInputError('Username is taken', {
					errors: {
						username: 'This username is taken',
					},
				})
			}

			const hashedPassword = await bcrypt.hash(password, 12)

			const newUser = new User({
				email,
				username,
				password: hashedPassword,
				createdAt: new Date().toISOString(),
			})
			const result = await newUser.save()

			const token = generateToken(result)

			return {
				...result._doc,
				id: result._id,
				token,
			}
		},
		async login(_, { username, password }) {
			const { errors, valid } = validateLoginInput(username, password)
			const user = await User.findOne({ username })

			if (!user) {
				errors.general = 'User not found'
				throw new UserInputError('User not found', { errors })
			}

			if (!valid) {
				throw new UserInputError('Error', { errors })
			}

			const match = await bcrypt.compare(password, user.password)

			if (!match) {
				errors.general = 'Wrong credentials'
				throw new UserInputError('Wrong credentials', { errors })
			}

			const token = generateToken(user)

			return {
				...user._doc,
				id: user._id,
				token,
			}
		},
	},
}
