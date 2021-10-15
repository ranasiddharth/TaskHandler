import http from "./axios.js";
import Cookies from 'js-cookie';
import React from 'react'
import axios from 'axios'
import Typography from '@material-ui/core/Typography';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import moment from "moment";
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import GroupIcon from '@material-ui/icons/Group';
import WorkIcon from '@material-ui/icons/Work';
import {useState, useEffect} from 'react';
import {AppBar, Toolbar, CardContent, CardActions, CssBaseline, Card, Box, Button} from '@material-ui/core'
import useStyles from '../styles/Navbar.js'
import useCardStyles from '../styles/DashboardCard'
import { Link } from 'react-router-dom'
import { Loading } from "./Loading.js";
import { useHistory } from "react-router-dom";
import "../styles/ListTags.css";
import Header2 from "./Header2.js";
import SearchIcon from "@material-ui/icons/Search"
import useSearchStyles from "../styles/SearchBar.js";


const Project = (props) => {

  const projects = props.projectState
  const searcher = useSearchStyles();
  const [q, setQ] = useState("");
  const [searchParam] = useState(["project_name"]);

  const classes = useCardStyles()

  const history = useHistory();

  const proj = (id) => {

    history.push(`/gotasks/projects/${id}`);

  }

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

  return(
    <div>
    <h1 className={classes.heading}>Projects</h1>
    <div className={searcher.search}>
          <SearchIcon />
          <input
          type="search"
          name="search-form"
          id="search-form"
          style={{flexGrow: "1", border: "none", outline: "none", height: "100%", borderRadius: "5px", fontSize: "16px"}}
          className="search-input"
          placeholder="Search projects by name..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
    </div>
    <br />
    {search(projects).map(project => {
      return (
        <Card sx={{ minWidth: 275 }} variant="outlined" className={classes.cardattr} key={project.id}>
          <CardContent>
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <div>
              <Typography variant="h5" component="div">
              <strong>Name:</strong> {project.project_name}
              </Typography>
            </div>
            <div>
              <Avatar className={classes.avatar}>{project.project_name.charAt(0).toUpperCase()}</Avatar>
            </div>
          </div>
            <Typography sx={{ fontSize: 14 }} gutterBottom>
            <strong>Description:</strong>
          </Typography>
            <div>
            <Typography sx={{ fontSize: 14 }} gutterBottom dangerouslySetInnerHTML={{__html: project.project_wiki}}>
              
            </Typography>
            </div>
            <Typography variant="body2" gutterBottom>
              <strong>Created by:</strong> {project.project_creator.fullname}
            </Typography>
          </CardContent>
          <CardActions className={classes.cardActions}>
              <Button size="small" variant="contained" color="primary" onClick={()=>{proj(project.id)}} disableElevation>Details</Button>
          </CardActions>
        </Card>
      )
    })}
    </div>
  )
}


const CardShow = (props) => {

  const cards = props.cardState
  const searcher = useSearchStyles();
  const [q, setQ] = useState("");
  const [searchParam] = useState(["card_name"]);

  const classes = useCardStyles()

  const history = useHistory();

  const getcard = (id1, id2, id3) => {

    history.push(`/gotasks/projects/${id1}/lists/${id2}/cards/${id3}`)

  }

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
  
  return(
    <div >
    <h1 className={classes.heading}>Assigned Cards</h1>
    <div className={searcher.search}>
          <SearchIcon />
          <input
          type="search"
          name="search-form"
          id="search-form"
          style={{flexGrow: "1", border: "none", outline: "none", height: "100%", borderRadius: "5px", fontSize: "16px"}}
          className="search-input"
          placeholder="Search cards by name..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
    </div>
      <br />
    {search(cards).map(card => {
        return (
        <Card sx={{ minWidth: 275 }} variant="outlined" className={classes.cardattr} key={card.id}>
          <CardContent>
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <div>
            <Typography variant="h5" component="div">
              <strong>Name:</strong> {card.card_name}
            </Typography>
            </div>
            <div>
              <Avatar className={classes.avatar}>{card.card_name.charAt(0).toUpperCase()}</Avatar>
            </div>
          </div>
            <Typography sx={{ fontSize: 14 }} gutterBottom>
              <strong>Description:</strong> {card.description}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Created on:</strong> {moment(card.date_created).format("dddd, MMMM Do YYYY, h:mm:ss a")}
            </Typography>
            <Typography variant="body2">
              <strong>Due Date:</strong> {moment(card.due_date).format("dddd, MMMM Do YYYY, h:mm:ss a")}
            </Typography>
          </CardContent>
          <CardActions className={classes.cardActions}>
              <Button size="small" variant="contained" color="primary" onClick={() => {getcard(card.list.project, card.list.id, card.id)}} disableElevation>Details</Button>
          </CardActions>
        </Card>
        )
      })}
    </div>
  )
}


export const Dashboard = (props) => {

  const history = useHistory();

  const classes = useCardStyles()
  const [user, setUser] = useState({})
  const [fetched, setFetched] = useState(false)
  const [projects, setProjects] = useState([])
  const [cards, setCards] = useState([])
  // const [username, setUsername] = useState("")

  async function fetchData(){
    await http.get("/gotasks/loggeduser/")
    .then(res => {
      setUser(res.data[0])
      // console.log(res.data)
    })
    .catch(err => console.log(err))

    // const projectAPI = http.get("/gotasks/dashboard/projects")
    // const cardAPI = http.get("/gotasks/dashboard/cards")
    // axios.all([projectAPI, cardAPI]).then(
    //   ([project, card]) => {
    //     setProjects(project.data)
    //     setCards(card.data)  
    //     setFetched(true)
    //   })
    //   .catch(err => {
    //   console.log("error in retrieving data")
    // })
    let count = 0;
    await http.get("/gotasks/dashboard/projects").then(
      res=>{
        setProjects(res.data);
        count=count+1;
      }
    ).catch(err => console.log(err))

    await http.get("/gotasks/dashboard/cards").then(
      res=>{
        setCards(res.data)
        count=count+1;
        // setFetched(true)
      }
    ).catch(err => console.log(err))

    if(count == 2){
      setFetched(true)
    }
  }

  useEffect(() => {
    if(!props.loginStatus){
      history.push("/");
    }
    fetchData()
  }, [])


  if(!fetched === true){
    return(
      <>
      {/* <Header2 /> */}
      <Loading />
      </>
    )
  }
  else{
    return(
      <div> 
              <Header2 />
              <h3 style={{textAlign: "center", margin: "20px", marginBottom: "0px"}}>Welcome {user.fullname} !</h3>
              <Grid container component="main" className={classes.mainGrid}>
                <CssBaseline />
                <Grid item xs={12} sm={12} md={6}>
                <Project projectState = {projects} />
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                <CardShow cardState = {cards} />
                </Grid>
              </Grid>
      </div>
    )
  }
}