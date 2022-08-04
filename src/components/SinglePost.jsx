import { useMutation, useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import moment from 'moment'
import React, { useContext, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, Form, Grid, Icon, Image, Label } from 'semantic-ui-react'
import { AuthContext } from '../context/Auth'
import DeleteButton from './DeleteButton'
import LikeButton from './LikeButton'

const FETCH_POST_QUERY = gql`
	query getPost($postId: ID!) {
		getPost(postId: $postId) {
			id
			body
			username
			createdAt
			comments {
				id
				body
				username
				createdAt
			}
			likes {
				id
				username
				createdAt
			}
			likeCount
			commentCount
		}
	}
`

const SUBMIT_COMMENT_MUTATION = gql`
	mutation createComment($postId: String!, $body: String!) {
		createComment(postId: $postId, body: $body) {
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

const SinglePost = () => {
	const navigate = useNavigate()
	const { postId } = useParams()
	const { user } = useContext(AuthContext)
	const [commentValue, setComment] = useState('')
	const commentInputRef = useRef()

	const { data, loading } = useQuery(FETCH_POST_QUERY, {
		onError(err) {
			console.error(err)
		},
		variables: {
			postId,
		},
	})

	const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
		update() {
			setComment('')
			commentInputRef.current.blur()
		},
		onError(err) {
			console.error(err)
		},
		variables: {
			postId,
			body: commentValue,
		},
	})

	if (loading) {
		return <p>Loading post...</p>
	}

	if (!loading && !data) {
		return <div>There is no such post</div>
	}

	const deletePostCallback = () => {
		navigate('/')
	}

	const {
		id,
		body,
		createdAt,
		username,
		comments,
		likes,
		likeCount,
		commentCount,
	} = data.getPost

	const postMarkup = (
		<Grid>
			<Grid.Row centered style={{ marginTop: '2.5rem' }}>
				<Grid.Column width={2}>
					<Image
						src='https://react.semantic-ui.com/images/avatar/large/molly.png'
						size='small'
						float='right'
					/>
				</Grid.Column>
				<Grid.Column width={10}>
					<Card fluid>
						<Card.Content>
							<Card.Header>{username}</Card.Header>
							<Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
							<Card.Description>{body}</Card.Description>
						</Card.Content>
						<hr />
						<Card.Content extra>
							<LikeButton user={user} post={{ id, likes, likeCount }} />
							<Button
								as='div'
								labelPosition='right'
								onClick={() => commentInputRef.current.focus()}
							>
								<Button basic color='blue'>
									<Icon name='comments' />
								</Button>
								<Label basic color='blue' pointing='left'>
									{commentCount}
								</Label>
							</Button>
							{user && user.username === username && (
								<DeleteButton postId={id} callback={deletePostCallback} />
							)}
						</Card.Content>
					</Card>
					{user && (
						<Card fluid>
							<Card.Content>
								<p>Post a comment</p>
								<Form>
									<div className='ui action input fluid'>
										<input
											type='text'
											placeholder='Comment...'
											name='comment'
											value={commentValue}
											onChange={e => setComment(e.target.value)}
											ref={commentInputRef}
										/>
										<button
											type='submit'
											className='ui button teal'
											disabled={commentValue.trim() === ''}
											onClick={submitComment}
										>
											Submit
										</button>
									</div>
								</Form>
							</Card.Content>
						</Card>
					)}
					{comments.map(comment => (
						<Card fluid key={comment.id}>
							<Card.Content>
								{user && user.username === comment.username && (
									<DeleteButton commentId={comment.id} postId={id} />
								)}
								<Card.Header>{comment.username}</Card.Header>
								<Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
								<Card.Description>{comment.body}</Card.Description>
							</Card.Content>
						</Card>
					))}
				</Grid.Column>
			</Grid.Row>
		</Grid>
	)

	return <div>{postMarkup}</div>
}

export default SinglePost
