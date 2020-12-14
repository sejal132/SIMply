import React from 'react';
import Button from '@material-ui/core/Button';
import './Recommend.css';
import axios from 'axios';


const getProvider = pid => {
	switch (pid) {
		case 1:
			return 'Jio';
		case 2:
			return 'Airtel';
		case 3:
			return 'Vodafone';
		case 4:
			return 'Idea';
		case 5:
			return 'BSNL';
		default:
			return '';
	}
};

const getProviderWebsite = pid => {
	switch (pid) {
		case 1:
			return 'https://www.jio.com/';
		case 2:
			return 'https://www.airtel.in/';
		case 3:
			return 'https://www.myvi.in/';
		case 4:
			return 'https://www.myvi.in/';
		case 5:
			return 'https://www.bsnl.co.in/';
		default:
			return '';
	}
};

const Item = props => {
	const subscribedBtnHandler = async e => {
		//e.preventDefault();
		const uid=localStorage.getItem('id');
		const data={uid:uid,planId:props.id};
		await axios.post(`http://${process.env.REACT_APP_IP}:8080/subscribed`,data);
		window.location.reload();


		
	};
	return (
		<React.Fragment>
			<div class='col-md-4'>
				<div class='post-entry'>
					<div class='post-text' style={{ padding: '10px' }}>
						<h3>
							<a
								href={getProviderWebsite(props.provider_id)}
								target='_blank'
								rel='noreferrer'>
								Provider: {getProvider(props.provider_id)}
								<i
									class='fa fa-external-link'
									style={{
										paddingLeft: '5px',
										fontSize: '10px',
									}}></i>
							</a>
						</h3>
						<p>Amount of Data: {props.amountOfData}</p>
						<p>Cost Per Month: {props.costPerMonth}</p>
						<p>Validity: {props.validity} months</p>
						<p>User Rating: {props.userRating} /10</p>
						<p>Type: {props.type}</p>
						{props.perks ? (
							<p>Perks: {props.perks}</p>
						) : (
							<p>Perks: none</p>
						)}
					</div>
					<div style={{ padding: '10px' }}>
						<Button
							variant='contained'
							color='secondary'
							onClick={subscribedBtnHandler}>
							Subscribed
						</Button>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Item;
