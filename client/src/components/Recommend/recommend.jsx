import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import Item from './item';

import axios from 'axios';

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%',
		maxWidth: 360,
		backgroundColor: theme.palette.background.paper,
	},
}));

const Recommend = () => {
	const classes = useStyles();
	const [planData, setPlanData] = useState([]);

	useEffect(() => {
		const uid = localStorage.getItem('id');
		const fetchData = async () => {
			const data = await axios.get(
				`http://localhost:8080/recommend/?uid=${uid}`
			);
			setPlanData(data.data);
		};
		fetchData();
	}, []);
	return (
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
	);
};

export default Recommend;
