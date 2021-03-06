import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import "../index.css";
import { AuthContext } from "../Auth";
import { useHistory } from "react-router-dom";
import { auth, db } from "../base";

function Navbar({ current }) {
  const history = useHistory();
  const { currentUser, isAdmin } = useContext(AuthContext);

  const logout = async () => {
    await db
      .collection("riders")
      .doc(currentUser[0].uid)
      .set({ online: false }, { merge: true });
    await auth.signOut();
    history.push("/login");
  };

  return (
    <div className="navbar">
      {currentUser[0] && <p className="debugEmail">{currentUser[0].email}</p>}
      <div className="innerNav">
        <Link to="/" style={{ textDecoration: "none" }}>
          <h2>Rider Tracking System</h2>
        </Link>

        <div className="links">
          <Link to="/" style={{ textDecoration: "none" }}>
            <li className={current === "home" ? "current" : ""}>Home</li>
          </Link>

          <Link to="/updates" style={{ textDecoration: "none" }}>
            <li className={current === "updates" ? "current" : ""}>
              Covid-19 Updates
            </li>
          </Link>

          {isAdmin && (
            <Link to="/riders" style={{ textDecoration: "none" }}>
              <li className={current === "riders" ? "current" : ""}>Riders</li>
            </Link>
          )}

          {isAdmin && (
            <Link to="/map" style={{ textDecoration: "none" }}>
              <li className={current === "map" ? "current" : ""}>
                Interactive Map
              </li>
            </Link>
          )}

          {currentUser[0] ? (
            <li
              className={current === "login" ? "current" : ""}
              onClick={logout}
            >
              Logout
            </li>
          ) : (
            <Link to="/login" style={{ textDecoration: "none" }}>
              <li className={current === "login" ? "current" : ""}>Login</li>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
