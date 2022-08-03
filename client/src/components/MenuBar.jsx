import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'

const MenuBar = () => {
	const location = useLocation()
	const path = location.pathname === '/' ? 'home' : location.pathname.slice(1)
	const [activeItem, setActiveItem] = useState(path)

	const handleItemClick = (_, { name }) => setActiveItem(name)

	return (
		<div>
			<Menu pointing secondary size='massive' color='teal'>
				<Menu.Item
					name='home'
					active={activeItem === 'home'}
					onClick={handleItemClick}
					as={Link}
					to='/'
				/>
				<Menu.Menu position='right'>
					<Menu.Item
						name='login'
						active={activeItem === 'login'}
						onClick={handleItemClick}
						as={Link}
						to='/login'
					/>
					<Menu.Item
						name='register'
						active={activeItem === 'register'}
						onClick={handleItemClick}
						as={Link}
						to='/register'
					/>
				</Menu.Menu>
			</Menu>
		</div>
	)
}

export default MenuBar
