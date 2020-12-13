import React, { useState, useEffect } from 'react';
import './App.css';
import {
	BrowserRouter as Router,
	Redirect,
	Route,
	Switch,
} from 'react-router-dom';
import SignupForm from './components/Form/SignupForm';
import Recommend from './components/Recommend/recommend';
import Foreign from './components/Foreign/foreign';
import HeroSection from './components/Hero Section/HeroSection';
import Map from './components/MapDisplay/Map';

function App() {
	const [id, setId] = useState('');

	useEffect(() => {
		const uid = localStorage.getItem('id');
		if (uid) {
			setId(uid);
		}
	}, []);

	return (
		<React.Fragment>
			{/* <Header /> */}
			<Router>
				<Switch>
					<Route exact path='/map' component={Map} />
					<Route exact path='/' render={() => <HeroSection id={id} />} />
					<Route exact path='/foreign-travel' component={Foreign} />
					<Route exact path='/recommend' component={Recommend} />
					<Route exact path='/signup' component={SignupForm} />
				</Switch>
			</Router>
		</React.Fragment>
	);
}

export default App;
