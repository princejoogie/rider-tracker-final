import React from "react";
import "../styles/Home.css";
import img1 from "../assets/covid-updates.png";
import img2 from "../assets/map.png";
import img3 from "../assets/risk-assessment.png";
import Footer from "../components/Footer";
import { Facebook, Email, PhoneEnabled } from "@material-ui/icons";

function Home() {
  return (
    <div className="home">
      <div className="container home-jumbotron">
        <div>
          <h1>
            <span>R</span>ider
            <br />
            <span>T</span>racking
            <br />
            <span>S</span>ystem
          </h1>
        </div>
        <div>
          <p>
            RTS aims to provide accurate data for determining the risk level of
            riders. Rider Tracking System monitors the risk level of the riders
            to ensure their safety as well as their customers.
          </p>
          <button type="submit">About Us</button>
        </div>
      </div>

      <div className="container">
        <div className="home-content">
          <div className="hm-left">
            <img src={img1} alt="COVID-19 Updates" />
          </div>
          <div className="hm-right">
            <h3>COVID-19 Updates</h3>
            <p>
              Rider Tracking System offers you a feature of daily COVID-19
              Updates using the information of the Department of Health. It
              provides COVID-19 Updates Nationwide up to City level of selected
              provinces. COVID-19 Updates helps you to keep on track regarding
              the lastest updates in the country.
            </p>
          </div>
        </div>

        <div className="home-content">
          <div className="hm-left">
            <h3>Rider Risk Assessment</h3>
            <p>
              Rider Tracking System ensures the safety of the food delivery
              riders and buyers by having a realtime monitoring of risk
              percentage of the riders. Having the risk percentage of the riders
              regularly assessed, the Delivery Service Provider would make sure
              that all the deliveries are 100% safe and COVID-free.
            </p>
          </div>
          <div className="hm-right">
            <img src={img3} alt="COVID-19 Updates" />
          </div>
        </div>

        <div className="home-content">
          <div className="hm-left">
            <img src={img2} alt="COVID-19 Updates" />
          </div>
          <div className="hm-right">
            <h3>COVID-19 Interactive Map</h3>
            <p>
              COVID-19 Interactive Map is useful on tracking the COVID-19 active
              cases on a City. The map is connected to Google Maps API that is
              modified to show the current active cases that may have a food
              transaction fron the Delivery Service Provider.
            </p>
          </div>
        </div>
      </div>

      <div className="container home-socials">
        <div>
          <Facebook style={{ fontSize: 50 }} />
          <h3>Learn More!</h3>
          <p>RTS Facebook Page</p>
        </div>
        <div>
          <PhoneEnabled style={{ fontSize: 50 }} />
          <h3>Contact Us</h3>
          <p>Cellphone no.</p>
        </div>
        <div>
          <Email style={{ fontSize: 50 }} />
          <h3>Email Us</h3>
          <p>ridertrackingsystem@gmail.com</p>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Home;
