import './App.css';
import axios from 'axios'
import { Route, Switch } from 'react-router-dom';
import SignInSide from './MyComponents/Login.js'
import About from './MyComponents/About.js'

function App() {
  return (
    <>
      <Switch>
        <Route exact path='/' component={SignInSide} />
        <Route exact path='/about' component={About} />
      </Switch>
    </>
  );
}

export default App;

