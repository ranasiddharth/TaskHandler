import './App.css';
import { Route, Switch } from 'react-router-dom';
import Login from './components/Login.js'
import {Oauth} from './components/Oauth.js'
import {Dashboard} from './components/Dashboard.js'
import {Projects} from './components/Projects.js'
import {Members} from './components/Members.js'
import {useState, useEffect} from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom';
import NotFound from './components/NotFound';
import { ProjectDetails } from './components/ProjectDetails';
import { ProjectList } from './components/ProjectList';
import { ProjectListDetails } from './components/ProjectListDetails';
import { ListCard } from './components/ListCard';
import { ListCardDetails } from './components/ListCardDetails';


function App() {

  const history = useHistory()
  const [loggedin, setLoggedin] = useState(false)
  const checkLoginStatus = () => {
    axios.get("http://127.0.0.1:8000/gotasks/login_check/", {withCredentials:true})
    .then(response => {
      console.log(response)
      if (response.data.loggedin === true && loggedin === false){
        setLoggedin(true)
      }
      if (response.data.loggedin === false && loggedin === false){
        setLoggedin(false)
      }
    }).catch(error => {
      console.log("login check failed, try again", error)
    })
  }

  useEffect(()=>{
    checkLoginStatus();
    // console.log(loggedin)
  })

  return (
    <>
      <Switch>
        <Route exact path='/' >
          <Login />
        </Route>
        <Route exact path='/gotasks/oauth/' >
          <Oauth />
        </Route>
        <Route exact path='/gotasks/dashboard/' >
          <Dashboard loginStatus={loggedin} />
        </Route>
        <Route exact path='/gotasks/projects/' >
          <Projects loginStatus={loggedin} />
        </Route>
        <Route exact path='/gotasks/projects/:proj_id' >
          <ProjectDetails loginStatus={loggedin}/>
        </Route>
        <Route exact path='/gotasks/projects/:proj_id/lists' >
          <ProjectList loginStatus={loggedin} />
        </Route>
        <Route exact path='/gotasks/projects/:proj_id/lists/:list_id' >
          <ProjectListDetails loginStatus={loggedin} />
        </Route>
        <Route exact path='/gotasks/projects/:proj_id/lists/:list_id/cards' >
          <ListCard loginStatus={loggedin} />
        </Route>
        <Route exact path='/gotasks/projects/:proj_id/lists/:list_id/cards/:card_id' >
          <ListCardDetails loginStatus={loggedin}/>
        </Route>
        <Route exact path='/gotasks/users/' >
          <Members loginStatus={loggedin}/>
        </Route>
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

export default App;

