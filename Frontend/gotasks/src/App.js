import './App.css';
import { Route, Switch } from 'react-router-dom';
import Login from './components/Login.js'
import {Oauth} from './components/Oauth.js'
import {Dashboard} from './components/Dashboard.js'
import {Projects} from './components/Projects.js'
import {Members} from './components/Members.js'
// import {Loading} from './components/Loading.js'

function App() {
  return (
    <>
      <Switch>
        <Route exact path='/' component={Login} />
        <Route exact path='/gotasks/oauth/' component={Oauth} />
        {/* <Route exact path='/1' component={Loading} /> */}
        <Route exact path='/gotasks/dashboard/' component={Dashboard} />
        <Route exact path='/gotasks/projects/' component={Projects} />
        <Route exact path='/gotasks/users/' component={Members} />
      </Switch>
    </>
  );
}

export default App;

