import { useParams } from "react-router"
import http from './axios.js'
import { useState, useEffect } from "react"
import { Button } from "@material-ui/core"
import useStyles from '../styles/Navbar.js'
import {AppBar, Toolbar, Grid} from '@material-ui/core'
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box'
import { Link } from 'react-router-dom'
import useLoginStyles from "../styles/LoginStyles.js"
import { DeleteList } from "./DeleteList.js"


const Navbar = () => {

  const classes = useStyles()

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            LISTS
          </Typography>
          <div>
          <Button className={classes.buttonmargin}><Link to="/gotasks/dashboard" className={classes.linkcol}>DASHBOARD</Link></Button>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}


export const ProjectListDetails = () => {

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const classes = useLoginStyles()
  const { proj_id, list_id } = useParams()
  const [item, setItem] = useState([])

  const fetchList = (proj_id, list_id) => {
    http.get(`/gotasks/projects/${proj_id}/lists/${list_id}`)
    .then(res => {
      // console.log(id)
      console.log(res.data)
      setItem(res.data)
    }).catch(err=>{
      console.log(err)
    })
  }

  const listDetails = (proj_id, list_id) => {
    window.location.href=`http://localhost:3000/gotasks/projects/${proj_id}/lists/${list_id}/cards/`
  }

  useEffect(() => {
    fetchList(proj_id, list_id)
  }, [])

  return(
    <div>
      <Navbar />
      <Grid item xs={12} sm={12} md={12} className={classes.divMargin}>
          <Grid item xs={11} sm={11} md={11} elevation={11} square className={classes.signupsubdiv2}>
            <div className={classes.displayer}>
              <Typography component="h1" variant="h4" gutterBottom >
                List Name: {item.list_name}
              </Typography>
              <Typography component="h1" variant="h6" gutterBottom>
                Project: {item.project}
              </Typography>
              <Typography component="h1" variant="h6" gutterBottom>
                Created <i class="fas fa-dice-one    "></i>: {item.list_created}
              </Typography>
              <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit} onClick={(e)=>{listDetails(proj_id, list_id)}} > Details
              </Button>   
              <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit} > Update
              </Button>  
              <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit} onClick={handleOpen}> Delete
              </Button>  
              <DeleteList open={open} handleClose={handleClose} />
            </div>
          </Grid>
          </Grid>
    </div>
  )
}