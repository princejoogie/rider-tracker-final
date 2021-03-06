import React, { useState } from "react";
import Geocode from "react-geocode";
Geocode.setApiKey("AIzaSyCOW0rwexUSAqaDFHyPNSybph7rbrlriQ8");

function Geolocate() {
  const [address, setAddress] = useState();
  const [lat, setLat] = useState();
  const [lng, setLng] = useState();

  const getLoc = async (e) => {
    e.preventDefault();
    let res = await Geocode.fromLatLng(lat, lng);
    setAddress(res.results[0].formatted_address);
  };

  return (
    <div
      className="container"
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form onSubmit={getLoc}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <input
            style={{ padding: "5px 10px" }}
            type="text"
            value={lat}
            placeholder="latitude"
            onChange={(e) => setLat(e.target.value)}
          />
          <input
            style={{ padding: "5px 10px" }}
            type="text"
            value={lng}
            placeholder="latitude"
            onChange={(e) => setLng(e.target.value)}
          />
          <input style={{ padding: "5px 10px" }} type="submit" value="locate" />
        </div>
        <br />
        <h3>{address ?? "address"}</h3>
      </form>
    </div>
  );
}

export default Geolocate;
