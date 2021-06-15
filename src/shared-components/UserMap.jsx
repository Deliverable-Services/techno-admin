import React, { useState, useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";

const accessToken =
	"pk.eyJ1IjoibmV1cmFmYXJtcy1haSIsImEiOiJja2tqdjcyMzgwbndjMm9xc3U1YTFzcGs2In0.qHHKandtpLSd1f11nSpEFw";

const UserMap = ({ userAddress }) => {
	console.log("UserAddress 11122222",  userAddress );
	const lat = userAddress.lat;
	const lng = userAddress.lng;

	const mapContainer = useRef(null);
	let [map, setMap] = useState(null);

	const [viewport] = useState({
		width: 350,
		height: 350,
		lat: userAddress && lat ? parseInt(lat) : 37.78,
		lng: userAddress && lng ? parseInt(lng) : -122.41,
		zoom: 12,
	});

	const [userLocation] = useState({
		lat: userAddress && parseInt(lat),
		lng: userAddress && parseInt(lng),
	});
	const [agentLocation, setAgentLocation] = useState(null);
	const [directions, setDirections] = useState(null);

	useEffect(() => {
		const attachMap = (setMap, mapContainer) => {
			if (!mapContainer.current) return;

			const map = new mapboxgl.Map({
				accessToken,
				container: mapContainer.current || "",
				style: "mapbox://styles/mapbox/streets-v11",
				center: [viewport.lng, viewport.lat],
				zoom: viewport.zoom,
				interactive: false,
				dragPan: false,
			});

			setMap(map);
		};

		!map && attachMap(setMap, mapContainer);
		const locationInterval = setInterval(getAgentLocation, 1000);
		return () => clearInterval(locationInterval);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (map && mapContainer.current) addDestinationMarker();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [map, mapContainer]);

	useEffect(() => {
		if (!directions) initializedMapboxDirections();
		else setMapDirections();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [agentLocation]);

	const isValidLocation = (location) => {
		if (location && location.lat && location.lng) return true;
		return false;
	};

	const getAgentLocation = async () => {
		// const {
		//   data: { agent_location: location },
		// } = await API.get(`/orders/${order.id}/get-agent-location`, {
		//   headers: { Authorization: `Bearer ${token}` },
		// });
		// if (location)
		//   setAgentLocation({
		//     lat: parseFloat(location.lat),
		//     lng: parseFloat(location.lng),
		//   });
	};

	const addDestinationMarker = () => {
		if (isValidLocation(userLocation)) {
			// #TODO - Change default markers with our markers
			var el = document.createElement("div");
			el.className = "user-marker";

			new mapboxgl.Marker(el)
				.setLngLat([userLocation.lat, userLocation.lng])
				.addTo(map);

			getAgentLocation();
		}
	};

	const initializedMapboxDirections = () => {
		if (isValidLocation(userLocation) && isValidLocation(agentLocation)) {
			const newMapboxDirection = new window.MapboxDirections({
				accessToken,
				controls: { instructions: false },
				unit: "metric",
				profile: "mapbox/driving",
			});

			setDirections(newMapboxDirection);
			map.addControl(newMapboxDirection, "top-left");

			setMapDirections();
		}
	};

	const setMapDirections = () => {
		if (directions) {
			directions.setOrigin([userLocation.lng, userLocation.lat]);

			if (Object.keys(directions.getDestination()).length === 0) {
				directions.setDestination([agentLocation.lng, agentLocation.lat]);
			}
		}
	};

	// if (!order) return; 
	if (!userAddress) return;

	if (!userAddress) {
		return (
			<h3 style={{ width: "100%", textAlign: "center", marginTop: "10px" }}>
				No address found
			</h3>
		);
	}

	return (
		<div
			ref={mapContainer}
			style={{
				height: "350px",
				width: "100%",
			}}
		/>
	);
};

export default UserMap;
