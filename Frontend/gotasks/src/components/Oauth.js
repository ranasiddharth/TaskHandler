import React from 'react';
import { useEffect, useState } from 'react'
import axios from 'axios';
import { Loading } from './Loading';
import { Redirect } from 'react-router';
import Cookies from 'js-cookie'


export const Oauth = () => {

  const dashboard = () => {
    window.location.href = "http://localhost:3000/gotasks/dashboard/"
  }

  const [success, setSuccess] = useState(false)

  useEffect(() => {

    // eslint-disable-next-line no-restricted-globals
    const params = new URLSearchParams(location.search);
    const auth = params.get("code");

      axios.get(`http://127.0.0.1:8000/?code=${auth}&state=RANDOM_STATE_STRING`, 
      {withCredentials: true})
      .then(response => {
        Cookies.set('sessionid', response.data['sessionid'], {path:"/"})
        Cookies.set('csrftoken', response.data['csrftoken'], {path:"/"})
        Cookies.set('mytoken', response.data['mytoken'], {path:"/"})
        setSuccess(true)
        
      }).catch(err => {
        console.log("error occured while authenticating");
        <Redirect to="/" />
      })

  }, [])

  return (
    <div>
        {Cookies.get('mytoken') !== undefined ? dashboard() : <Loading /> }
    </div>
  )
}
