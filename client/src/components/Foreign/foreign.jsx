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
import Recommend from '../Recommend/recommend';

const ForeignForm = props => {
	const [route, setRoute] = useState('');
	const [country, setCountry] = useState('India');
	const [profession, setProfession] = useState('student');

	const handleCountryChange = e => setCountry(e.target.value);

	const handleProfessionChange = e => setProfession(e.target.value);

	const formSubmitHandler = async e => {
		// const uid = localStorage.getItem('id');
		const uid = '5f97e0f7fc13ae0b2000009a';
		setRoute(
			`/foreign/?uid=${uid}&profession=${profession}&country=${country}`
		);
	};

	const onBackPressHandler = e => {
		e.preventDefault();
		props.history.push('/recommend');
	};

	return (
		<React.Fragment>
			<div style={{ padding: '10px' }}>
				<Button
					variant='contained'
					color='secondary'
					onClick={onBackPressHandler}>
					Back
				</Button>
			</div>
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
