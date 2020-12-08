import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import Item from './item';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%',
		maxWidth: 360,
		backgroundColor: theme.palette.background.paper,
	},
}));

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
			<List
				component='nav'
				aria-labelledby='nested-list-subheader'
				subheader={
					<ListSubheader component='div' id='nested-list-subheader'>
						Recommended Plans
					</ListSubheader>
				}
				className={classes.root}>
				{planData.map(plan => (
					<Item key={plan.id} {...plan} />
				))}
			</List>
		</React.Fragment>
	);
};

export default Recommend;
