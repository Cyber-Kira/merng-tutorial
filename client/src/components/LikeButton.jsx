/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import { Link } from 'react-router-dom'
import { Button, Icon, Label } from 'semantic-ui-react'

const LIKE_POST_MUTATION = gql`
	mutation likePost($postId: ID!) {
		likePost(postId: $postId) {
			id
			likes {
				id
				username
			}
			likeCount
		}
	}
`

const LikeButton = ({ user, post: { id, likes, likeCount } }) => {
	const [likePost] = useMutation(LIKE_POST_MUTATION, {
		onError(err) {
			console.error(err)
		},
		variables: {
			postId: id,
		},
	})

	const [liked, setLiked] = useState(false)

	useEffect(() => {
		if (user && likes.find(like => like.username === user.username)) {
			setLiked(true)
		} else {
			setLiked(false)
		}
	}, [user, likes])

	const likeButton = user ? (
		liked ? (
			<Button color='teal'>
				<Icon name='heart' />
			</Button>
		) : (
			<Button color='teal' basic>
				<Icon name='heart' />
			</Button>
		)
	) : (
		<Button as={Link} to='/login' color='teal' basic>
			<Icon name='heart' />
		</Button>
	)

	return (
		<Button as='div' labelPosition='right' onClick={likePost}>
			{likeButton}
			<Label basic color='teal' pointing='left'>
				{likeCount}
			</Label>
		</Button>
	)
}

export default LikeButton
