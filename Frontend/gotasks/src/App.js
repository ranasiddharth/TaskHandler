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
          <Dashboard />
        </Route>
        <Route exact path='/gotasks/projects/' >
          <Projects />
        </Route>
        <Route exact path='/gotasks/projects/:proj_id' >
          <ProjectDetails />
        </Route>
        <Route exact path='/gotasks/projects/:proj_id/lists' >
          <ProjectList />
        </Route>
        <Route exact path='/gotasks/projects/:proj_id/lists/:list_id' >
          <ProjectListDetails />
        </Route>
        <Route exact path='/gotasks/projects/:proj_id/lists/:list_id/cards' >
          <ListCard />
        </Route>
        <Route exact path='/gotasks/projects/:proj_id/lists/:list_id/cards/:card_id' >
          <ListCardDetails />
        </Route>
        <Route exact path='/gotasks/users/' >
          <Members />
        </Route>
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

export default App;

