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
import { useParams } from "react-router"
import useCardStyles from '../styles/DashboardCard'
import { Redirect } from 'react-router-dom';
import { AddProject } from './AddProject.js';


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
            CARDS
          </Typography>
          <div>
          <Button className={classes.buttonmargin}><Link to="/gotasks/dashboard" className={classes.linkcol}>DASHBOARD</Link></Button>
          <Button className={classes.buttoncol} onClick={handleOpen}>+ Add New</Button>
          <AddProject open={open} handleClose={handleClose} />
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}


export const CardItem = (props) => {

  const { proj_id, list_id } = useParams()
  const classes = useCardStyles()

  const cardDetails = (proj_id, list_id, card_id) => {
    // return (
    // <Redirect to={{pathname: `/gotasks/projects/${id}`}} />
    // )
    // console.log(props.card)
    window.location.href=`http://localhost:3000/gotasks/projects/${proj_id}/lists/${list_id}/cards/${card_id}`
  }

  return(
    <Card sx={{ minWidth: 275 }} variant="outlined" className={classes.cardattr}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            Name: {props.card.card_name}
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Description: {props.card.description}
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Assigned To: {props.card.assigned}
          </Typography>
          <Typography variant="body2" gutterBottom>
            Created on: {props.card.date_created}
          </Typography>
          <Typography variant="body2" gutterBottom>
            Due Date: {props.card.due_date}
          </Typography>
        </CardContent>
        <CardActions>
            <Button size="small" variant="contained" color="primary" onClick={(e)=>{
              e.preventDefault(); 
              cardDetails(proj_id, list_id, props.card.id)}}>Details</Button>
        </CardActions>
    </Card>
  )

}



export const ListCard = () => {

  const { proj_id, list_id } = useParams()
  const [cards, setCards] = useState([])

  const fetchCard = (proj_id, list_id) => {
    http.get(`/gotasks/projects/${proj_id}/lists/${list_id}/cards`)
    .then(res => {
      console.log(res.data)
      setCards(res.data)
    }).catch(err=>{
      console.log(err)
    })
  }

  useEffect(() => {
    fetchCard(proj_id, list_id)
  }, [])

  return(
    <div>
      <Navbar />
      {cards.map(card => {
      return (
      <>
      <CardItem key={card.id} card={card} />
      </>
      )
    })}
    </div>
  )

}