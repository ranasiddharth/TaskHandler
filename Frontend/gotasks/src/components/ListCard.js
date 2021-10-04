import Cookies from "js-cookie";
import http from "./axios.js";
import axios from 'axios'
import {AppBar, Toolbar, Tabs, Tab} from '@material-ui/core'
import useStyles from '../styles/Navbar.js'
import moment from "moment";
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
import { useParams } from "react-router"
import useCardStyles from '../styles/DashboardCard'
import { useHistory } from 'react-router-dom';
import { AddCard } from './AddCard.js';


const Navbar = (props) => {

  const classes = useStyles()
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    // function call via props to handle the simultaneous frontend addition of cards
    props.fetchCard();
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
          <Button className={classes.buttonmargin} startIcon={<HomeIcon />} disableElevation><Link to="/gotasks/dashboard" className={classes.linkcol}>DASHBOARD</Link></Button>
          <Button className={classes.buttoncol} onClick={handleOpen} startIcon={<AddBoxIcon />} disableElevation>Add New</Button>
          <AddCard getcards={props.cards} setGetcards={props.setCards} open={open} handleClose={handleClose} />
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}


export const CardItem = (props) => {

  const { proj_id, list_id } = useParams()

  const classes = useCardStyles()

  const history = useHistory();

  const cardDetails = (proj_id, list_id, card_id) => {

    history.push(`/gotasks/projects/${proj_id}/lists/${list_id}/cards/${card_id}`);

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
            Created on: {moment(props.card.date_created).format("dddd, MMMM Do YYYY, h:mm:ss a")}
          </Typography>
          <Typography variant="body2" gutterBottom>
            Due Date: {moment(props.card.due_date).format("dddd, MMMM Do YYYY, h:mm:ss a")}
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
  const classes = useCardStyles()
  const history = useHistory()

  const fetchCard = () => {
    http.get(`/gotasks/projects/${proj_id}/lists/${list_id}/cards`)
    .then(res => {
      console.log(res.data)
      setCards(res.data)
    }).catch(err=>{
      console.log(err)
    })
  }

  useEffect(() => {
    fetchCard()
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
      <Navbar cards={cards} setCards={setCards} fetchCard={fetchCard}/>
      {/* {cards.length===0 ? "No cards to display" : */}
      {cards.map(card => {
      return (
      <>
      <CardItem key={card.id} card={card} />
      </>
      )
    })}
  {/* } */}
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