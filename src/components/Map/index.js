import React, { useContext, useEffect, useState } from "react";
import ReactMapGL, {
  Marker,
  FlyToInterpolator,
  FullscreenControl,
  NavigationControl,
} from "react-map-gl";
import { AiFillHome, AiFillCar } from "react-icons/ai";
import PolyLine from "./Polyline";
import axios from "axios";
import { primaryColor } from "../../utils/constants";
import API from "../../utils/API";
const mapBoxToken =
  "pk.eyJ1IjoibmV1cmFmYXJtcy1haSIsImEiOiJja2tqdjcyMzgwbndjMm9xc3U1YTFzcGs2In0.qHHKandtpLSd1f11nSpEFw";
const defaultLat = 28.6139;
const defaultLng = 77.209;
const TrackingMap = ({ order }) => {
  const { address: userAddress } = order;

  console.log({ order });

  const [agentLocation, setAgentLocation] = useState(null);
  const [route, setRoute] = useState();
  const [viewport, setViewport] = React.useState({
    latitude: Number(userAddress?.lat) || defaultLat,
    longitude: Number(userAddress?.lng) || defaultLng,
    zoom: 15,
  });
  useEffect(() => {
    getAgentLocation();
    const interval = setInterval(() => getAgentLocation(), 10000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!agentLocation) return;
    getRoute();
    flyToLocation();
  }, [agentLocation]);

  // get the agent locatoin
  const getAgentLocation = async () => {
    if (!order.agent_id) return;
    const {
      data: { agent_location: location },
    } = await API.get(`/orders/${order.id}/get-agent-location`);

    if (location)
      setAgentLocation({
        lat: parseFloat(location.lat),
        lng: parseFloat(location.lng),
      });
  };

  // getting the coords of the path
  const getRoute = async () => {
    if (!userAddress || !agentLocation) return;

    const res = await axios.get(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${userAddress.lng},${userAddress.lat};${agentLocation.lng},${agentLocation.lat}?geometries=geojson&access_token=${mapBoxToken}`
    );

    if (res) setRoute(res.data.routes[0].geometry.coordinates);
  };

  if (!userAddress)
    return (
      <h3 style={{ width: "100%", textAlign: "center", marginTop: "10px" }}>
        No address found
      </h3>
    );
  const flyToLocation = () => {
    if (!agentLocation) return;
    setViewport({
      ...viewport,
      longitude: agentLocation.lng,
      latitude: agentLocation.lat,
      zoom: 15,
      transitionDuration: 5000,
      transitionInterpolator: new FlyToInterpolator(),
    });
  };

  return (
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={mapBoxToken}
      height="350px"
      width="100%"
      mapStyle="mapbox://styles/mapbox/streets-v11"
      onViewportChange={(viewport) => setViewport(viewport)}
    >
      {route && <PolyLine points={route} />}
      {userAddress?.lat && userAddress?.lng && (
        <Marker
          latitude={Number(userAddress?.lat)}
          longitude={Number(userAddress?.lng)}
        >
          <AiFillHome size={30} color={primaryColor} />
        </Marker>
      )}

      {agentLocation?.lat && agentLocation?.lng && (
        <Marker
          latitude={Number(agentLocation?.lat)}
          longitude={Number(agentLocation?.lng)}
        >
          <AiFillCar size={30} color={primaryColor} />
        </Marker>
      )}
    </ReactMapGL>
  );
};

export default TrackingMap;
