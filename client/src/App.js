import React, { useState, useEffect } from 'react';
import './App.css';
import SignupForm from './components/Form/form';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Recommend from './components/Recommend/recommend';

function App() {
	const [id, setId] = useState('');

	useEffect(() => {
		setId(localStorage.getItem('id'));
	}, []);

	let component = <Route path='/' component={SignupForm} />;

	if (id && id.length !== 0) {
		console.log(id);
		component = <Route path='/' component={Recommend} />;
	}

	return <Router>{component}</Router>;
}

export default App;
