import React from 'react';
import { useEffect, useState } from 'react'
import axios from 'axios';
import { Loading } from './Loading';
import Cookies from 'js-cookie'


export const Oauth = () => {

  const dashboard = () => {
    window.location.href = "http://localhost:3000/gotasks/dashboard/"
  }

  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {

    // eslint-disable-next-line no-restricted-globals
    const params = new URLSearchParams(location.search);
    const auth = params.get("code");

      axios.get(`http://127.0.0.1:8000/?code=${auth}&state=RANDOM_STATE_STRING`, {withCredentials: true})
      .then(response => {
        console.log("cookies set")
        Cookies.set('csrftoken', response.data['csrftoken'], {path:"/"})
        Cookies.set('sessionid', response.data['sessionid'], {path:"/"})
        Cookies.set('mytoken', response.data['mytoken'], {path:"/"})
        setLoggedIn(true)
      }).catch(err => {
        setLoggedIn(false)
        console.log("error occured while authenticating");
      })

  }, [])

  return (
    <div>
        {loggedIn ? dashboard() : <Loading />}
    </div>
  )
}
