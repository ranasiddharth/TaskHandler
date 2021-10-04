import http from "./axios.js";
import axios from 'axios';
import Cookies from "js-cookie";
import {AppBar, Toolbar} from '@material-ui/core'
import useStyles from '../styles/Navbar.js'
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box'
import {useState, useEffect} from 'react';
import { Link } from 'react-router-dom'
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import HomeIcon from '@material-ui/icons/Home';
import useCardStyles from '../styles/DashboardCard'
import DoneIcon from "@material-ui/icons/Done";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";
import { useHistory } from "react-router-dom";


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
          <Button className={classes.buttoncol} startIcon={<HomeIcon />} disableElevation><Link to="/gotasks/dashboard" className={classes.linkcol}>DASHBOARD</Link></Button>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}


export const Members = () => {

  const classes = useCardStyles()
  const history = useHistory();
  const [users, setUsers] = useState([])

  const fetchData = async() => {
     await http.get("/gotasks/users").then(
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

  const goback = () => {

    history.goBack();

  }

  const loggingout = () => {
      axios.get("http://127.0.0.1:8000/gotasks/logout", {withCredentials: true}).then((resp)=>{
        Cookies.remove('mytoken');
        Cookies.remove('sessionid');
        Cookies.remove('csrftoken');
        history.push('/');
      }).catch((err)=>{
        console.log("error while logging out")
      })
  }


  const handleadminchange = async(id, moderator) => {
    let formData = {
      "moderator": !moderator,
    }
    const config = {
      headers: {
        "Content-Type": 'application/json',
        'X-CSRFToken': Cookies.get("csrftoken"),
        'X-Requested-With': 'XMLHttpRequest'
      }
    }
    await axios.patch(`http://127.0.0.1:8000/gotasks/users/${id}/`,
    formData, config)
    .then(res => {
      console.log(res.data)
    }).catch(err => {
      console.log(err)
    })

    await fetchData();
  }

  const handlebanchange = async(id, banned) => {
    let formData = {
      "is_banned": !banned
    }
    const config = {
      headers: {
        "Content-Type": 'application/json',
        'X-CSRFToken': Cookies.get("csrftoken"),
        'X-Requested-With': 'XMLHttpRequest'
      }
    }
    await axios.patch(`http://127.0.0.1:8000/gotasks/users/${id}/`,
    formData, config)
    .then(res => {
      console.log(res.data)
    }).catch(err => {
      console.log(err)
    })

    await fetchData();
  }
  

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
            {user.moderator ? <Button size="small" variant="outlined" style={{ marginLeft: '5px',color: 'red'}}  onClick={() => {handleadminchange(user.id, user.moderator)}}>Remove as admin</Button>: 
            <Button size="small" variant="outlined" style={{marginLeft: '5px', color: 'green'}} onClick={() => {handleadminchange(user.id, user.moderator)}}>Make admin</Button>}
          </Typography>
          <Typography variant="body2" gutterBottom>
          <p>Banned:</p>{user.is_banned ? <DoneIcon />: <CancelRoundedIcon />}
            {user.is_banned ? <Button size="small" variant="outlined" style={{marginLeft: '5px', color: 'green'}} onClick={() => {handlebanchange(user.id, user.is_banned)}}>Enable</Button>: 
            <Button size="small" variant="outlined" style={{marginLeft: '5px', color: 'red'}}  onClick={() => {handlebanchange(user.id, user.is_banned)}}>Disable</Button>}
          </Typography>
        </CardContent>
      </Card>
      )
    })}
    </div>
    <div className={classes.logoutOutdiv}>
      <div className={classes.logoutIndiv}>
          <Button className={classes.buttonmargin} variant="outlined" style={{backgroundColor: '#12824C', color: '#FFFFFF'}} onClick={()=>{goback()}}>Back</Button>
          <Button className={classes.buttonmargin} style={{backgroundColor: 'red', color: '#FFFFFF'}} onClick={()=>{loggingout()}}>Logout</Button>
      </div>
    </div>
    </>
  )

}