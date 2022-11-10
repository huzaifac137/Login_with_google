import React, { useState, useEffect } from "react";
import "./App.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";

function App() {
  const [loginData, setLoginData] = useState(
    localStorage.getItem("LoginData")
      ? JSON.parse(localStorage.getItem("LoginData"))
      : null,
  );

  const handleLogout = () => {
    localStorage.removeItem("LoginData");
    setLoginData(null);
  };

  const handleResponse = async (resp) => {
    if (localStorage.getItem("LoginData") && loginData) {
      setLoginData(JSON.parse(localStorage.getItem("LoginData")));
    } else {
      const response = await fetch("http://localhost:5000/api/google-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          token: "bearer " + resp.credential,
        }),
      });

      const responseData = await response.json();

      if (response.status === 200) {
        setLoginData(responseData);
        localStorage.setItem("LoginData", JSON.stringify(responseData));
        console.log(responseData);
      }
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div className="App">
        {loginData ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <h3>
              {" "}
              You {loginData.name} is Logged in as {loginData.email}{" "}
            </h3>
            <img
              src={loginData.picture}
              width={100}
              height={100}
              style={{ borderRadius: "50%" }}
              alt=""
            />
            <button onClick={handleLogout}>LOGOUT</button>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <h2>NOT LOGGED IN !</h2>

            <GoogleLogin
              onSuccess={handleResponse}
              onError={() => {
                console.log("Login Failed");
              }}
            />
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
