import http from "./axios.js";
import axios from 'axios';
import {AppBar, Toolbar} from '@material-ui/core'
import useStyles from '../styles/Navbar.js'
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box'
import {useState, useEffect} from 'react';
import { Link } from 'react-router-dom'
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import useCardStyles from '../styles/DashboardCard'
import DoneIcon from "@material-ui/icons/Done";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";


const Navbar = () => {

  const classes = useStyles()

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            APP MEMBERS
          </Typography>
          <div>
          <Button className={classes.buttoncol}><Link to="/gotasks/dashboard" className={classes.linkcol}>DASHBOARD</Link></Button>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}


export const Members = () => {

  const classes = useCardStyles()
  const [users, setUsers] = useState([])

  const fetchData = () => {
     http.get("/gotasks/users").then(
      (res) => {
        setUsers(res.data)
      }
    ).catch(err => {
      console.log("error in receiving data")
    })
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <>
    <Navbar />
    <div>
    <br />
    {users.map(user => {
      return (
        <Card sx={{ minWidth: 275 }} variant="outlined" className={classes.cardattr} key={user.id}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            Name: {user.fullname}
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Username: {user.username}
          </Typography>
          <Typography variant="body2" gutterBottom>
            Email: {user.email}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <p>Moderator:</p>{user.moderator ? <DoneIcon />: <CancelRoundedIcon />}
          </Typography>
          <Typography variant="body2" gutterBottom>
          <p>Banned:</p>{user.is_banned ? <DoneIcon />: <CancelRoundedIcon />}
          </Typography>
        </CardContent>
      </Card>
      )
    })}
    </div>
    </>
  )

}