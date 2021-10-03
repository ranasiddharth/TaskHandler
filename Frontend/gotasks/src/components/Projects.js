import http from "./axios.js";
import {AppBar, Toolbar} from '@material-ui/core'
import useStyles from '../styles/Navbar.js'
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box'
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from '@material-ui/core/CardActions'
import AddBoxIcon from '@material-ui/icons/AddBox';
import HomeIcon from '@material-ui/icons/Home';
import { Link } from 'react-router-dom'
import {useState, useEffect} from 'react';
import useCardStyles from '../styles/DashboardCard'
import { AddProject } from './AddProject.js'
import { useHistory } from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie';


const Navbar = (props) => {

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
          <Button className={classes.buttonmargin} startIcon={<HomeIcon />} disableElevation><Link to="/gotasks/dashboard" className={classes.linkcol}>DASHBOARD</Link></Button>
          <Button className={classes.buttoncol} onClick={handleOpen} startIcon={<AddBoxIcon />} disableElevation>Add New</Button>
          <AddProject getproj={props.projects} setGetproj={props.setProjects} open={open} handleClose={handleClose} />
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export const ProjectItem = (props) => {

  const classes = useCardStyles();

  const history = useHistory();

  const projectDetails = (id) => {

    history.push(`/gotasks/projects/${id}`)

  }

  return(
    <Card sx={{ minWidth: 275 }} variant="outlined" className={classes.cardattr}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            Name: {props.project.project_name}
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Description: {props.project.project_wiki}
          </Typography>
          <Typography variant="body2" gutterBottom>
            Created by: {props.project.project_creator}
          </Typography>
        </CardContent>
        <CardActions className={classes.cardActions}>
            <Button size="small" color="primary" variant="contained" onClick={(e)=>{
              e.preventDefault(); 
              projectDetails(props.project.id)}}>Details</Button>
        </CardActions>
    </Card>
  )

}

export const Projects = () => {

  const [projects, setProjects] = useState([])

  const classes = useCardStyles();

  const history = useHistory();

  const fetchData = () => {
     http.get("/gotasks/projects").then(
      (res) => {
        setProjects(res.data)
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


  return (
    <>
    <Navbar projects={projects} setProjects={setProjects} />
    <div>
    <br />

    {projects.map(project => {
      return (
      <>
      <ProjectItem key={project.id} project={project} />
      </>
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

