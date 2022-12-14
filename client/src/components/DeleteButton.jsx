import { gql, useMutation } from '@apollo/client'
import React, { useState } from 'react'
import { Button, Confirm, Icon, Popup } from 'semantic-ui-react'
import { FETCH_POSTS_QUERY } from '../utils/graphql'

const DELETE_POST_MUTATION = gql`
	mutation deletePost($postId: ID!) {
		deletePost(postId: $postId)
	}
`

const DELETE_COMMENT_MUTATION = gql`
	mutation deleteComment($postId: ID!, $commentId: ID!) {
		deleteComment(postId: $postId, commentId: $commentId) {
			id
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

const DeleteButton = ({ postId, commentId, callback }) => {
	const [confirmOpen, setConfirmOpen] = useState(false)

	const mutation = !commentId ? DELETE_POST_MUTATION : DELETE_COMMENT_MUTATION

	const [deletePostOrMutation] = useMutation(mutation, {
		update(proxy) {
			setConfirmOpen(false)
			if (!commentId) {
				const data = proxy.readQuery({
					query: FETCH_POSTS_QUERY,
				})
				const newData = {
					getPosts: [],
				}
				newData.getPosts = data.getPosts.filter(post => post.id !== postId)
				proxy.writeQuery({ query: FETCH_POSTS_QUERY, data: newData })
			}

			if (callback) callback()
		},
		onError(err) {
			console.error(err)
		},
		variables: {
			postId,
			commentId,
		},
	})

	return (
		<>
			<Popup
				inverted
				content={commentId ? 'Delete comment' : 'Delete post'}
				trigger={
					<Button
						as='div'
						color='red'
						floated='right'
						onClick={() => setConfirmOpen(true)}
					>
						<Icon name='trash' style={{ margin: 0 }} />
					</Button>
				}
			/>
			<Confirm
				open={confirmOpen}
				onCancel={() => setConfirmOpen(false)}
				onConfirm={() => deletePostOrMutation()}
			/>
		</>
	)
}

export default DeleteButton
