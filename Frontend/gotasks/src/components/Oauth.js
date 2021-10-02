import React from 'react';
import { useEffect, useState } from 'react'
import axios from 'axios';
import { Loading } from './Loading';
import Cookies from 'js-cookie'
import { Redirect } from 'react-router';


export const Oauth = () => {

  const dashboard = () => {
    window.location.href = "http://localhost:3000/gotasks/dashboard/"
    // return (
    //   <Redirect to="/gotasks/dashboard" />
    // )
  }

  const [loggedIn, setLoggedIn] = useState(false)
  // const [loading, setLoading] = useState(true)

  useEffect(() => {

    // eslint-disable-next-line no-restricted-globals
    const params = new URLSearchParams(location.search);
    const auth = params.get("code");

      axios.get(`http://127.0.0.1:8000/?code=${auth}&state=RANDOM_STATE_STRING`, {withCredentials: true})
      .then(response => {
        if(response.status === 200){
          console.log("cookies set")
          Cookies.set('csrftoken', response.data['csrftoken'], {path:"/"})
          Cookies.set('sessionid', response.data['sessionid'], {path:"/"})
          Cookies.set('mytoken', response.data['mytoken'], {path:"/"})
          setLoggedIn(true)
          // setLoading(false)
        }else{
          setLoggedIn(false)
        }
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
