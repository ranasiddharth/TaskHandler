import http from "./axios.js";
import React from 'react'
import axios from 'axios'
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box'
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from '@material-ui/core/CardActions'
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import {useState, useEffect} from 'react';
import {AppBar, Toolbar} from '@material-ui/core'
import useStyles from '../styles/Navbar.js'
import useCardStyles from '../styles/DashboardCard'
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie'


const Navbar = () => {

  const [admin, setAdmin] = useState(false)
  const classes = useStyles()

  useEffect(async() => {
    await axios.get("http://127.0.0.1:8000/gotasks/users/", {withCredentials:true}).then(
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
          <Button className={classes.buttonmargin}><Link to="/gotasks/projects" className={classes.linkcol}>Projects</Link></Button>
          {admin ? <Button className={classes.buttoncol}><Link to="/gotasks/users" className={classes.linkcol}>Members</Link></Button> : ''}
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}


const Project = (props) => {

  const projects = props.projectState
  const classes = useCardStyles()

  return(
    <div>
    <h1 className={classes.heading}>Projects</h1>
    {projects.map(project => {
      return (
        <Card sx={{ minWidth: 275 }} variant="outlined" className={classes.cardattr} key={project.id}>
          <CardContent>
            <Typography variant="h5" component="div" gutterBottom>
              Name: {project.project_name}
            </Typography>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Description: {project.project_wiki}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Created by: {project.project_creator.fullname}
            </Typography>
          </CardContent>
          <CardActions>
              <Button size="small">Details</Button>
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
  
  return(
    <div >
    <h1 className={classes.heading}>Assigned Cards</h1>
    {cards.map(card => {
        return (
        <Card sx={{ minWidth: 275 }} variant="outlined" className={classes.cardattr} key={card.id}>
          <CardContent>
            <Typography variant="h5" component="div" gutterBottom>
              Name: {card.card_name}
            </Typography>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Description: {card.description}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Created on: {card.date_created}
            </Typography>
            <Typography variant="body2">
              Due Date: {card.due_date}
            </Typography>
          </CardContent>
          <CardActions>
              <Button size="small">Details</Button>
          </CardActions>
        </Card>
        )
      })}
    </div>
  )
}


export const Dashboard = () => {

  const classes = useCardStyles()
  const [projects, setProjects] = useState([])
  const [cards, setCards] = useState([])

  const fetchData = async() => {
    const projectAPI = await axios.get("http://127.0.0.1:8000/gotasks/dashboard/projects", {withCredentials:true})
    const cardAPI = await axios.get("http://127.0.0.1:8000/gotasks/dashboard/cards", {withCredentials:true})
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

  const loggingout = () => {
      axios.get("http://127.0.0.1:8000/gotasks/logout", {withCredentials:true}).then((resp)=>{
        Cookies.remove('mytoken');
        Cookies.remove('sessionid');
        Cookies.remove('csrftoken');
        window.location.href="http://localhost:3000/";
      }).catch((err)=>{
        console.log("error while logging out")
      })
  }

  
  return(
    <div> 
          <Navbar />
          <Button className={classes.buttonmargin} onClick={()=>{loggingout()}}>Logout</Button>
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
