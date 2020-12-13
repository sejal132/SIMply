import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from '../Spinner/Spinner';
import Navbar from '../Navbar/Navbar';
import './SignupForm.css';

const SignupForm = props => {
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [costPerMonth, setCostPerMonth] = useState();
	const [planExpiry, setPlanExpiry] = useState(new Date().toISOString());
	const [lat, setLat] = useState(0);
	const [long, setLong] = useState(0);
	const [amountPerDay, setAmountPerDay] = useState();
	const [provider, setProvider] = useState('');
	const [type, setType] = useState('');
	const [profession, setProfession] = useState('');
	const [country, setCountry] = useState('');
	const [rating, setRating] = useState();
	const [isLoading, setIsLoading] = useState(false);

	const [errors, setErrors] = useState({
		firstName: '',
		lastName: '',
		email: '',
		costPerMonth: '',
		rating: '',
		amountPerDay: '',
		provider: '',
		type: '',
		profession: '',
		country: '',
	});

	const handleFirstNameChange = e => setFirstName(e.target.value);

	const handleLastNameChange = e => setLastName(e.target.value);

	const handleEmailChange = e => setEmail(e.target.value);

	const handleCostChange = e => {
		if (e.target.value > 401) {
			setCostPerMonth(401);
		} else {
			setCostPerMonth(e.target.value);
		}
	};

	const handleDateChange = e => setPlanExpiry(e.target.value);

	const handleProviderChange = e => setProvider(e.target.value);

	const handleAmountChange = e => setAmountPerDay(e.target.value);

	const handleTypeChange = e => setType(e.target.value);

	const handleProfessionChange = e => setProfession(e.target.value);

	const handleCountryChange = e => setCountry(e.target.value);

	const handleRatingChange = e => setRating(e.target.value);

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
		if (costPerMonth === 0 || !costPerMonth) {
			formIsValid = false;
			setErrors(prevErrors => ({
				...prevErrors,
				costPerMonth: '*Cost per month cannot be zero or empty',
			}));
		}
		if (!amountPerDay) {
			formIsValid = false;
			setErrors(prevErrors => ({
				...prevErrors,
				amountPerDay: '*Please select amount per day',
			}));
		}
		if (provider.length === 0) {
			formIsValid = false;
			setErrors(prevErrors => ({
				...prevErrors,
				provider: '*Please select a provider',
			}));
		}
		if (type.length === 0) {
			formIsValid = false;
			setErrors(prevErrors => ({
				...prevErrors,
				type: '*Please select type of plan',
			}));
		}
		if (profession.length === 0) {
			formIsValid = false;
			setErrors(prevErrors => ({
				...prevErrors,
				profession: '*Please select your profession',
			}));
		}
		if (country.length === 0) {
			formIsValid = false;
			setErrors(prevErrors => ({
				...prevErrors,
				country: '*Please select country',
			}));
		}
		if (!rating) {
			formIsValid = false;
			setErrors(prevErrors => ({
				...prevErrors,
				rating: '*Rating cannot empty',
			}));
		}
		return formIsValid;
	};

	let navbarComponent = null;

	const uid = localStorage.getItem('id');
	if (uid) {
		navbarComponent = (
			<Navbar
				navItems={{
					newUser: false,
					viewMap: false,
					foreignTravel: true,
					recommend: true,
				}}
			/>
		);
	}

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(position => {
			setLat(position.coords.latitude);
			setLong(position.coords.longitude);
		});
	}, []);

	const formSubmitHandler = async e => {
		if (isFormValid()) {
			const dataObj = {
				firstName: firstName,
				lastName: lastName,
				email: email,
				planExpiry: planExpiry,
				lat: lat,
				long: long,
				amountPerDay: parseFloat(amountPerDay),
				provider: provider,
				costPerMonth: parseFloat(costPerMonth),
				type: type,
				profession: profession,
				country: country,
				userRating: rating,
			};
			console.log(dataObj);
			setErrors({
				firstName: '',
				lastName: '',
				email: '',
				costPerMonth: '',
				rating: '',
				amountPerDay: '',
				provider: '',
				type: '',
				profession: '',
				country: '',
			});
			try {
				setIsLoading(true);
				const result = await axios.post(
					'http://localhost:8080/adduser',
					dataObj
				);
				console.log(result.data);
				localStorage.setItem('id', result.data);
				props.history.push('/recommend');
			} catch (error) {
				console.log(error);
			}
			setIsLoading(false);
		} else {
			e.preventDefault();
		}
	};

	return (
		<React.Fragment>
			{navbarComponent}
			<div class='container register'>
				<div class='row'>
					<div class='col-md-3 register-left'>
						<img
							src='https://image.ibb.co/n7oTvU/logo_white.png'
							alt=''
						/>
						<h3>Welcome to SIMply</h3>
						<br />
					</div>
					<div class='col-md-9 register-right'>
						<div class='tab-content' id='myTabContent'>
							<div
								class='tab-pane fade show active'
								id='home'
								role='tabpanel'
								aria-labelledby='home-tab'>
								<h3 class='register-heading'>
									Signup to SIMply
								</h3>
								<div class='row register-form'>
									<div class='col-md-6'>
										<div class='form-group'>
											<input
												type='text'
												class='form-control'
												placeholder='First Name *'
												value={firstName}
												onChange={handleFirstNameChange}
											/>
										</div>
										<div class='form-group'>
											<input
												type='text'
												class='form-control'
												placeholder='Last Name *'
												value={lastName}
												onChange={handleLastNameChange}
											/>
										</div>
										<div class='form-group'>
											<input
												type='email'
												class='form-control'
												placeholder='Your Email *'
												value={email}
												onChange={handleEmailChange}
											/>
										</div>
										<div class='form-group'>
											<input
												type='number'
												min='0'
												max='401'
												class='form-control'
												placeholder='Cost per month *'
												value={costPerMonth}
												onChange={handleCostChange}
											/>
										</div>
										<div class='form-group'>
											<input
												type='date'
												min={Date.now()}
												max={
													new Date(
														new Date().setFullYear(
															new Date().getFullYear() +
																1
														)
													)
												}
												class='form-control'
												placeholder='Expiry of plan *'
												value={planExpiry}
												onChange={handleDateChange}
											/>
										</div>
									</div>
									<div class='col-md-6'>
										<div class='form-group'>
											<select
												class='form-control'
												onChange={handleProviderChange}>
												<option
													value=''
													selected
													disabled>
													Select Provider *
												</option>
												<option value='Jio'>Jio</option>
												<option value='Vodafone'>
													Vodafone
												</option>
												<option value='Idea'>
													Idea
												</option>
												<option value='Airtel'>
													Airtel
												</option>
												<option value='BSNL'>
													BSNL
												</option>
											</select>
										</div>
										<div class='form-group'>
											<select
												class='form-control'
												onChange={handleTypeChange}>
												<option
													value=''
													selected
													disabled>
													Select Type *
												</option>
												<option value='prepaid'>
													Prepaid
												</option>
												<option value='postpaid'>
													Postpaid
												</option>
											</select>
										</div>
										<div class='form-group'>
											<select
												class='form-control'
												onChange={handleAmountChange}>
												<option
													value=''
													selected
													disabled>
													Select Amount of Data *
												</option>
												<option value={1}>1</option>
												<option value={1.5}>1.5</option>
												<option value={2}>2</option>
												<option value={3}>3</option>
											</select>
										</div>
										<div class='form-group'>
											<select
												class='form-control'
												onChange={
													handleProfessionChange
												}>
												<option
													value=''
													selected
													disabled>
													Select Profession *
												</option>
												<option value='student'>
													Student
												</option>
												<option value='travel'>
													Travel
												</option>
												<option value='work'>
													Work
												</option>
											</select>
										</div>
										<div class='form-group'>
											<select
												class='form-control'
												onChange={handleCountryChange}>
												<option
													value=''
													selected
													disabled>
													Select Country *
												</option>
												<option value='India'>
													India
												</option>
												<option value='USA'>USA</option>
												<option value='Great Britain'>
													Great Britain
												</option>
												<option value='Australia'>
													Australia
												</option>
												<option value='Russia'>
													Russia
												</option>
											</select>
										</div>
										<div class='form-group'>
											<input
												type='number'
												class='form-control'
												placeholder='Rating *'
												value={rating}
												onChange={handleRatingChange}
												min='1'
												max='10'
											/>
										</div>
										{isLoading ? (
											<div class='spinner'>
												<Spinner />
											</div>
										) : (
											<button
												type='button'
												class='btnRegister'
												onClick={formSubmitHandler}>
												SignUp
											</button>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default SignupForm;
