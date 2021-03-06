import React from "react";
import "../styles/Updates.css";
import useFireStoreCovid from "../hooks/useFireStoreCovid";

function Updates() {
  const { docs, millis } = useFireStoreCovid();
  console.log({ millis });
  return (
    <div className="container updates">
      {/* <div style={{ height: "50px" }} /> */}
      <div className="updates-cities-grid">
        {docs && docs.map((doc) => <City key={doc.id} doc={doc} />)}
      </div>
      <div style={{ height: "50px" }} />
      <iframe
        src="https://ncovtracker.doh.gov.ph"
        frameBorder="0"
        height="1400px"
        width="100%"
        title="covid_update"
        align="middle"
        scrolling="no"
      ></iframe>
      {/* GETS THE DOH TRACKER DATA */}
    </div>
  );
}

// SHOWS THE LIST OF CITIES WITH THEIR TOTAL COVID CASES
function City({ doc }) {
  return (
    <div className="updates-city">
      <p>{doc.name}</p>
      <p>
        Active Cases: <strong>{doc.activeCases}</strong>
      </p>
    </div>
  );
}

export default Updates;
