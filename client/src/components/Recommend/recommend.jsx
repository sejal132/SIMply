import React, { useState, useEffect } from 'react';
import Item from './item';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import './Recommend.css';

const Recommend = props => {
	const [planData, setPlanData] = useState([]);

	useEffect(() => {
		const uid = localStorage.getItem('id');
		const fetchData = async () => {
			if (props.route) {
				const data = await axios.get(
					`https://simplyapp${props.route}`
				);
				setPlanData(data.data);
			} else {
				const data = await axios.get(
					`https://simplyapp/recommend/?uid=${uid}`
				);
				setPlanData(data.data);
			}
		};
		fetchData();
	}, [props.route]);

	return (
		<React.Fragment>
			<Navbar
				navItems={{
					newUser: true,
					viewMap: true,
					foreignTravel: true,
					recommend: false,
				}}
			/>
			<section class='hero-section inner-page'>
				<div class='container'>
					<div class='row align-items-center'>
						<div class='col-12'>
							<div class='row justify-content-center'>
								<div class='col-md-7 text-center hero-text'>
									<h1 data-aos='fade-up' data-aos-delay=''>
										Top Recommendations for you!
									</h1>
									<p
										class='mb-5'
										data-aos='fade-up'
										data-aos-delay='100'>
										These are the best choices to decide
										upon
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section class='section'>
				<div class='container'>
					<div class='row mb-5'>
						{planData.map(plan => (
							<Item key={plan.id} {...plan} />
						))}
					</div>
				</div>
			</section>
		</React.Fragment>
	);
};

export default Recommend;
