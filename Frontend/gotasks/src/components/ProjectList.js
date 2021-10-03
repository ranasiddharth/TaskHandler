import http from "./axios.js";
import axios from 'axios'
import Cookies from "js-cookie";
import {AppBar, Toolbar} from '@material-ui/core'
import useStyles from '../styles/Navbar.js'
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box'
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from '@material-ui/core/CardActions';
import AddBoxIcon from '@material-ui/icons/AddBox';
import HomeIcon from '@material-ui/icons/Home';
import { Link } from 'react-router-dom'
import {useState, useEffect} from 'react';
import { useParams } from "react-router"
import useCardStyles from '../styles/DashboardCard'
import { useHistory } from "react-router-dom";
import { AddList } from './AddList.js';


const Navbar = (props) => {

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
            LISTS
          </Typography>
          <div>
          <Button className={classes.buttonmargin} startIcon={<HomeIcon />} disableElevation><Link to="/gotasks/dashboard" className={classes.linkcol}>DASHBOARD</Link></Button>
          <Button className={classes.buttoncol} onClick={handleOpen} startIcon={<AddBoxIcon />} disableElevation>Add New</Button>
          <AddList getlists={props.lists} setGetlists={props.setLists} open={open} handleClose={handleClose} />
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}


export const ListItem = (props) => {

  const { proj_id } = useParams()

  const classes = useCardStyles()

  const history = useHistory();

  const listDetails = (proj_id, list_id) => {

    history.push(`/gotasks/projects/${proj_id}/lists/${list_id}`);

  }

  return(
    <Card sx={{ minWidth: 275 }} variant="outlined" className={classes.cardattr}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            Name: {props.list.list_name}
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Project: {props.list.project}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Created on: {props.list.list_created}
          </Typography>
        </CardContent>
        <CardActions>
            <Button size="small" variant="contained" color="primary" onClick={(e)=>{
              e.preventDefault(); 
              listDetails(proj_id, props.list.id)}}>Details</Button>
        </CardActions>
    </Card>
  )

}



export const ProjectList = () => {

  const { proj_id } = useParams()
  const classes = useCardStyles()
  const history = useHistory()
  const [lists, setLists] = useState([])

  const fetchList = (id) => {
    http.get(`/gotasks/projects/${id}/lists/`)
    .then(res => {
      console.log(res.data)
      setLists(res.data)
    }).catch(err=>{
      console.log(err)
    })
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
      <Navbar lists={lists} setLists={setLists}/>
      {lists.map(list => {
      return (
      <>
      <ListItem key={list.id} list={list} />
      </>
      )
    })}
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