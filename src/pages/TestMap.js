import React, { Fragment, useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Circle,
  Marker,
  InfoWindow,
  Polygon,
} from "@react-google-maps/api";
import "../styles/InteractiveMap.css";
import riderIcon from "../assets/delivery.svg";
import ncr from "../assets/data/ncr.json";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 14.5311,
  lng: 121.0213,
};

function TestMap({ houses, online, city }) {
  const [selectedRider, setSelectedRider] = useState(null);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyCOW0rwexUSAqaDFHyPNSybph7rbrlriQ8",
  });

  const DrawCircles = () => {
    if (houses) {
      if (houses.length > 0) {
        return (
          <Fragment>
            {houses.map((house, index) => (
              <Circle
                key={"circle" + index}
                onClick={handleClick}
                center={{
                  lat: house.latitude,
                  lng: house.longitude,
                }}
                radius={20}
                options={{
                  strokeWeight: 2,
                  strokeColor: "#000000",
                  fillOpacity: 0.8,
                  fillColor: "#FF0000",
                }}
              />
            ))}
          </Fragment>
        );
      }
    }
    return null;
  };

  const handleClick = (e) => {
    setMarkerLoc(e.latLng);
  };

  const [markerLoc, setMarkerLoc] = useState();

  function ShowBoundaries({ city }) {
    const i = ncr.boundaries.findIndex((x) => x.properties.NAME_2 === city);

    if (ncr.boundaries[i].geometry.coordinates.length > 1) {
      return ncr.boundaries[i].geometry.coordinates.map((e, index) => (
        <Polygon
          key={"polygon" + index}
          onClick={handleClick}
          options={{ strokeWeight: 1, fillOpacity: 0.2 }}
          path={e[0].map((p) => ({
            lat: p[1],
            lng: p[0],
          }))}
        />
      ));
    } else {
      return (
        <Polygon
          onClick={handleClick}
          options={{ strokeWeight: 1, fillOpacity: 0.2 }}
          path={ncr.boundaries[i].geometry.coordinates[0].map((p) => ({
            lat: p[1],
            lng: p[0],
          }))}
        />
      );
    }
  }

  return isLoaded ? (
    <div className="interactive_map">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={12}
        center={center}
      >
        {markerLoc && (
          <InfoWindow
            position={markerLoc}
            onCloseClick={() => setMarkerLoc(null)}
          >
            <div>
              <p>
                lat: <strong>{markerLoc.lat()}</strong>
              </p>
              <br />
              <p>
                lng: <strong>{markerLoc.lng()}</strong>
              </p>
              <br />
              <p>
                city: <strong>{city}</strong>
              </p>
            </div>
          </InfoWindow>
        )}
        <DrawCircles />
        {online.map((rider, index) => (
          <Circle
            key={"circle" + index}
            center={{
              lat: rider.latitude,
              lng: rider.longitude,
            }}
            radius={20}
            options={{
              strokeWeight: 2,
              strokeColor: "#000000",
              fillOpacity: 0.8,
              fillColor: "#00FF00",
            }}
          />
        ))}
        {online.map((rider, index) => (
          <Marker
            key={"marker" + index}
            position={{
              lat: rider.latitude,
              lng: rider.longitude,
            }}
            icon={riderIcon}
            onClick={() => setSelectedRider(rider)}
          />
        ))}
        {selectedRider && (
          <InfoWindow
            position={{
              lat: selectedRider.latitude,
              lng: selectedRider.longitude,
            }}
            onCloseClick={() => setSelectedRider(null)}
          >
            <div>
              <p>{selectedRider.name}</p>
            </div>
          </InfoWindow>
        )}
        {city && <ShowBoundaries city={city} />}
      </GoogleMap>
    </div>
  ) : (
    <></>
  );
}

export default React.memo(TestMap);
