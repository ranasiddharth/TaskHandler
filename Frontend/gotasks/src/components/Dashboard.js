import http from "./axios.js";
import React from 'react'
import axios from 'axios'
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box'
import Card from "@material-ui/core/Card";
import moment from "moment";
import CardContent from "@material-ui/core/CardContent";
import CardActions from '@material-ui/core/CardActions'
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import GroupIcon from '@material-ui/icons/Group';
import WorkIcon from '@material-ui/icons/Work';
import {useState, useEffect} from 'react';
import {AppBar, Toolbar} from '@material-ui/core'
import useStyles from '../styles/Navbar.js'
import useCardStyles from '../styles/DashboardCard'
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie'
import { useHistory } from "react-router-dom";
import "../styles/ListTags.css"


const Navbar = () => {

  const [admin, setAdmin] = useState(false)
  const classes = useStyles()

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/gotasks/users/", {withCredentials:true}).then(
      (res) => {
        if (res.status === 200){
          setAdmin(true)
        }
      }
    ).catch(error => {
      console.log(error)
    })
  }, [])

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            DASHBOARD
          </Typography>
          <div>
          <Button className={classes.buttonmargin} startIcon={<WorkIcon />} disableElevation><Link to="/gotasks/projects" className={classes.linkcol}>Projects</Link></Button>
          {admin ? <Button className={classes.buttoncol} startIcon={<GroupIcon />} disableElevation><Link to="/gotasks/users" className={classes.linkcol}>Members</Link></Button> : ''}
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}


const Project = (props) => {

  const projects = props.projectState

  const classes = useCardStyles()

  const history = useHistory();

  const proj = (id) => {

    history.push(`/gotasks/projects/${id}`);

  }

  return(
    <div>
    <h1 className={classes.heading}>Projects</h1>
    {projects.map(project => {
      return (
        <Card sx={{ minWidth: 275 }} variant="outlined" className={classes.cardattr} key={project.id}>
          <CardContent>
            <Typography variant="h5" component="div" gutterBottom>
            <strong>Name:</strong> {project.project_name}
            </Typography>
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

  const classes = useCardStyles()

  const history = useHistory();

  const getcard = (id) => {

    // history.push(`/gotasks/cards/${id}`)
    console.log(id)

  }

  
  return(
    <div >
    <h1 className={classes.heading}>Assigned Cards</h1>
    {cards.map(card => {
        return (
        <Card sx={{ minWidth: 275 }} variant="outlined" className={classes.cardattr} key={card.id}>
          <CardContent>
            <Typography variant="h5" component="div" gutterBottom>
              <strong>Name:</strong> {card.card_name}
            </Typography>
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
              <Button size="small" variant="contained" color="primary" onClick={() => {getcard(card.id)}} disableElevation>Details</Button>
          </CardActions>
        </Card>
        )
      })}
    </div>
  )
}


export const Dashboard = () => {

  const history = useHistory();

  const classes = useCardStyles()
  const [projects, setProjects] = useState([])
  const [cards, setCards] = useState([])

  const fetchData = async() => {
    const projectAPI = http.get("/gotasks/dashboard/projects")
    const cardAPI = http.get("/gotasks/dashboard/cards")
    await axios.all([projectAPI, cardAPI]).then(
      ([project, card]) => {
        setProjects(project.data)
        setCards(card.data)  
      })
      .catch(err => {
      console.log("error in retrieving data")
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

  
  return(
    <div> 
          <Navbar />
          <Grid container component="main" className={classes.mainGrid}>
            <CssBaseline />
            <Grid item xs={12} sm={12} md={6}>
            <Project projectState = {projects} />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
            <CardShow cardState = {cards} />
            </Grid>
          </Grid>
          <div className={classes.logoutOutdiv}>
            <div className={classes.logoutIndiv}>
              <Button className={classes.buttonmargin} variant="outlined" style={{backgroundColor: '#12824C', color: '#FFFFFF'}} onClick={()=>{goback()}}>Back</Button>
              <Button className={classes.buttonmargin} style={{backgroundColor: 'red', color: '#FFFFFF'}} onClick={()=>{loggingout()}}>Logout</Button>
            </div>
          </div>
    </div>
  )
}
