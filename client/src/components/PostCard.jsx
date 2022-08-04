import moment from 'moment'
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Card, Image, Button, Icon, Label } from 'semantic-ui-react'
import { AuthContext } from '../context/Auth'
import DeleteButton from './DeleteButton'
import LikeButton from './LikeButton'

const PostCard = ({
	post: { body, id, createdAt, username, likeCount, likes, commentCount },
}) => {
	const { user } = useContext(AuthContext)

	return (
		<Card fluid>
			<Card.Content>
				<Image
					floated='right'
					size='mini'
					src='https://react.semantic-ui.com/images/avatar/large/molly.png'
				/>
				<Card.Header>{username}</Card.Header>
				<Card.Meta as={Link} to={`/posts/${id}`}>
					{moment(createdAt).fromNow()}
				</Card.Meta>
				<Card.Description>{body}</Card.Description>
			</Card.Content>
			<Card.Content extra>
				<LikeButton user={user} post={{ id, likes, likeCount }} />
				<Button
					as='div'
					labelPosition='right'
					// onClick={commentOnPost}
				>
					<Button color='blue' basic>
						<Icon name='comments' />
					</Button>
					<Label basic color='blue' pointing='left'>
						{commentCount}
					</Label>
				</Button>
				{user && user.username === username && <DeleteButton postId={id} />}
			</Card.Content>
		</Card>
	)
}

export default PostCard
