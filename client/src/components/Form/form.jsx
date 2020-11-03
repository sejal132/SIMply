import React, { useState, useEffect } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import {
	Container,
	Paper,
	Grid,
	TextField,
	Button,
	MenuItem,
	FormControl,
	Select,
	InputLabel,
} from '@material-ui/core';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import axios from 'axios';
import './Error.css';

const SignupForm = props => {
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [costPerMonth, setCostPerMonth] = useState(0);
	const [planExpiry, setPlanExpiry] = useState(new Date().toISOString());
	const [lat, setLat] = useState(0);
	const [long, setLong] = useState(0);
	const [amountPerDay, setAmountPerDay] = useState(1);
	const [provider, setProvider] = useState('Jio');

	const [errors, setErrors] = useState({
		firstName: '',
		lastName: '',
		email: '',
		costPerMonth: '',
	});

	const handleFirstNameChange = e => setFirstName(e.target.value);

	const handleLastNameChange = e => setLastName(e.target.value);

	const handleEmailChange = e => setEmail(e.target.value);

	const handleCostChange = e => { 
		if(e.target.value > 401) {
			setCostPerMonth(401);
		} else {
			setCostPerMonth(e.target.value);
		}
	};

	const handleDateChange = date => {
		const dateString = `${
			date.getMonth() + 1
		}/${date.getDate()}/${date.getFullYear()}`;
		console.log(dateString);
		setPlanExpiry(dateString);
	};

	const handleProviderChange = e => setProvider(e.target.value);

	const handleAmountChange = e => setAmountPerDay(e.target.value);

	const isFormValid = () => {
		let formIsValid = true;
		if (!firstName) {
			formIsValid = false;
			setErrors(prevErrors => ({
				...prevErrors,
				firstName: '*First Name cannot be empty',
			}));
		}
		if (!lastName) {
			formIsValid = false;
			setErrors(prevErrors => ({
				...prevErrors,
				lastName: '*Last Name cannot be empty',
			}));
		}
		if (!email) {
			formIsValid = false;
			setErrors(prevErrors => ({
				...prevErrors,
				email: "*Email can't be Empty",
			}));
		} else {
			let pattern = new RegExp(
				/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
			);
			if (!pattern.test(email)) {
				formIsValid = false;
				setErrors(prevErrors => ({
					...prevErrors,
					errors: '*Please enter valid Email ID',
				}));
			}
		}
		if(costPerMonth === 0 || !costPerMonth) {
			formIsValid = false;
			setErrors(prevErrors => ({
				...prevErrors,
				costPerMonth: '*Cost per month cannot be zero or null'
			}));
		}
		return formIsValid;
	};

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(position => {
			setLat(position.coords.latitude);
			setLong(position.coords.longitude);
		});
	}, []);

	const formSubmitHandler = async e => {
		if(isFormValid()) {
			const dataObj = {
				firstName: firstName,
				lastName: lastName,
				email: email,
				planExpiry: planExpiry,
				lat: lat,
				long: long,
				amountPerDay: amountPerDay,
				provider: provider,
			};
			await axios.post('http://localhost:3000/adduser', dataObj);
			setErrors({
				firstName: '',
				lastName: '',
				email: '',
				costPerMonth: '',
			})
		} else {
			e.preventDefault();
		}
	};

	return (
		<Container maxWidth='sm'>
			<h1 className='heading'> SIGN UP </h1>
			<Paper style={{ padding: 16 }} id='from_style'>
				<MuiPickersUtilsProvider utils={DateFnsUtils}>
					<Grid container alignItems='flex-start' spacing={2}>
						<Grid item xs={12}>
							<TextField
								fullWidth
								required
								error={errors.firstName !== '' ? true : false}
								name='firstName'
								value={firstName}
								type='text'
								label='First Name'
								helperText={errors.firstName}
								onChange={handleFirstNameChange}
							/>
						</Grid>

						<Grid item xs={12}>
							<TextField
								fullWidth
								required
								error={errors.lastName !== '' ? true : false}
								name='lastName'
								value={lastName}
								type='text'
								label='Last Name'
								helperText={errors.lastName}
								onChange={handleLastNameChange}
							/>
						</Grid>

						<Grid item xs={12}>
							<TextField
								fullWidth
								required
								error={errors.email !== '' ? true : false}
								name='email'
								value={email}
								type='email'
								label='Email'
								helperText={errors.email}
								onChange={handleEmailChange}
							/>
						</Grid>

						<Grid item xs={12}>
							<TextField
								fullWidth
								required
								error={errors.costPerMonth}
								name='costPerMonth'
								value={costPerMonth}
								InputProps={{
									inputProps: {
										min: 0,
										max: 401
									}
								}}
								type='number'
								label='Cost per month'
								helperText={errors.costPerMonth}
								onChange={handleCostChange}
							/>
						</Grid>

						<Grid item xs={12}>
							<DatePicker
								fullWidth
								label='Expiry of Plan'
								format='dd/MM/yyyy'
								minDate={Date.now()}
								maxDate={
									new Date(
										new Date().setFullYear(
											new Date().getFullYear() + 1
										)
									)
								}
								value={new Date(planExpiry)}
								onChange={handleDateChange}
								KeyboardButtonProps={{
									'aria-label': 'change date',
								}}
							/>
						</Grid>

						<Grid item xs={6}>
							<FormControl fullWidth>
								<InputLabel id='demo-simple-select-label'>
									Service Provider
								</InputLabel>
								<Select
									labelId='demo-simple-select-label'
									id='demo-simple-select'
									value={provider}
									onChange={handleProviderChange}>
									<MenuItem value={'Jio'}>Jio</MenuItem>
									<MenuItem value={'Vodafone'}>
										Vodafone
									</MenuItem>
									<MenuItem value={'Idea'}>Idea</MenuItem>
									<MenuItem value={'Airtel'}>Airtel</MenuItem>
									<MenuItem value={'BSNL'}>BSNL</MenuItem>
								</Select>
							</FormControl>
						</Grid>

						<Grid item xs={6}>
							<FormControl fullWidth>
								<InputLabel id='demo-simple-select-label'>
									Amount of Data per day
								</InputLabel>
								<Select
									labelId='demo-simple-select-label'
									id='demo-simple-select'
									value={amountPerDay}
									onChange={handleAmountChange}>
									<MenuItem value={1}>1</MenuItem>
									<MenuItem value={1.5}>1.5</MenuItem>
									<MenuItem value={2}>2</MenuItem>
									<MenuItem value={3}>3</MenuItem>
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
				</MuiPickersUtilsProvider>
			</Paper>
		</Container>
	);
};

export default SignupForm;