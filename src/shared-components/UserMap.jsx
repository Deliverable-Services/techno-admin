import React, { useState, useRef, useEffect } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import { HiLocationMarker } from "react-icons/hi";
import "mapbox-gl/dist/mapbox-gl.css";
const accessToken =
  "pk.eyJ1IjoibmV1cmFmYXJtcy1haSIsImEiOiJja2tqdjcyMzgwbndjMm9xc3U1YTFzcGs2In0.qHHKandtpLSd1f11nSpEFw";
const defalultLat = 28.6139;
const defalultLng = 77.209;
const UserMap = ({ userAddress }) => {
  const [viewport, setViewport] = React.useState({
    latitude: Number(userAddress?.lat) || defalultLat,
    longitude: Number(userAddress?.lng) || defalultLng,
    zoom: 15,
  });

  if (!userAddress.lng && !userAddress.lat) return <p>No Address found</p>;
  return (
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={accessToken}
      height="250px"
      width="98%%"
      mapStyle="mapbox://styles/mapbox/streets-v11"
      onViewportChange={(viewport) => setViewport(viewport)}
    >
      <Marker
        latitude={Number(userAddress.lat)}
        longitude={Number(userAddress.lng)}
      >
        <HiLocationMarker size={40} color="red" />
      </Marker>
    </ReactMapGL>
  );
};

export default UserMap;
