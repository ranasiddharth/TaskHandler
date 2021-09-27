import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import Typography from '@material-ui/core/Typography';
import useStyles from '../styles/LoginStyles.js'
import { BeatingHeart } from 'beating-heart-emoji'
import 'beating-heart-emoji/dist/index.css'
import { Dashboard } from './Dashboard.js';
import Cookies from 'js-cookie';


function Copyright() {
  return (
    <Typography variant="body2" color="textPrimary" align="center">
      {'Made with '}{<BeatingHeart />}
      <Link color="textPrimary" href="https://channeli.in/">
        GoTasks Project Collaborator
      </Link>{' '}
    </Typography>
  );
}


export default function Login() {

  const classes = useStyles();

  const oauth = () => {
    // eslint-disable-next-line no-restricted-globals
    window.location.href='https://channeli.in/oauth/authorise/?client_id=RZ1hP1gezPy5j6fBffYBllW2PQvYxlQrx7IbikbG&redirect_uri=http://localhost:3000/gotasks/oauth/&state=RANDOM_STATE_STRING'
  }

  if(Cookies.get('mytoken') !== undefined){
    return(
      <Dashboard />
    )
  }

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={12} sm={12} md={6} className={classes.image}/>
      <Grid item xs={12} sm={12} md={6} className={classes.signupdiv}>
        <Grid item xs={11} sm={11} md={11} component={Paper} elevation={11} square className={classes.signupsubdiv}>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <VpnKeyIcon />
            </Avatar>
            <Typography component="h1" variant="h4" gutterBottom >
              GoTasks
            </Typography>
            <Typography component="h1" variant="h5" gutterBottom>
              Login Using Oauth 2.0
            </Typography>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick = {oauth}
              >
                Sign In
              </Button>
              <Copyright />
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
}