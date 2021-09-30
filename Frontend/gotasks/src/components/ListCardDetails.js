import { useParams } from "react-router"
import http from './axios.js'
import { useState, useEffect } from "react"
import { Button } from "@material-ui/core"
import useStyles from '../styles/Navbar.js'
import {AppBar, Toolbar, Tabs, Tab, Grid} from '@material-ui/core'
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box'
import { Link } from 'react-router-dom'
import { ProjectDialog } from './ProjectDialog.js'
import useLoginStyles from "../styles/LoginStyles.js"


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
          <Button className={classes.buttonmargin}><Link to="/gotasks/dashboard" className={classes.linkcol}>DASHBOARD</Link></Button>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}


export const ListCardDetails = () => {

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

  return(
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
              <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit} > Delete
              </Button>  
            </div>
          </Grid>
          </Grid>
    </div>
  )

}