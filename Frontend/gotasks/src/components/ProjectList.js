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
import moment from "moment";
import { Loading } from "./Loading.js";


const Navbar = (props) => {

  const classes = useStyles()
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = async() => {
    // function call via props to handle the simultaneous frontend addition of lists
    await props.fetchList();
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
          <AddList getlists={props.lists} setGetlists={props.setLists} fetchList={props.fetchList} open={open} handleClose={handleClose} />
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
          <strong>Name:</strong> {props.list.list_name}
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            <strong>Project:</strong> {props.list.project}
          </Typography>
          <Typography variant="body1" gutterBottom>
          <strong>Created on:</strong> {moment(props.list.list_created).format("dddd, MMMM Do YYYY, h:mm:ss a")}
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



export const ProjectList = (props) => {

  const { proj_id } = useParams()
  const classes = useCardStyles()
  const [fetched, setFetched] = useState(false)
  const history = useHistory()
  const [lists, setLists] = useState([])

  const fetchList = async() => {
    http.get(`/gotasks/projects/${proj_id}/lists/`)
    .then(res => {
      // console.log(res.data)
      setLists(res.data)
      setFetched(true)
    }).catch(err=>{
      console.log(err)
    })
  }

  useEffect(() => {
    if(!props.loginStatus){
      history.push("/");
    }
    fetchList()
  }, [])


  if(!fetched === true){
    return(
      <>
        <Navbar lists={lists} setLists={setLists} fetchList={fetchList}/>
        <Loading />
      </>
    )
  }
  else{
    return(
      <>
      <div>
        <Navbar lists={lists} setLists={setLists} fetchList={fetchList}/>
        {lists.map(list => {
        return (
        <>
        <ListItem key={list.id} list={list} />
        </>
        )
      })}
      </div>
      </>
    )
  }
}