import React from 'react'
import { Button, Form } from 'semantic-ui-react'
import { useMutation, gql } from '@apollo/client'
import { useForm } from '../utils/hooks'
import { FETCH_POSTS_QUERY } from '../utils/graphql'

const CREATE_POST_MUTATION = gql`
	mutation createPost($body: String!) {
		createPost(body: $body) {
			id
			body
			createdAt
			username
			likes {
				id
				username
				createdAt
			}
			likeCount
			comments {
				id
				body
				username
				createdAt
			}
			commentCount
		}
	}
`

const PostForm = () => {
	const { values, onChange, onSubmit } = useForm(createPostCallback, {
		body: '',
	})

	const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
		update(proxy, result) {
			const data = proxy.readQuery({
				query: FETCH_POSTS_QUERY,
			})
			const newData = {
				getPosts: [],
			}

			newData.getPosts = [result.data.createPost, ...data.getPosts]

			proxy.writeQuery({ query: FETCH_POSTS_QUERY, data: newData })

			values.body = ''
		},
		onError(err) {
			// eslint-disable-next-line no-console
			console.error(err)
		},
		variables: values,
	})

	function createPostCallback() {
		createPost()
	}

	return (
		<>
			<Form onSubmit={onSubmit}>
				<h2>Create a post:</h2>
				<Form.Field>
					<Form.Input
						placeholder='Hi World!'
						name='body'
						onChange={onChange}
						value={values.body}
						error={error && error.message.length > 0}
					/>
					<Button type='submit' color='teal'>
						Submit
					</Button>
				</Form.Field>
			</Form>
			{error && (
				<div className='ui error message' style={{ marginBottom: '2rem' }}>
					<ul className='list'>
						<li>{error.graphQLErrors[0].message}</li>
					</ul>
				</div>
			)}
		</>
	)
}

export default PostForm
