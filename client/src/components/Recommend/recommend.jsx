import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import Item from './item';
import axios from 'axios';
import './Recommend.css';

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%',
		maxWidth: 360,
		backgroundColor: theme.palette.background.paper,
	},
}));
const arr=[1,2,3];
const Recommend = props => {
	const classes = useStyles();
	const [planData, setPlanData] = useState([]);

	useEffect(() => {
		const uid = localStorage.getItem('id');
		const fetchData = async () => {
			if (props.route) {
				const data = await axios.get(
					`http://localhost:8080${props.route}`
				);
				setPlanData(data.data);
			} else {
				const data = await axios.get(
					`http://localhost:8080/recommend/?uid=${uid}`
				);
				setPlanData(data.data);
			}
		};
		fetchData();
	}, [props.route]);

	const foreignBtnHandler = e => {
		e.preventDefault();
		props.history.push('/foreign-travel');
	};

	return (
		<React.Fragment>
			{!props.route ? (<div style={{ padding: '10px' }}>
					<Button
						variant='contained'
						color='secondary'
						onClick={foreignBtnHandler}>
						Foreign Travel
					</Button>
				</div>
			) : null}
			 <section class="hero-section inner-page">
      {/* <div class="wave">

        <svg width="1920px" height="265px" viewBox="0 0 1920 265" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="Apple-TV" transform="translate(0.000000, -402.000000)" fill="#FFFFFF">
              <path d="M0,439.134243 C175.04074,464.89273 327.944386,477.771974 458.710937,477.771974 C654.860765,477.771974 870.645295,442.632362 1205.9828,410.192501 C1429.54114,388.565926 1667.54687,411.092417 1920,477.771974 L1920,667 L1017.15166,667 L0,667 L0,439.134243 Z" id="Path"></path>
            </g>
          </g>
        </svg>

      </div> */}

      <div class="container">
        <div class="row align-items-center">
          <div class="col-12">
            <div class="row justify-content-center">
              <div class="col-md-7 text-center hero-text">
                <h1 data-aos="fade-up" data-aos-delay="">Top Recommendations for you!</h1>
                <p class="mb-5" data-aos="fade-up" data-aos-delay="100">These are the best choices to decide upon</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>

    <section class="section">
      <div class="container">
        <div class="row mb-5">
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
