import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Loading } from "./Loading";
import Cookies from "js-cookie";
import { Redirect } from "react-router";
import NotMaintainer from "./NotMaintainer";
import Banned from "./Banned";

export const Oauth = () => {
  const dashboard = () => {
    window.location.href = "http://localhost:3000/gotasks/dashboard/";
  };

  const [loggedIn, setLoggedIn] = useState(false);
  const [banned, setBanned] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line no-restricted-globals
    const params = new URLSearchParams(location.search);
    const auth = params.get("code");

    axios
      .get(`http://127.0.0.1:8000/?code=${auth}&state=RANDOM_STATE_STRING`, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          console.log("cookies set");
          Cookies.set("csrftoken", response.data["csrftoken"], { path: "/" });
          Cookies.set("sessionid", response.data["sessionid"], { path: "/" });
          Cookies.set("mytoken", response.data["mytoken"], { path: "/" });
          setLoggedIn(true);
          setBanned(false);
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          if (
            error.response.data === "Only site maintainers can access this app"
          ) {
            setBanned(false);
            setLoggedIn(false);
          } else {
            setBanned(true);
            setLoggedIn(false);
          }
        }
        console.log("error occured while authenticating");
      });
  }, []);

  return (
    <div>
      {loggedIn && !banned ? (
        dashboard()
      ) : !loggedIn && !banned ? (
        <NotMaintainer />
      ) : (
        <Banned />
      )}
    </div>
  );
};
