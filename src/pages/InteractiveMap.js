import React, { useState } from "react";
import "../styles/InteractiveMap.css";
import { db } from "../base";
import useFireStoreRiders from "../hooks/useFireStoreRiders";
import TestMap from "./TestMap";

function InteractiveMap() {
  const [houses, setHouses] = useState(null);
  const [city, setCity] = useState(null);
  const { online } = useFireStoreRiders();

  const NCRCities = [
    "Caloocan",
    "Las Piñas",
    "Makati",
    "Malabon",
    "Mandaluyong",
    "Manila",
    "Marikina",
    "Muntinlupa",
    "Navotas",
    "Parañaque",
    "Pasay",
    "Pasig",
    "Pateros",
    "Quezon",
    "San Juan",
    "Taguig",
    "Valenzuela",
  ];

  const getHouses = (city) => {
    db.collection("household")
      .where("city", "==", city)
      .onSnapshot((snapshot) => {
        setHouses(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      });
  };

  return (
    <div className="container">
      <div className="spacer-10" />
      <div className="map_container">
        <div className="map_controls">
          <p>NCR</p>
          <br />
          <div className="map_controls-cities">
            {NCRCities.map((city, index) => (
              <button
                key={"city" + index}
                onClick={() => {
                  setCity(NCRCities[index]);
                  getHouses(NCRCities[index]);
                }}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
        <TestMap houses={houses} online={online} city={city} />
      </div>  
    </div>
  );
}

export default InteractiveMap;
