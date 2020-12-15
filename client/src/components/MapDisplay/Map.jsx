import React, { Component } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import data from './data.json';
import Markers from '../VenueMarkers/VenueMarkers';
import axios from 'axios';
import NavBar from '../Navbar/Navbar';


class MapView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			lat:localStorage.getItem('lat'),
			long:localStorage.getItem('long'),
			zoom: 12,
			coordList:[],
		};
	}
	async componentDidMount() {
		const uid=localStorage.getItem('id');
		
	const data=	await axios.get(`https://simplyapp/map/?uid=${uid}`);
	this.setState({
		coordList:data.data
	});



	}

	render() {
		const { lat,long, zoom } = this.state;

		return (
			<>
			<NavBar navItems={{newUser:true,recommend:true,foreignTravel:true}} />
			<MapContainer center={{lat:lat,lng:long}} zoom={zoom} scrollWheelZoom={false}>
				<TileLayer
					attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
					url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
				/>

				<Markers venues={this.state.coordList} />
			</MapContainer>
			</>
		);
	}
}

export default MapView;
