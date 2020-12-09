import React from 'react';
import './Recommend.css';
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

const Item = props => {

	return (
		<React.Fragment>
			<div class="col-md-4">
				<div class="post-entry">
					<a href="blog-single.html" class="d-block mb-4">

					</a>
					<div class="post-text">

						<h3><a href="#">Provider: {getProvider(props.provider_id)}</a></h3>
						<p>Amount of Data: {props.amountOfData}</p>
						<p>Cost Per Month: {props.costPerMonth}</p>
						<p>Validity: {props.validity} months</p>
						<p>User Rating: {props.userRating} /10</p>
						<p>Type: {props.type}</p>
						{props.perks ? <p>Perks: {props.perks}</p> : null}
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Item;
