import React, { useState, useEffect, useContext } from "react";
import "../styles/Testing.css";
import { auth, db, ts } from "../base";
import Geocode from "react-geocode";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import StopIcon from "@material-ui/icons/Stop";
import useFireStoreCovid from "../hooks/useFireStoreCovid";
import { AuthContext } from "../Auth";
import { useHistory } from "react-router-dom";

function Testing() {
  Geocode.setApiKey("AIzaSyCOW0rwexUSAqaDFHyPNSybph7rbrlriQ8");
  const history = useHistory();
  const { currentUser } = useContext(AuthContext);
  const [address, setAddress] = useState();
  const [loc, setLoc] = useState();
  const [city, setCity] = useState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [withinProximity, setWithinProximity] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [cases, setCases] = useState();
  const [cityCases, setCityCases] = useState(0);
  const { docs } = useFireStoreCovid();
  const [loading, setLoading] = useState(false);

  const NCRCities = [
    "Caloocan",
    "Las Piñas",
    "Makati",
    "Malabon",
    "Mandaluyong",
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
    "Manila",
  ];

  const authenticate = async () => {
    await auth.signInWithEmailAndPassword(email, password).then().catch(alert);
  };

  // GET ADDRRESS FROM LAT LONG OF DEVICE
  const getLoc = async (lat, lng) => {
    setLoc({
      lat,
      lng,
    });
    let res = await Geocode.fromLatLng(lat, lng);
    let index;
    let tempAddr = res.results[0].formatted_address;
    setAddress(tempAddr);
    tempAddr = tempAddr.toUpperCase();

    for (let i = 0; i < NCRCities.length; i++) {
      if (tempAddr.includes(NCRCities[i].toUpperCase())) {
        index = i;
        break;
      }
    }
    if (index) {
      setCity(NCRCities[index]);
    } else setCity("Not in NCR");
  };

  // GET ARRAY OF CITY CASES FROM DATABASE
  const getCases = (c) => {
    db.collection("household")
      .where("city", "==", city)
      .onSnapshot((snapshot) => {
        setCases(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      });
  };

  useEffect(() => {
    // CHECK CITIES CASES IF WITHIN RIDERS PROXIMITY
    if (cases) {
      var near = false;
      for (let i = 0; i < cases.length; i++) {
        let caseLoc = { lat: cases[i].latitude, lng: cases[i].longitude };
        if (arePointsNear(caseLoc, loc, 0.02)) {
          near = true;
          break;
        }
      }

      setWithinProximity(near);
    }
  }, [cases, loc, withinProximity]);

  useEffect(() => {
    // SET RIDER LAT LONG IN DATABASE WHEN DEVICE LOCATION CHANGES
    if (currentUser[0] && loc) {
      db.collection("riders").doc(currentUser[0].uid).update({
        latitude: loc.lat,
        longitude: loc.lng,
      });
    }

    // GET CASES OF CURRECT CITY FROM DATABASE
    if (city && city !== "Not in NCR") {
      getCases(city);
      if (docs) {
        for (let i = 0; i < docs.length; i++) {
          if (docs[i].name === city) {
            setCityCases(docs[i].activeCases);
            break;
          }
        }
      }
    }
  }, [currentUser[0], loc, city, docs]);

  // WATCH DEVICE LAT LONG
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(function (position) {
        getLoc(position.coords.latitude, position.coords.longitude);
      });
    } else {
      alert("no navigator.geolocation");
    }
  }, []);

  // END DELIVERY BUTTON
  const endDelivery = async () => {
    setLoading(true);
    const startTime = new Date();
    let areaRisk = (cityCases / 2000) * 100;

    if (cityCases > 2000) areaRisk = 100;

    let riderRisk = 0;
    let duration = "00:00";
    if (withinProximity) {
      duration = document.getElementById("timer-display").innerHTML;
      let a = duration.split(":").map((e) => parseInt(e));
      let time = a[0] * 60 + a[1];
      riderRisk = (time / (16 * 60)) * 100;
    }

    if (riderRisk > 100) riderRisk = 100;

    let riskPercentage = areaRisk * 0.25 + riderRisk * 0.75;
    riskPercentage = parseFloat(riskPercentage.toFixed(2));
    let riskLevel;
    if (riskPercentage <= 25) riskLevel = "Low Risk";
    else if (riskPercentage >= 26 && riskPercentage <= 50)
      riskLevel = "Moderate Risk";
    else if (riskPercentage >= 51 && riskPercentage <= 75)
      riskLevel = "High Risk";
    else if (riskPercentage >= 76) riskLevel = "Critical Risk";

    let data = {
      address,
      duration,
      riskLevel,
      riskPercentage,
      timeEnd: ts.fromDate(new Date()),
    };

    await db
      .collection("riders")
      .doc(currentUser[0].uid)
      .collection("deliveries")
      .add(data);

    const endTime = new Date();

    const millis = Math.abs(startTime - endTime);
    console.log({ duration: millis });
    setLoading(false);
  };

  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    if (!currentUser[0]) {
      setLoggedIn(false);
    } else {
      setLoggedIn(true);
    }
  }, [currentUser[0]]);

  return (
    <div>
      {loggedIn && currentUser[0] ? (
        <div className="testing-container container">
          <input
            type="submit"
            value="Logout"
            onClick={async () => {
              await db
                .collection("riders")
                .doc(currentUser[0].uid)
                .set({ online: false }, { merge: true });
              await auth.signOut();
              history.replace("/login");
            }}
          />
          <br />
          <br />
          <p>
            Email: <br />
            <strong>{currentUser[0].email}</strong>
          </p>
          <br />
          <p>
            Current City: <br />
            <strong>
              {city ? city : "getting location..."} <br />
            </strong>
            Latitude: {loc && loc.lat} <br />
            Longitude: {loc && loc.lng} <br /> <br />
            Active Cases: {cityCases}
          </p>
          <div className="testing-container-section">
            {withinProximity ? (
              <>
                <p className="testing-warning">
                  <strong>WARNING! </strong>
                  You are within the proximity of a Covid Patient. Please Start
                  your timer accordingly.
                </p>
                <p className="testing-timer" id="timer-display">
                  00:00
                </p>
                <div
                  className="testing-timer-btn"
                  onClick={() => {
                    startStop();
                    setPlaying(!playing);
                  }}
                >
                  {!playing ? (
                    <>
                      <PlayArrowIcon fontSize="large" />
                      <p>Start</p>
                    </>
                  ) : (
                    <>
                      <StopIcon fontSize="large" />
                      <p>Stop</p>
                    </>
                  )}
                </div>
                <p
                  className="testing-resetBtn"
                  style={{ marginTop: "10px" }}
                  onClick={() => {
                    reset();
                    setPlaying(false);
                  }}
                >
                  Reset
                </p>
              </>
            ) : (
              <p className="testing-warning">
                No covid Cases within 20m Proximity.
              </p>
            )}

            <div
              className={
                city !== "Not in NCR" || loading
                  ? "testing-end-button"
                  : "testing-end-button-disabled"
              }
              onClick={() => {
                if (city !== "Not in NCR") {
                  endDelivery();
                }
              }}
            >
              <p>{loading ? "Loading..." : "End Delivery"}</p>
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            height: "100vh",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <a href="/login">Login</a>
          &nbsp; to continue
        </div>
      )}
    </div>
  );
}

