import React, { useState } from "react";
import "../styles/Login.css";
import wave from "../assets/wave.png";
import avatar from "../assets/avatar.svg";
import bg from "../assets/bg.svg";
import { auth, googleProvider } from "../base";
import { useHistory } from "react-router-dom";
import { db } from "../base";

function Login() {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleChange = (e, func) => func(e.target.value);

  const handleOnline = async ({ user, additionalUserInfo }) => {
    if (additionalUserInfo.isNewUser) {
      await db.collection("riders").doc(user.uid).set({ registered: false });
    }

    let registered = await (
      await db.collection("riders").doc(user.uid).get()
    ).data().registered;

    console.log({ registered });
    if (!registered) {
      auth.signOut();
      alert(
        "Account not Registered, Please contact ridertrackingsystem@gmail.com"
      );
    } else {
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
    }
  };
  // LOGIN BUTTON PRESSED
  const submit = async (e) => {
    e.preventDefault();
    await auth
      .signInWithEmailAndPassword(email, password)
      .then(handleOnline)
      .catch(alert);
  };

  const handleGoogleLogin = (e) => {
    e.preventDefault();
    auth.signInWithPopup(googleProvider).then(handleOnline).catch(console.log);
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
            <input type="submit" className="login-btn" value="Login" />

            <button
              type="button"
              style={{
                backgroundColor: "white",
                border: "1px solid black",
                padding: "10px 20px 10px 20px",
                borderRadius: "10px",
              }}
              onClick={handleGoogleLogin}
            >
              Sign in With Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
