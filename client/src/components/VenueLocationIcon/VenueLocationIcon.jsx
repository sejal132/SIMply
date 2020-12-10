import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

export const VenueLocationIcon = L.icon({
	iconUrl: icon,
	shadowUrl: iconShadow,
});
