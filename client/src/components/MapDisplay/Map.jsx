import React, { Component } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import data from './data.json';
import Markers from '../VenueMarkers/VenueMarkers';

class MapView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentLocation: { lat: 52.52437, lng: 13.41053 },
			zoom: 12,
		};
	}

	render() {
		const { currentLocation, zoom } = this.state;

		return (
			<MapContainer center={currentLocation} zoom={zoom} scrollWheelZoom={false}>
				<TileLayer
					attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
					url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
				/>

				<Markers venues={data.venues} />
			</MapContainer>
		);
	}
}

export default MapView;
