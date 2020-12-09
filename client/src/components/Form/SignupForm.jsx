import React, { useState } from 'react';
import './SignupForm.css';

const SignupForm = props => {
	return (
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
							<h3 class='register-heading'>Signup to SIMply</h3>
							<div class='row register-form'>
								<div class='col-md-6'>
									<div class='form-group'>
										<input
											type='text'
											class='form-control'
											placeholder='First Name *'
											value=''
										/>
									</div>
									<div class='form-group'>
										<input
											type='text'
											class='form-control'
											placeholder='Last Name *'
											value=''
										/>
									</div>
									<div class='form-group'>
										<input
											type='email'
											class='form-control'
											placeholder='Your Email *'
											value=''
										/>
									</div>
									<div class='form-group'>
										<input
											type='number'
											min='0'
											max='401'
											class='form-control'
											placeholder='Cost per month *'
											value=''
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
											value=''
										/>
									</div>
								</div>
								<div class='col-md-6'>
									<div class='form-group'>
										<span>Service Provider* </span>
										<select class='form-control'>
											<option selected>
												Jio
											</option>
											<option>
												Vodafone
											</option>
											<option>
												Idea
											</option>
											<option>
												Airtel
											</option>
											<option>
												BSNL
											</option>
										</select>
									</div>
									<div class='form-group'>
										<input
											type='text'
											class='form-control'
											placeholder='Enter Your Answer *'
											value=''
										/>
									</div>
									<input
										type='submit'
										class='btnRegister'
										value='Register'
									/>
								</div>
							</div>
						</div>
						<div
							class='tab-pane fade show'
							id='profile'
							role='tabpanel'
							aria-labelledby='profile-tab'>
							<h3 class='register-heading'>Apply as a Hirer</h3>
							<div class='row register-form'>
								<div class='col-md-6'>
									<div class='form-group'>
										<input
											type='text'
											class='form-control'
											placeholder='First Name *'
											value=''
										/>
									</div>
									<div class='form-group'>
										<input
											type='text'
											class='form-control'
											placeholder='Last Name *'
											value=''
										/>
									</div>
									<div class='form-group'>
										<input
											type='email'
											class='form-control'
											placeholder='Email *'
											value=''
										/>
									</div>
									<div class='form-group'>
										<input
											type='text'
											maxlength='10'
											minlength='10'
											class='form-control'
											placeholder='Phone *'
											value=''
										/>
									</div>
								</div>
								<div class='col-md-6'>
									<div class='form-group'>
										<input
											type='password'
											class='form-control'
											placeholder='Password *'
											value=''
										/>
									</div>
									<div class='form-group'>
										<input
											type='password'
											class='form-control'
											placeholder='Confirm Password *'
											value=''
										/>
									</div>
									<div class='form-group'>
										<select class='form-control'>
											<option
												class='hidden'
												selected
												disabled>
												Please select your Sequrity
												Question
											</option>
											<option>
												What is your Birthdate?
											</option>
											<option>
												What is Your old Phone Number
											</option>
											<option>
												What is your Pet Name?
											</option>
										</select>
									</div>
									<div class='form-group'>
										<input
											type='text'
											class='form-control'
											placeholder='`Answer *'
											value=''
										/>
									</div>
									<input
										type='submit'
										class='btnRegister'
										value='Register'
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SignupForm;
