import http from "./axios.js";
import {AppBar, Toolbar} from '@material-ui/core'
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
          <Button className={classes.buttonmargin}><Link to="/gotasks/dashboard" className={classes.linkcol}>DASHBOARD</Link></Button>
          <Button className={classes.buttoncol} onClick={handleOpen}>+ Add New</Button>
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

  const listDetails = (proj_id, list_id) => {
    // return (
    // <Redirect to={{pathname: `/gotasks/projects/${id}`}} />
    // )
    console.log("hello");
    window.location.href=`http://localhost:3000/gotasks/projects/${proj_id}/lists/${list_id}`
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

  return(
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
  )
}