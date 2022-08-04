import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import moment from 'moment'
import React, { useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, Grid, Icon, Image, Label } from 'semantic-ui-react'
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

const SinglePost = () => {
	const navigate = useNavigate()
	const { postId } = useParams()
	const { user } = useContext(AuthContext)

	const { data, loading } = useQuery(FETCH_POST_QUERY, {
		onError(err) {
			console.error(err)
		},
		variables: {
			postId,
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
		// comments,
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
								onClick={() => console.log('Comment on post')}
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
				</Grid.Column>
			</Grid.Row>
		</Grid>
	)

	return <div>{postMarkup}</div>
}

export default SinglePost
