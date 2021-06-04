import React, { useState, useRef, useEffect, useContext } from "react";
import mapboxgl from "mapbox-gl";

// import { API } from "helpers";
// import { AuthContext } from "contexts";
interface IMap {
    lat: string;
    lng: string;
}
const accessToken =
    "pk.eyJ1IjoibmV1cmFmYXJtcy1haSIsImEiOiJja2tqdjcyMzgwbndjMm9xc3U1YTFzcGs2In0.qHHKandtpLSd1f11nSpEFw";

const Map = ({ lat, lng }: IMap) => {


    const mapContainer = useRef(null);
    let [map, setMap] = useState<any>(null);

    const [viewport] = useState({
        width: "100%",
        height: 100,
        lat,
        lng,
        zoom: 12,
    });

    const [userLocation] = useState({
        lat,
        lng,
    });

    useEffect(() => {
        const attachMap = (setMap: any, mapContainer: any) => {
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
        // const locationInterval = setInterval(getAgentLocation, 1000);
        // return () => clearInterval(locationInterval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (map && mapContainer.current) addDestinationMarker();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map, mapContainer]);


    const isValidLocation = (location: any) => {
        if (location && location.lat && location.lng) return true;
        return false;
    };


    const addDestinationMarker = () => {
        if (isValidLocation(userLocation)) {
            // #TODO - Change default markers with our markers
            var el = document.createElement("div");
            el.className = "user-marker";

            new mapboxgl.Marker(el)
                .setLngLat([userLocation.lat, userLocation.lng])
                .addTo(map);

        }
    };

    //   const initializedMapboxDirections = () => {
    //     if (isValidLocation(userLocation) && isValidLocation(agentLocation)) {
    //       const newMapboxDirection = new window.MapboxDirections({
    //         accessToken,
    //         controls: { instructions: false },
    //         unit: "metric",
    //         profile: "mapbox/driving",
    //       });

    //       setDirections(newMapboxDirection);
    //       map.addControl(newMapboxDirection, "top-left");

    //       setMapDirections();
    //     }
    //   };

    //   const setMapDirections = () => {
    //     if (directions) {
    //       directions.setOrigin([userLocation.lng, userLocation.lat]);

    //       if (Object.keys(directions.getDestination()).length === 0) {
    //         directions.setDestination([agentLocation.lng, agentLocation.lat]);
    //       }
    //     }
    //   };

    if (!lat || !lng) return <h1>"Invalid"</h1>;
    return (
        <div
            ref={mapContainer}
            className="map-container"
            style={{
                height: "100px",
                width: "100%",
            }}
        />
    );
};

export default Map;