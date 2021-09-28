import './App.css';
import { Route, Switch } from 'react-router-dom';
import Login from './components/Login.js'
import {Oauth} from './components/Oauth.js'
import {Dashboard} from './components/Dashboard.js'
import {Projects} from './components/Projects.js'
import {Members} from './components/Members.js'
import {useState, useEffect} from 'react'
import axios from 'axios'


function App() {

  const [loggedin, setLoggedin] = useState(false)

  const checkLoginStatus = async() => {
    await axios.get("http://127.0.0.1:8000/gotasks/login_check/", {withCredentials:true})
    .then(response => {
      console.log(response)
      if (response.data.loggedin === true && loggedin === false){
        setLoggedin(true)
      }
      if (response.data.loggedin === false && loggedin === false){
        setLoggedin(false)
      }
    }).catch(error => {
      console.log("cookie not set in backend", error)
    })
  }

  useEffect(()=>{
    checkLoginStatus();
  })

  return (
    <>
      <Switch>
        <Route exact path='/' component={Login} />
        <Route exact path='/gotasks/oauth/' component={Oauth} />
        <Route exact path='/gotasks/dashboard/' component={Dashboard} />
        <Route exact path='/gotasks/projects/' component={Projects} />
        <Route exact path='/gotasks/users/' component={Members} />
      </Switch>
    </>
  );
}

export default App;

