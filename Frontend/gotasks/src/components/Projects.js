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

export const ProjectItem = (props) => {

  const classes = useCardStyles()

  const fetchList = async(id) => {
    await axios.get(`http://127.0.0.1:8000/gotasks/projects/${id}`, {withCredentials: true})
    .then(res => {
      console.log(res.data)
      console.log(id)
    }).catch(err=>{
      console.log(err)
    })
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
        <CardActions>
            <Button size="small" onClick={()=>{fetchList(props.project.id)}}>Details</Button>
        </CardActions>
    </Card>
  )

}

export const Projects = () => {

  const [projects, setProject] = useState([])

  const fetchData = async() => {
     await axios.get("http://127.0.0.1:8000/gotasks/projects", {withCredentials:true}).then(
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

    {projects.map(project => {
      return (
      <>
      <ProjectItem key={project.id} project={project} />
      </>
      )
    })}
    </div>
    </>
  )
}

