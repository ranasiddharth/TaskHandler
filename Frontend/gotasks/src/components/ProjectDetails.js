import { useParams } from "react-router"
import http from './axios.js'
import { useState, useEffect } from "react"
import { Button, Grid } from "@material-ui/core"
import useStyles from '../styles/Navbar.js'
import {AppBar, Toolbar} from '@material-ui/core'
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box'
import { Link } from 'react-router-dom'
import useLoginStyles from "../styles/LoginStyles.js"
import { DeleteProject } from "./DeleteProject.js"


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
          <Button className={classes.buttonmargin}><Link to="/gotasks/dashboard" className={classes.linkcol}>DASHBOARD</Link></Button>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}


export const ProjectDetails = () => {

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const classes = useLoginStyles()
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
    window.location.href=`http://localhost:3000/gotasks/projects/${id}/lists`
  }

  useEffect(() => {
    fetchList(proj_id)
  }, [])

  return(
    <div>
      <Navbar name={item.project_name}/>
      <Grid item xs={12} sm={12} md={12} className={classes.divMargin}>
          <Grid item xs={11} sm={11} md={11} elevation={11} square className={classes.signupsubdiv2}>
            <div className={classes.displayer}>
              <Typography component="h1" variant="h4" gutterBottom >
                Project Name: {item.project_name}
              </Typography>
              <Typography component="h1" variant="h6" gutterBottom>
                Description: {item.project_wiki}
              </Typography>
              <Typography component="h1" variant="h6" gutterBottom>
                Creator: {item.project_creator}
              </Typography>
              <Typography component="h1" variant="h6" gutterBottom>
                Members: {proj_members.map((member)=>{
                  return (
                    <li>
                    {member}
                    </li>
                  )
                })}
              </Typography>
              <Typography component="h1" variant="h6" gutterBottom>
                Created on: {item.project_created}
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
  )

}