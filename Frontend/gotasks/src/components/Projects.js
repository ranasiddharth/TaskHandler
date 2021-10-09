import http from "./axios.js";
import {AppBar, Toolbar, Button, Typography, Box, Card} from '@material-ui/core'
import useStyles from '../styles/Navbar.js'
import CardContent from "@material-ui/core/CardContent";
import CardActions from '@material-ui/core/CardActions'
import AddBoxIcon from '@material-ui/icons/AddBox';
import { Link } from 'react-router-dom'
import {useState, useEffect} from 'react';
import useCardStyles from '../styles/DashboardCard'
import { AddProject } from './AddProject.js'
import { useHistory } from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie';
import "../styles/ListTags.css"
import { Loading } from "./Loading.js";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import Divider from "@material-ui/core/Divider";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import LogoutIcon from '@material-ui/icons/ExitToApp';
import GroupIcon from '@material-ui/icons/Group';
import HomeIcon from '@material-ui/icons/Home';


const Navbar = (props) => {

  const classes = useStyles()
  const [open, setOpen] = useState(false);
  const [opendrawer, setOpendrawer] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    // function call via props to handle the simultaneous frontend addition of project
    props.fetchData();
    setOpendrawer(false);
    setOpen(false);
  };

  const [admin, setAdmin] = useState(false)
  const history = useHistory()

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
            PROJECTS
          </Typography>
          <Hidden smDown>
          <div>
          <Button className={classes.buttonmargin} startIcon={<HomeIcon />} disableElevation><Link to="/gotasks/dashboard" className={classes.linkcol}>Dashboard</Link></Button>
          <Button disabled={!admin} className={classes.buttonmargin} startIcon={<GroupIcon />} disableElevation><Link to="/gotasks/users" className={classes.linkcol}>Members</Link></Button>
          <Button className={classes.buttonmargin} onClick={handleOpen} startIcon={<AddBoxIcon />} disableElevation>Add New</Button>
          <AddProject getproj={props.projects} setGetproj={props.setProjects} fetchData={props.fetchData} open={open} handleClose={handleClose} />
          <Button className={classes.buttoncol} startIcon={<LogoutIcon />} onClick={()=>{loggingout()}}disableElevation>Logout</Button>
          </div>
          </Hidden>
          <Hidden mdUp>
            <IconButton>
              <MenuIcon style={{ color: 'white' }} onClick={() => {setOpendrawer(true)}}/>
            </IconButton>
          </Hidden>
        </Toolbar>
        <SwipeableDrawer
          anchor="right"
          open={opendrawer}
          onOpen={() => setOpendrawer(true)}
          onClose={() => setOpendrawer(false)}
        >
        <div>
          <IconButton>
            <ChevronRightIcon onClick={()=>{setOpendrawer(false)}}/>
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem className={classes.phonelistitems}>
            <Button className={classes.buttonmargin} startIcon={<HomeIcon />} disableElevation><Link to="/gotasks/dashboard" className={classes.linkcol}>Dashboard</Link></Button>
          </ListItem>
          <ListItem className={classes.phonelistitems}>
          <Button disabled={!admin} className={classes.buttonmargin} startIcon={<GroupIcon />} disableElevation><Link to="/gotasks/users" className={classes.linkcol}>Members</Link></Button>
          </ListItem>
          <ListItem className={classes.phonelistitems}>
          <Button className={classes.buttoncol} onClick={handleOpen} startIcon={<AddBoxIcon />} disableElevation>Add New</Button>
          <AddProject getproj={props.projects} setGetproj={props.setProjects} fetchData={props.fetchData} open={open} handleClose={handleClose} />
          </ListItem>
          <ListItem className={classes.phonelistitems}>
          <Button className={classes.buttoncol} startIcon={<LogoutIcon />} onClick={()=>{loggingout()}}disableElevation>Logout</Button>
          </ListItem>
        </List>
      </SwipeableDrawer>
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
          <strong>Name:</strong> {props.project.project_name}
          </Typography>
          <Typography sx={{ fontSize: 14 }} gutterBottom>
            <strong>Description:</strong>
          </Typography>
          <div>
          <Typography sx={{ fontSize: 14 }} gutterBottom dangerouslySetInnerHTML={{__html: props.project.project_wiki}}>
          
          </Typography>
          </div>
          <Typography variant="body2" gutterBottom>
          <strong>Created by:</strong> {props.project.project_creator}
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

export const Projects = (props) => {

  const [projects, setProjects] = useState([])
  const [fetched, setFetched] = useState(false)

  const classes = useCardStyles();

  const history = useHistory();

  const fetchData = () => {
     http.get("/gotasks/projects").then(
      (res) => {
        setProjects(res.data)
        setFetched(true)
      }
    ).catch(err => {
      console.log("error in receiving data")
    })
  }

  useEffect(() => {
    if(!props.loginStatus === true){
      history.push("/");
    }
    fetchData()
  }, [])


  if(!fetched === true){
    return (
      <>
      <Navbar projects={projects} setProjects={setProjects} fetchData={fetchData}/>
      <Loading />
      </>
    )
  }
  else{
    return (
      <>
      <Navbar projects={projects} setProjects={setProjects} fetchData={fetchData}/>
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
}

