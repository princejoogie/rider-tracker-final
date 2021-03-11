import React, { useState, useEffect } from "react";
import useFireStoreDeliveries from "../hooks/useFireStoreDeliveries";
import useFireStoreRiders from "../hooks/useFireStoreRiders";
import useFireStoreRiderID from "../hooks/useFireStoreRiderID";
import { AccountCircle, Cancel, Warning } from "@material-ui/icons";
import "../styles/Riders.css";

function Riders() {
  const { online, offline } = useFireStoreRiders();
  const [currentRider, setCurrentRider] = useState(null);

  return (
    <div className="rider container">
      {currentRider && (
        <Modal riderID={currentRider} setCurrentRider={setCurrentRider} />
      )}
      <h2>Rider List</h2>

      <div className="rider-list-title">
        <p>Name</p>
        <p>Risk Level</p>
        <p>Contact Number</p>
        <p>Address</p>
      </div>

      <h4>
        Online <small>🟢</small>
      </h4>
      {online &&
        online.map((item, index) => (
          <Item
            key={item.id}
            riderID={item.id}
            setCurrentRider={setCurrentRider}
          />
        ))}

      <h4>
        Offline <small>🔴</small>
      </h4>
      {offline &&
        offline.map((item) => (
          <Item
            key={item.id}
            riderID={item.id}
            setCurrentRider={setCurrentRider}
          />
        ))}
    </div>
  );
}

// RIDERS BASIC INFO
function Item({ riderID, setCurrentRider }) {
  const { rider, highestRisk } = useFireStoreRiderID(riderID);

  const list = [
    rider.name ?? "N/A",
    highestRisk + "%" ?? "N/A",
    rider.contactNumber ?? "N/A",
    rider.address ?? "N/A",
  ];

  return (
    <div
      className={rider.averageRiskLevel > 50 ? "rider-item-red" : "rider-item"}
      onClick={() => setCurrentRider(riderID)}
    >
      {rider && list.map((item, index) => <p key={"item" + index}>{item}</p>)}
    </div>
  );
}

// POP UP THAT SHOWS RIDER DELIVERIES
function Modal({ riderID, setCurrentRider }) {
  const { deliveries } = useFireStoreDeliveries(riderID);
  const { rider, highestRisk } = useFireStoreRiderID(riderID);
  const colors = ["#2E7F18", "#675E24", "#8D472B", "#B13433", "#FF0000"];
  const [currColor, setCurrColor] = useState();

  useEffect(() => {
    if (rider) {
      if (rider.averageRiskLevel < 20) setCurrColor(colors[0]);
      else if (rider.averageRiskLevel < 40) setCurrColor(colors[1]);
      else if (rider.averageRiskLevel < 60) setCurrColor(colors[2]);
      else if (rider.averageRiskLevel < 80) setCurrColor(colors[3]);
      else setCurrColor(colors[4]);
    }
  }, [rider]);

  return (
    <div className="rider-modal container">
      <div className="rider-modal-wrapper">
        <div
          className="rider-modal-close"
          onClick={() => setCurrentRider(null)}
        >
          <Cancel fontSize="inherit" />
        </div>
        <div className="rider-modal-profile">
          <div className="rider-modal-profile-item">
            <AccountCircle style={{ fontSize: "10rem", color: "#04537C" }} />
            <h2>{rider.name}</h2>
            <h3>{rider.licenseNo}</h3>
          </div>

          <div className="rider-modal-profile-item">
            <h1 className="rider-risk-level">{highestRisk}%</h1>
            <div className="rcs">
              <Warning style={{ fontSize: "2rem" }} />
              &nbsp;&nbsp;
              <p>Rider's Current Risk %</p>
            </div>

            <div className="rcs-bar">
              <div className="rcs-bar-container">
                <div
                  className="rcs-bar-percentage"
                  style={{
                    width: `${100 - highestRisk}%`,
                    backgroundColor: "#F2F2F2",
                  }}
                />
              </div>
            </div>

            <div className="rcs-levels">
              <p>0</p>
              <p style={{ marginRight: "-1.5rem" }}>50</p>
              <p>100</p>
            </div>
          </div>
        </div>

        <div className="rider-modal-deliveries">
          <h2>Delivery History on Confirmed Cases</h2>
          <div className="rmd-title">
            <p>Address</p>
            <p>Delivery Time</p>
            <p>Duration</p>
            <p>Risk Level</p>
            <p>Overall Risk Percentage</p>
          </div>

          <div className="rider-divider" />

          {deliveries &&
            deliveries.map((item, index) => (
              <DeliveryItem key={"del" + index} delivery={item} />
            ))}
        </div>
      </div>
    </div>
  );
}

function DeliveryItem({ delivery }) {
  const timeEnd = new Date(delivery.timeEnd.toDate());

  function getTime() {
    var hours = timeEnd.getHours();
    var minutes = timeEnd.getMinutes();
    var seconds = timeEnd.getSeconds();
    var mid = "AM";

    if (hours === 0) hours = 12;
    else if (hours > 12) {
      hours = hours % 12;
      mid = "PM";
    }
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    return hours + ":" + minutes + ":" + seconds + mid;
  }

  return (
    <div className="rmd-item">
      <p>{delivery.address ?? "N/A"}</p>
      <p>{getTime() ?? "N/A"}</p>
      <p>{delivery.duration ?? "N/A"}</p>
      <p>{delivery.riskLevel ?? "N/A"} </p>
      <p>{delivery.riskPercentage + "%" ?? "N/A"} </p>
    </div>
  );
}

export default Riders;
