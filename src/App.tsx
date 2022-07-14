import React, { useState, useEffect } from "react";
import Login from "./Components/System/Login";
import Engine from "./Components/Engine/Engine";
import { PageHeader, message, notification } from "antd";
import "./App.css";
import './styles/introjs.min.css';
import "antd/dist/antd.dark.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import Footer from "./Components/System/Footer";

const stateKey = "spotify_auth_state-x43kdwe3ay";

/* A constant that is used to determine the URL of the server. */
const fqdn: string =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.REACT_APP_LIVE_URI ?? "";

/**
 * It returns a PageHeader component from Ant Design
 * @returns A PageHeader component from Ant Design.
 */
const Header = () => {
  return (
    <PageHeader
      className="site-page-header"
      title="Searchify"
      subTitle="A more advanced search for Spotify"
    />
  );
};

function App() {
  const [token, setToken] = useState("");

  /* Get the token from spotify and start the valdation timeout */
  useEffect(() => {
    const queryString = window.location.href.split("#")[1];
    const urlParams = new URLSearchParams(queryString);
    if (urlParams.has("access_token")) {
      if (urlParams.get("state") === localStorage.getItem(stateKey)) {
        setToken(urlParams.get("access_token") ?? "");
        setTimeout(() => {
          console.log("Key expired!")
          setToken("");
          notification.warning({
            message: "Please relog into Spotify!",
            duration: 0
          });
        }, parseInt(urlParams.get("expires_in") ?? "0") * 1000);
        window.history.pushState("", "", fqdn);
      } else {
        message.error("Please refresh this page and try again. If this error persists, please contact the developer.");
      }
    }
  }, []);



  return (
    <>
      {token === "" ? (
        <>
          <Header />
          <Login fqdn={fqdn} stateKey={stateKey} />{" "}
        </>
      ) : (
        <>
          <Header />
          <Engine token={token} />
        </>
      )}

    </>
  );
}

export default App;
