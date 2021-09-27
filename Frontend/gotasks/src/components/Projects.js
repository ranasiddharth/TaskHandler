import react from 'react'
import http from "./axios.js";
import axios from 'axios'
import {AppBar, Toolbar, Tabs, Tab} from '@material-ui/core'
import useStyles from '../styles/Navbar.js'
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box'
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from '@material-ui/core/CardActions'
import { Link } from 'react-router-dom'
import {useState, useEffect} from 'react';
import useCardStyles from '../styles/DashboardCard'
import { ProjectDialog } from './ProjectDialog.js'


const Navbar = () => {

  const classes = useStyles()
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            PROJECTS
          </Typography>
          <div>
          <Button className={classes.buttonmargin}><Link to="/gotasks/dashboard" className={classes.linkcol}>DASHBOARD</Link></Button>
          <Button className={classes.buttoncol} onClick={handleOpen}>+ Add New</Button>
          <ProjectDialog open={open} handleClose={handleClose} />
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}


export const Projects = () => {

  const classes = useCardStyles()
  const [projects, setProject] = useState([])

  const fetchData = () => {
    http.get("/gotasks/projects").then(
      (res) => {
        setProject(res.data)
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
    {/* <Button variant="contained" color="primary" onClick={handleOpen}>
        Add Project
    </Button> */}

    
    {projects.map(project => {
      return (
      <Card sx={{ minWidth: 275 }} variant="outlined" className={classes.cardattr}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            Name: {project.project_name}
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Description: {project.project_wiki}
          </Typography>
          <Typography variant="body2" gutterBottom>
            Created by: {project.project_creator}
          </Typography>
        </CardContent>
        <CardActions>
            <Button size="small">Details</Button>
        </CardActions>
      </Card>
      )
    })}
    </div>
    </>
  )
}

