import React, { useState } from 'react';
import {
	Container,
	Paper,
	Grid,
	Button,
	MenuItem,
	FormControl,
	Select,
	InputLabel,
} from '@material-ui/core';
import Navbar from '../Navbar/Navbar';
import Recommend from '../Recommend/recommend';

const ForeignForm = () => {
	const [route, setRoute] = useState('');
	const [country, setCountry] = useState('India');
	const [profession, setProfession] = useState('student');

	const handleCountryChange = e => setCountry(e.target.value);

	const handleProfessionChange = e => setProfession(e.target.value);

	const formSubmitHandler = async e => {
		const uid = localStorage.getItem('id');
		setRoute(
			`/foreign/?uid=${uid}&profession=${profession}&country=${country}`
		);
	};

	return (
		<React.Fragment>
			<Navbar
				navItems={{
					newUser: true,
					viewMap: false,
					foreignTravel: false,
					recommend: true,
				}}
			/>
			<Container maxWidth='sm'>
				<h1 className='heading'> Specifications </h1>
				<Paper style={{ padding: 16 }} id='from_style'>
					<Grid container alignItems='flex-start' spacing={2}>
						<Grid item xs={6}>
							<FormControl fullWidth>
								<InputLabel id='demo-simple-select-label'>
									Profession
								</InputLabel>
								<Select
									labelId='demo-simple-select-label'
									id='demo-simple-select'
									value={profession}
									onChange={handleProfessionChange}>
									<MenuItem value={'student'}>
										Student
									</MenuItem>
									<MenuItem value={'travel'}>Travel</MenuItem>
									<MenuItem value={'work'}>Work</MenuItem>
								</Select>
							</FormControl>
						</Grid>

						<Grid item xs={6}>
							<FormControl fullWidth>
								<InputLabel id='demo-simple-select-label'>
									Country
								</InputLabel>
								<Select
									labelId='demo-simple-select-label'
									id='demo-simple-select'
									value={country}
									onChange={handleCountryChange}>
									<MenuItem value={'India'}>India</MenuItem>
									<MenuItem value={'USA'}>USA</MenuItem>
									<MenuItem value={'Great Britain'}>
										Great Britain
									</MenuItem>
									<MenuItem value={'Australia'}>
										Australia
									</MenuItem>
									<MenuItem value={'Russia'}>Russia</MenuItem>
								</Select>
							</FormControl>
						</Grid>

						<Grid item xs={12}>
							<div>
								<Button
									variant='contained'
									color='secondary'
									onClick={formSubmitHandler}>
									Submit
								</Button>
							</div>
						</Grid>
					</Grid>
				</Paper>
			</Container>
			{route.length !== 0 ? <Recommend route={route} /> : null}
		</React.Fragment>
	);
};

export default ForeignForm;
