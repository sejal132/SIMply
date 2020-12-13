import React, { Fragment } from 'react'
import { Marker } from 'react-leaflet';
import { VenueLocationIcon } from '../VenueLocationIcon/VenueLocationIcon';
import MarkerPopup from '../MarkerPopup/MarkerPopup';

const VenueMarkers = (props) => {
  const { venues } = props;

  const markers = venues.map((venue, index) => (
    <Marker key={index} position={[venue.lat, venue.long]} icon={VenueLocationIcon} >
    </Marker>
  ));

  return <Fragment>{markers}</Fragment>
};

export default VenueMarkers;