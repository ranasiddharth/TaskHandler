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
import Avatar from '@material-ui/core/Avatar';
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
import WorkIcon from '@material-ui/icons/Work';
import SearchIcon from "@material-ui/icons/Search"
import useSearchStyles from "../styles/SearchBar.js";


const Navbar = (props) => {

  const classes = useStyles()
  const [open, setOpen] = useState(false);
  const [opendrawer, setOpendrawer] = useState(false);
  const history = useHistory()

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    // function call via props to handle the simultaneous frontend addition of cards
    props.fetchCard();
    setOpendrawer(false);
    setOpen(false);
  };

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
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            CARDS
          </Typography>
          <Hidden smDown>
          <div>
          <Button className={classes.buttonmargin} startIcon={<HomeIcon />} disableElevation><Link to="/gotasks/dashboard" className={classes.linkcol}>DASHBOARD</Link></Button>
          <Button className={classes.buttonmargin} startIcon={<WorkIcon />} disableElevation><Link to="/gotasks/projects" className={classes.linkcol}>Projects</Link></Button>
          <Button className={classes.buttonmargin} onClick={handleOpen} startIcon={<AddBoxIcon />} disableElevation>Add Card</Button>
          <AddCard getcards={props.cards} setGetcards={props.setCards} open={open} handleClose={handleClose} />
          <Button className={classes.buttoncol} startIcon={<LogoutIcon />} onClick={()=>{loggingout()}}disableElevation>Logout</Button>
          </div>
          </Hidden >
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
            <Button className={classes.buttonmargin} startIcon={<WorkIcon />} disableElevation><Link to="/gotasks/projects" className={classes.linkcol}>Projects</Link></Button>
          </ListItem>
          <ListItem className={classes.phonelistitems}>
            <Button className={classes.buttonmargin} onClick={handleOpen} startIcon={<AddBoxIcon />} disableElevation>Add Card</Button>
            <AddCard getcards={props.cards} setGetcards={props.setCards} open={open} handleClose={handleClose} />
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
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          <div>
          <Typography variant="h5" component="div">
          <strong>Name:</strong> {props.card.card_name}
          </Typography>
          </div>
          <div>
          <Avatar className={classes.avatar}>{props.card.card_name.charAt(0).toUpperCase()}</Avatar>
          </div>
        </div>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          <strong>Description:</strong> {props.card.description}
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          <strong>Assigned To:</strong> {props.users.map((user, index) => {
                  if(user.id==props.card.assigned){
                    return(
                      user.fullname
                    )
                  }
            })}
          </Typography>
          <Typography variant="body2" gutterBottom>
          <strong>Created on:</strong> {moment(props.card.date_created).format("dddd, MMMM Do YYYY, h:mm:ss a")}
          </Typography>
          <Typography variant="body2" gutterBottom>
          <strong>Due Date:</strong> {moment(props.card.due_date).format("dddd, MMMM Do YYYY, h:mm:ss a")}
          </Typography>
        </CardContent>
        <CardActions className={classes.cardActions}>
            <Button size="small" variant="contained" color="primary" onClick={(e)=>{
              e.preventDefault(); 
              cardDetails(proj_id, list_id, props.card.id)}}>Details</Button>
        </CardActions>
    </Card>
  )

}



export const ListCard = (props) => {

  const { proj_id, list_id } = useParams()
  const [cards, setCards] = useState([])
  const [fetched, setFetched] = useState(false)
  const [users, setUsers] = useState([])
  const classes = useCardStyles()
  const history = useHistory()
  const searcher = useSearchStyles();
  const [q, setQ] = useState("");
  const [searchParam] = useState(["card_name"]);

  const fetchCard = () => {

    http.get(`/gotasks/usershow/`).then(
      (res) => {
        console.log(res.data)
        setUsers(res.data)
      }).catch(err => {
        console.log(err)
    });


    http.get(`/gotasks/projects/${proj_id}/lists/${list_id}/cards`)
    .then(res => {
      // console.log(res.data)
      setCards(res.data)
      setFetched(true)
    }).catch(err=>{
      console.log(err)
    })
  }

  useEffect(() => {
    if(!props.loginStatus){
      history.push("/");
    }
    fetchCard()
  }, [])


  function search(items) {
    return items.filter((item) => {
        return searchParam.some((newItem) => {
            return (
                item[newItem]
                    .toString()
                    .toLowerCase()
                    .indexOf(q.toLowerCase()) > -1
            );
        });
    });
  }
  

  if(!fetched === true){
    return(
      <>
        <Navbar cards={cards} setCards={setCards} fetchCard={fetchCard}/>
        <Loading />
      </>
    )
  }
  else{
    return(
      <>
      <div>
        <Navbar cards={cards} setCards={setCards} fetchCard={fetchCard}/>
        <div className={searcher.search}>
          <SearchIcon />
          <input
          type="search"
          name="search-form"
          id="search-form"
          style={{flexGrow: "1", border: "none", outline: "none", height: "100%", borderRadius: "5px", fontSize: "16px"}}
          className="search-input"
          placeholder="Search cards by name..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <br/>
        {search(cards).map(card => {
        return (
        <>
        <CardItem key={card.id} card={card} users={users}/>
        </>
        )
      })}
      </div>
      </>
    )
  }
}