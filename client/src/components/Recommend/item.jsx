import React, { useState } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import { makeStyles } from '@material-ui/core/styles';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';

const useStyles = makeStyles(theme => ({
	nested: {
		paddingLeft: theme.spacing(4),
	},
}));

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
	const classes = useStyles();
	const [isOpen, setIsOpen] = useState(false);

	const openHandler = () => {
		setIsOpen(!isOpen);
	};
	return (
		<React.Fragment>
			<ListItem button onClick={openHandler}>
				<ListItemText primary={`Provider: ${getProvider(props.provider_id)}`} />
				{isOpen ? <ExpandLess /> : <ExpandMore />}
			</ListItem>
			<Collapse in={isOpen} timeout='auto' unmountOnExit>
				<List component='div' disablePadding>
					<ListItem className={classes.nested}>
						<ListItemText
							primary={`Cost per month: Rs ${props.costPerMonth}`}
						/>
					</ListItem>
					<ListItem className={classes.nested}>
						<ListItemText
							primary={`Amount per day: ${props.amountOfData} gb`}
						/>
					</ListItem>
					<ListItem className={classes.nested}>
						<ListItemText
							primary={`Validity: ${props.validity} months`}
						/>
					</ListItem>
					<ListItem className={classes.nested}>
						<ListItemText primary={`Rating: ${props.rating}/10`} />
					</ListItem>
					<ListItem className={classes.nested}>
						<ListItemText primary={`Type: ${props.type}`} />
					</ListItem>
					<ListItem className={classes.nested}>
						<ListItemText
							primary={`Number of Users: ${props.numberOfUsers}`}
						/>
					</ListItem>
					<ListItem className={classes.nested}>
						<ListItemText primary={`Perks: ${props.perks}`} />
					</ListItem>
				</List>
			</Collapse>
		</React.Fragment>
	);
};

export default Item;
