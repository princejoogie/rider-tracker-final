import React, { useState } from "react";
import "../styles/Login.css";
import wave from "../assets/wave.png";
import avatar from "../assets/avatar.svg";
import bg from "../assets/bg.svg";
import { auth } from "../base";
import { useHistory } from "react-router-dom";
import { db } from "../base";

function Login() {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleChange = (e, func) => func(e.target.value);

  // LOGIN BUTTON PRESSED
  const submit = async (e) => {
    e.preventDefault();
    await auth
      .signInWithEmailAndPassword(email, password)
      .then(async ({ user }) => {
        await db.collection("riders").doc(user.uid).set(
          {
            online: true,
          },
          { merge: true }
        );

        const res = await (
          await db.collection("riders").doc(user.uid).get()
        ).data();
        console.log(res);
        if (!res.isAdmin) {
          history.replace("/testing");
        } else {
          history.replace("/");
        }
      })
      .catch(alert);
  };

  return (
    <div className="login">
      <img className="login-wave" src={wave} alt="wave" />
      <div className="login-container">
        <div className="login-img">
          <img src={bg} alt="bg" />
        </div>
        <div className="login-content">
          <form onSubmit={submit}>
            <img src={avatar} alt="avatar" />
            <h1 className="login-title">Rider Tracking System</h1>
            <div className="login-input-div login-one">
              <div className="login-i">
                <i className="login-fas login-fa-user"></i>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Email"
                  onChange={(e) => handleChange(e, setEmail)}
                />
              </div>
            </div>
            <div className="login-input-div login-pass">
              <div className="login-i">
                <i className="login-fas login-fa-lock"></i>
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  onChange={(e) => handleChange(e, setPassword)}
                />
              </div>
            </div>
            <a href="/">Forgot Password?</a>
            <input type="submit" className="login-btn" value="Login" />
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
