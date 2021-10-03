import { useParams } from "react-router"
import http from './axios.js'
import axios from 'axios'
import { useHistory } from "react-router-dom"
import Cookies from "js-cookie"
import { useState, useEffect } from "react"
import { Button } from "@material-ui/core"
import useStyles from '../styles/Navbar.js'
import {AppBar, Toolbar, Tabs, Tab, Grid} from '@material-ui/core'
import HomeIcon from '@material-ui/icons/Home';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box'
import { Link } from 'react-router-dom'
import useLoginStyles from "../styles/LoginStyles.js"
import useCardStyles from "../styles/DashboardCard.js"
import { DeleteCard } from "./DeleteCard.js"


const Navbar = () => {

  const classes = useStyles()

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            CARDS
          </Typography>
          <div>
          <Button className={classes.buttonmargin} startIcon={<HomeIcon />} disableElevation><Link to="/gotasks/dashboard" className={classes.linkcol}>DASHBOARD</Link></Button>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}


export const ListCardDetails = () => {

  const [open, setOpen] = useState(false);
  const classescard = useCardStyles()
  const history = useHistory()

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const classes = useLoginStyles()
  const { proj_id, list_id, card_id } = useParams()
  const [item, setItem] = useState([])

  const fetchCard = (proj_id, list_id, card_id) => {
    http.get(`/gotasks/projects/${proj_id}/lists/${list_id}/cards/${card_id}`)
    .then(res => {
      setItem(res.data)
    }).catch(err=>{
      console.log(err)
    })
  }

  useEffect(async() => {
    fetchCard(proj_id, list_id, card_id)
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
      <Navbar />
      <Grid item xs={12} sm={12} md={12} className={classes.divMargin}>
          <Grid item xs={11} sm={11} md={11} elevation={11} square className={classes.signupsubdiv2}>
            <div className={classes.displayer}>
              <Typography component="h1" variant="h4" gutterBottom >
                Card Name: {item.card_name}
              </Typography>
              <Typography component="h1" variant="h6" gutterBottom>
                Description: {item.description}
              </Typography>
              <Typography component="h1" variant="h6" gutterBottom>
                Assigned To: {item.assigned}
              </Typography>
              <Typography component="h1" variant="h6" gutterBottom>
                Created on: {item.date_created}
              </Typography>
              <Typography component="h1" variant="h6" gutterBottom>
                Due date: {item.due_date}
              </Typography>
              <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit} > Update
              </Button>  
              <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit} onClick={handleOpen}> Delete
              </Button>  
              <DeleteCard open={open} handleClose={handleClose} />
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