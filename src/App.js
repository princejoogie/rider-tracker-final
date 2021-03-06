import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import InteractiveMap from "./pages/InteractiveMap";
import Login from "./pages/Login";
import Riders from "./pages/Riders";
import Updates from "./pages/Updates";
import Testing from "./pages/Testing";
import Geolocate from "./pages/Geolocate";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./Auth";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Switch>
            <Route exact path="/geolocate">
              <Geolocate />
            </Route>

            <Route exact path="/testing">
              <Testing />
            </Route>

            <Route exact path="/login">
              <Navbar current="login" />
              <Login />
              <Footer />
            </Route>

            <Route exact path="/updates">
              <Navbar current="updates" />
              <Updates />
              <Footer />
            </Route>

            <Route exact path="/riders">
              <PrivateRoute>
                <Navbar current="riders" />
                <Riders />
                <Footer />
              </PrivateRoute>
            </Route>

            <Route exact path="/map">
              <PrivateRoute>
                <Navbar current="map" />
                <InteractiveMap />
                <Footer />
              </PrivateRoute>
            </Route>

            <Route exact path="/">
              <Navbar current="home" />
              <Home />
            </Route>
          </Switch>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
