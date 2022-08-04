import { gql, useMutation } from '@apollo/client'
import React, { useState } from 'react'
import { Button, Confirm, Icon } from 'semantic-ui-react'
import { FETCH_POSTS_QUERY } from '../utils/graphql'

const DELETE_POST_MUTATION = gql`
	mutation deletePost($postId: ID!) {
		deletePost(postId: $postId)
	}
`

const DeleteButton = ({ postId, callback }) => {
	const [confirmOpen, setConfirmOpen] = useState(false)

	const [deletePost] = useMutation(DELETE_POST_MUTATION, {
		update(proxy) {
			setConfirmOpen(false)
			const data = proxy.readQuery({
				query: FETCH_POSTS_QUERY,
			})

			const newData = {
				getPosts: [],
			}

			newData.getPosts = data.getPosts.filter(post => post.id !== postId)
			proxy.writeQuery({ query: FETCH_POSTS_QUERY, data: newData })

			if (callback) callback()
		},
		onError(err) {
			console.error(err)
		},
		variables: {
			postId,
		},
	})

	return (
		<>
			<Button
				as='div'
				color='red'
				floated='right'
				onClick={() => setConfirmOpen(true)}
			>
				<Icon name='trash' style={{ margin: 0 }} />
			</Button>
			<Confirm
				open={confirmOpen}
				onCancel={() => setConfirmOpen(false)}
				onConfirm={() => deletePost()}
			/>
		</>
	)
}

export default DeleteButton
