import { useParams } from "react-router"
import http from './axios.js'
import axios from 'axios';
import Cookies from "js-cookie";
import { useState, useEffect } from "react"
import { Button, Grid, Box, Typography, AppBar, Toolbar } from "@material-ui/core"
import useStyles from '../styles/Navbar.js'
import HomeIcon from '@material-ui/icons/Home';
import moment from "moment";
import { Link } from 'react-router-dom'
import useLoginStyles from "../styles/LoginStyles.js"
import { DeleteProject } from "./DeleteProject.js"
import { useHistory } from "react-router-dom"
import useCardStyles from "../styles/DashboardCard.js";
import "../styles/ListTags.css"


const Navbar = (props) => {

  const classes = useStyles()
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {props.name}
          </Typography>
          <div>
          <Button className={classes.buttonmargin} startIcon={<HomeIcon />} disableElevation><Link to="/gotasks/dashboard" className={classes.linkcol}>DASHBOARD</Link></Button>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}


export const ProjectDetails = () => {

  const [open, setOpen] = useState(false);
  const history = useHistory();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const classes = useLoginStyles()
  const classescard = useCardStyles();
  const { proj_id } = useParams()
  const [item, setItem] = useState([])
  const [proj_members, setProj_members] = useState([])

  const fetchList = (id) => {
    http.get(`/gotasks/projects/${id}`)
    .then(res => {
      // console.log(id)
      console.log(res.data)
      setItem(res.data)
      setProj_members(res.data.project_members)
    }).catch(err=>{
      console.log(err)
    })
  }

  const listDetails = (id) => {

    history.push(`/gotasks/projects/${id}/lists`);

  }

  useEffect(() => {
    fetchList(proj_id)
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
    <>
    <div>
      <Navbar name={item.project_name}/>
      <Grid item xs={12} sm={12} md={12} className={classes.divMargin}>
          <Grid item xs={11} sm={11} md={11} elevation={11} square className={classes.signupsubdiv2}>
            <div className={classes.displayer}>
              <Typography component="h1" variant="h4" gutterBottom>
                <strong>Name:</strong> {item.project_name}
              </Typography>
              <Typography component="h1" variant="h6" gutterBottom>
                <strong>Description:</strong>
              </Typography>
              <div>
              <Typography component="h1" variant="h6" gutterBottom dangerouslySetInnerHTML={{__html: item.project_wiki}}>
                
              </Typography>
              </div>
              <Typography component="h1" variant="h6" gutterBottom>
              <strong>Creator:</strong> {item.project_creator}
              </Typography>
              <Typography component="h1" variant="h6" gutterBottom>
              <strong>Members:</strong> {proj_members.map((member)=>{
                  return (
                    <li>
                    {member}
                    </li>
                  )
                })}
              </Typography>
              <Typography component="h1" variant="h6" gutterBottom>
              <strong>Created on:</strong> {moment(item.project_created).format("dddd, MMMM Do YYYY, h:mm:ss a")}
              </Typography>
              <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit} onClick={(e)=>{listDetails(proj_id)}} > Details
              </Button>   
              <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit} > Update
              </Button>  
              <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit} onClick={handleOpen}> Delete
              </Button>  
              <DeleteProject open={open} handleClose={handleClose} />
            </div>
          </Grid>
          </Grid>
    </div>
    <div className={classescard.logoutOutdiv}>
        <div className={classescard.logoutIndiv}>
            <Button className={classescard.buttonmargin} variant="outlined" style={{backgroundColor: '#12824C', color: '#FFFFFF'}} onClick={()=>{goback()}}>Back</Button>
            <Button className={classescard.buttonmargin} style={{backgroundColor: 'red', color: '#FFFFFF'}} onClick={()=>{loggingout()}}>Logout</Button>
        </div>
      </div>
    </>
  )

}