function arePointsNear(checkPoint, centerPoint, km) {
  var ky = 40000 / 360;
  var kx = Math.cos((Math.PI * centerPoint.lat) / 180.0) * ky;
  var dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
  var dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
  return Math.sqrt(dx * dx + dy * dy) <= km;
}

//////////////////////////////////////////////////////////////////////////
let seconds = 0;
let minutes = 0;

let displaySeconds = 0;
let displayMinutes = 0;

let interval = null;

let status = "stopped";

// variable to set delay
const delayTime = 1000;

function stopWatch() {
  seconds++;

  //Logic to determine when to increment next value
  if (seconds / 60 === 1) {
    seconds = 0;
    minutes++;

    if (minutes / 60 === 1) {
      minutes = 0;
    }
  }

  //If seconds/minutes/hours are only one digit, add a leading 0 to the value
  if (seconds < 10) {
    displaySeconds = "0" + seconds.toString();
  } else {
    displaySeconds = seconds;
  }

  if (minutes < 10) {
    displayMinutes = "0" + minutes.toString();
  } else {
    displayMinutes = minutes;
  }

  //Display updated time values to user
  document.getElementById("timer-display").innerHTML =
    displayMinutes + ":" + displaySeconds;
}

function startStop() {
  if (status === "stopped") {
    interval = window.setInterval(stopWatch, delayTime);
    status = "started";
  } else {
    window.clearInterval(interval);
    status = "stopped";
  }
}

function reset() {
  window.clearInterval(interval);
  status = "stopped";
  seconds = 0;
  minutes = 0;
  document.getElementById("timer-display").innerHTML = "00:00";
}

export default Testing;
