import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import NavItem from './NavItem';
import { Link } from 'react-router-dom';

const NavbarComponent = props => {
	return (
		<Navbar bg='dark' variant='dark'>
			<Navbar.Brand>
				<Link to='/'>SIMply</Link>
			</Navbar.Brand>
			<Nav className='mr-auto'>
				<Nav.Link>
					<Link to='/'>Home</Link>
				</Nav.Link>
				{Object.keys(props.navItems).map(key => {
					if (props.navItems[key]) {
						return <NavItem key={key} keyVal={key} />;
					}
					return null;
				})}
			</Nav>
		</Navbar>
	);
};

export default NavbarComponent;
