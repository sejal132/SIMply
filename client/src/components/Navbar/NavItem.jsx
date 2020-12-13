import React from 'react'
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NavItem = (props) => {
	const getChild = (val) => {
		switch (val) {
			case 'newUser':
				return <Nav.Link><Link to='/signup'>New User</Link></Nav.Link>
			case 'viewMap':
				return <Nav.Link><Link to='/map'>View Map</Link></Nav.Link>
			case 'foreignTravel':
				return <Nav.Link><Link to='/foreign-travel'>Foreign Travel</Link></Nav.Link>
			case 'recommend':
				return <Nav.Link><Link to='/recommend'>Recommend</Link></Nav.Link>
			default:
				return null;
		}
	}
	return getChild(props.keyVal);
}

export default NavItem;