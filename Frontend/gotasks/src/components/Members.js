import http from "./axios.js";
import axios from 'axios';
import Cookies from "js-cookie";
import {AppBar, Toolbar} from '@material-ui/core'
import useStyles from '../styles/Navbar.js'
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box'
import {useState, useEffect} from 'react';
import Avatar from '@material-ui/core/Avatar';
import { Link } from 'react-router-dom'
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import HomeIcon from '@material-ui/icons/Home';
import useCardStyles from '../styles/DashboardCard'
import DoneIcon from "@material-ui/icons/Done";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";
import { useHistory } from "react-router-dom";
import { Loading } from "./Loading.js";
import Header from "./Header.js";
import SearchIcon from "@material-ui/icons/Search"
import useSearchStyles from "../styles/SearchBar.js";


export const Members = (props) => {

  const classes = useCardStyles()
  const history = useHistory();
  const [fetched, setFetched] = useState(false)
  const [users, setUsers] = useState([])
  const searcher = useSearchStyles();
  const [q, setQ] = useState("");
  const [searchParam] = useState(["fullname"]);
  const [loggedin, setLoggedin] = useState(false)
  const checkLoginStatus = async() => {
    await axios.get("http://127.0.0.1:8000/gotasks/login_check/", {withCredentials:true})
    .then(response => {
      console.log(response)
      if (response.data.loggedin === true && loggedin === false){
        setLoggedin(true)
      }
      else if (response.data.loggedin === false && loggedin === false){
        setLoggedin(false)
        history.push("/")
      }
      else{
        setLoggedin(false);
        history.push("/")
      }
    }).catch(error => {
      console.log("login check failed, try again", error)
    })
  }

  const fetchData = async() => {
    await http.get("/gotasks/users").then(
      (res) => {
        setUsers(res.data)
        setFetched(true)
      }
    ).catch(err => {
      console.log("error in receiving data")
    })
  }

  useEffect(async() => {
    await checkLoginStatus();
    await fetchData();
  }, [])


  function search(items) {
    return items.filter((item) => {
        return searchParam.some((newItem) => {
            return (
                item[newItem]
                    .toString()
                    .toLowerCase()
                    .indexOf(q.toLowerCase()) > -1
            );
        });
    });
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


  if(!fetched === true){
    return(
      <>
        <Header />
        <Loading />
      </>
    )
  }
  else{
    return (
      <>
      <Header />
      <div className={searcher.search}>
          <SearchIcon />
          <input
          type="search"
          name="search-form"
          list="data"
          autocomplete="off"
          id="search-form"
          style={{flexGrow: "1", border: "none", outline: "none", height: "100%", borderRadius: "5px", fontSize: "16px"}}
          className="search-input"
          placeholder="Search members by name..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
            <datalist id="data">
              {users.map((item, key) =>
                <option key={key} value={item.fullname} />
              )}
            </datalist>
      </div>
      <div>
      <br />
      {search(users).map(user => {
        const arr = user.fullname.split(" ")
        return (
          <Card sx={{ minWidth: 275 }} variant="outlined" className={classes.cardattr} key={user.id}>
          <CardContent>
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <div>
            <Typography variant="h5" component="div">
              <strong>Name:</strong> {user.fullname}
            </Typography>
            </div>
            <div>
              <Avatar className={classes.avatar}>{arr[0].charAt(0).toUpperCase()}{arr[1].charAt(0).toUpperCase()}</Avatar>
            </div>
          </div>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              <strong>Enrollment Number:</strong> {user.username}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Email:</strong> {user.email}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <p><strong>Moderator:</strong></p>{user.moderator ? <DoneIcon style={{position:"relative", top:"8.5px"}}/>: <CancelRoundedIcon style={{position:"relative", top:"8.5px"}}/>}
              {user.moderator ? <Button size="small" variant="outlined" style={{ marginLeft: '5px',color: 'red'}}  onClick={() => {handleadminchange(user.id, user.moderator)}}>Remove as admin</Button>: 
              <Button size="small" variant="outlined" style={{marginLeft: '5px', color: 'green'}} onClick={() => {handleadminchange(user.id, user.moderator)}}>Make admin</Button>}
            </Typography>
            <Typography variant="body2" gutterBottom>
            <p><strong>Banned:</strong></p>{user.is_banned ? <DoneIcon style={{position:"relative", top:"8.5px"}}/>: <CancelRoundedIcon style={{position:"relative", top:"8.5px"}}/>}
              {user.is_banned ? <Button size="small" variant="outlined" style={{marginLeft: '5px', color: 'green'}} onClick={() => {handlebanchange(user.id, user.is_banned)}}>Enable</Button>: 
              <Button size="small" variant="outlined" style={{marginLeft: '5px', color: 'red'}}  onClick={() => {handlebanchange(user.id, user.is_banned)}}>Disable</Button>}
            </Typography>
          </CardContent>
        </Card>
        )
      })}
      </div>
      </>
    )
  }
}