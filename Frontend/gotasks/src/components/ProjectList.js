import http from "./axios.js";
import axios from 'axios'
import Cookies from "js-cookie";
import {AppBar, Toolbar} from '@material-ui/core'
import useStyles from '../styles/Navbar.js'
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box'
import Card from "@material-ui/core/Card";
import Avatar from '@material-ui/core/Avatar';
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
import Checkbox from '@material-ui/core/Checkbox'
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";


const Navbar = (props) => {

  const classes = useStyles()
  const [open, setOpen] = useState(false);
  const [opendrawer, setOpendrawer] = useState(false);
  const history = useHistory()

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = async() => {
    // function call via props to handle the simultaneous frontend addition of lists
    await props.fetchList();
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
            LISTS
          </Typography>
          <Hidden smDown>
          <div>
          <Button className={classes.buttonmargin} startIcon={<HomeIcon />} disableElevation><Link to="/gotasks/dashboard" className={classes.linkcol}>DASHBOARD</Link></Button>
          <Button className={classes.buttonmargin} startIcon={<WorkIcon />} disableElevation><Link to="/gotasks/projects" className={classes.linkcol}>Projects</Link></Button>
          <Button className={classes.buttonmargin} onClick={handleOpen} startIcon={<AddBoxIcon />} disableElevation>Add List</Button>
          <AddList getlists={props.lists} setGetlists={props.setLists} fetchList={props.fetchList} open={open} handleClose={handleClose} />
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
            <Button className={classes.buttonmargin} onClick={handleOpen} startIcon={<AddBoxIcon />} disableElevation>Add List</Button>
            <AddList getlists={props.lists} setGetlists={props.setLists} fetchList={props.fetchList} open={open} handleClose={handleClose} />
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


export const ListItems = (props) => {

  const { proj_id } = useParams()

  const classes = useCardStyles()

  const history = useHistory();

  const listDetails = (proj_id, list_id) => {

    history.push(`/gotasks/projects/${proj_id}/lists/${list_id}`);

  }

  return(
    <Card sx={{ minWidth: 275 }} variant="outlined" className={classes.cardattr}>
        <CardContent>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          <div>
          <Typography variant="h5" component="div">
          <strong>Name:</strong> {props.list.list_name}
          </Typography>
          </div>
          <div>
          <Avatar className={classes.avatar}>{props.list.list_name.charAt(0).toUpperCase()}</Avatar>
          </div>
        </div>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            <strong>Project:</strong> {props.list.project}
          </Typography>
          <Typography variant="body1" gutterBottom>
          <strong>Created on:</strong> {moment(props.list.list_created).format("dddd, MMMM Do YYYY, h:mm:ss a")}
          </Typography>
          <Typography variant="body2" gutterBottom style={{display: "flex", justifyContent: "flex-start", alignItems: "center"}}>
            <strong>Completion Status:</strong> {props.list.is_completed ? 
            <Checkbox
              checked={true}
              style={{paddingTop: "0px", paddingBottom: "0px", color: "#3f51b5"}}
              inputProps={{ 'aria-label': 'controlled' }}
            /> : 
            <CancelRoundedIcon style={{color: "#3f51b5", marginLeft: "8px"}}/>
          }
          </Typography>
        </CardContent>
        <CardActions className={classes.cardActions}>
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
  const searcher = useSearchStyles();
  const [q, setQ] = useState("");
  const [searchParam] = useState(["list_name"]);

  const fetchList = async() => {
    await http.get(`/gotasks/projects/${proj_id}/lists/`)
    .then(res => {
      // console.log(res.data)
      setLists(res.data)
      setFetched(true)
    }).catch(err=>{
      console.log(err)
    })
  }

  const [loggedin, setLoggedin] = useState(false)
  const checkLoginStatus = async() => {
    await axios.get("http://127.0.0.1:8000/gotasks/login_check/", {withCredentials:true})
    .then(response => {
      console.log(response)
      if (response.data.loggedin === true && loggedin === false){
        setLoggedin(true)
      }
      else if (response.data.loggedin === false && loggedin === false){
        setLoggedin(false)
        history.push("/")
      }
      else{
        setLoggedin(false);
        history.push("/")
      }
    }).catch(error => {
      console.log("login check failed, try again", error)
    })
  }


  useEffect(async() => {
    await checkLoginStatus();
    await fetchList();
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
        <div className={searcher.search} style={{backgroundColor: "white"}}>
          <SearchIcon />
          <input
          type="search"
          autocomplete="off"
          list="data"
          name="search-form"
          id="search-form"
          style={{flexGrow: "1", border: "none", outline: "none", height: "100%", borderRadius: "5px", fontSize: "16px"}}
          className="search-input"
          placeholder="Search lists by name..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
            <datalist id="data">
              {lists.map((item, key) =>
                <option key={key} value={item.list_name} />
              )}
            </datalist>
        </div>
        <br />
        {search(lists).map(list => {
        return (
        <>
        <ListItems key={list.id} list={list} />
        </>
        )
      })}
      </div>
      </>
    )
  }
}