import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Container } from 'semantic-ui-react'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import MenuBar from './components/MenuBar'
import SinglePost from './components/SinglePost'
import { AuthProvider } from './context/Auth'

const App = () => {
	return (
		<AuthProvider>
			<Router>
				<Container>
					<MenuBar />
					<Routes>
						<Route exact path='/' element={<Home />} />
						<Route exact path='/login' element={<Login />} />
						<Route exact path='/register' element={<Register />} />
						<Route exact path='/posts/:postId' element={<SinglePost />} />
					</Routes>
				</Container>
			</Router>
		</AuthProvider>
	)
}

export default App
