import { useParams } from "react-router"
import http from './axios.js'
import moment from "moment"
import { useHistory } from "react-router-dom"
import { useState, useEffect } from "react"
import { Button } from "@material-ui/core"
import useStyles from '../styles/Navbar.js'
import {AppBar, Toolbar, Grid} from '@material-ui/core'
import HomeIcon from '@material-ui/icons/Home';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box'
import { Link } from 'react-router-dom'
import useLoginStyles from "../styles/LoginStyles.js"
import useCardStyles from "../styles/DashboardCard.js"
import { DeleteCard } from "./DeleteCard.js"
import { EditCard } from "./EditCard";
import { Loading } from "./Loading.js"


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


export const ListCardDetails = (props) => {

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


  const [updateopen, setUpdateOpen] = useState(false);

  const handleUpdateOpen = () => {
    setUpdateOpen(true);
  };

  const handleUpdateClose = () => {
    fetchCard(proj_id, list_id, card_id);
    setUpdateOpen(false);
  };

  const [fetched, setFetched] = useState(false)


  const fetchCard = (proj_id, list_id, card_id) => {
    http.get(`/gotasks/projects/${proj_id}/lists/${list_id}/cards/${card_id}`)
    .then(res => {
      setItem(res.data)
      setFetched(true)
    }).catch(err=>{
      console.log(err)
    })
  }

  useEffect(async() => {
    if(!props.loginStatus){
      history.push("/");
    }
    fetchCard(proj_id, list_id, card_id)
  }, [])



  if(!fetched === true){
    return(
      <>
        <Navbar />
        <Loading />
      </>
    )
  }
  else{
    return(
      <>
      <div>
        <Navbar />
        <Grid item xs={12} sm={12} md={12} className={classes.divMargin}>
            <Grid item xs={11} sm={11} md={11} elevation={11} className={classes.signupsubdiv2}>
              <div className={classes.displayer}>
                <Typography component="h1" variant="h4" gutterBottom >
                <strong>Card Name:</strong> {item.card_name}
                </Typography>
                <Typography component="h1" variant="h6" gutterBottom>
                  <strong>Description:</strong> {item.description}
                </Typography>
                <Typography component="h1" variant="h6" gutterBottom>
                  <strong>Assigned To:</strong> {item.assigned}
                </Typography>
                <Typography component="h1" variant="h6" gutterBottom>
                  <strong>Created on:</strong> {moment(item.date_created).format("dddd, MMMM Do YYYY, h:mm:ss a")}
                </Typography>
                <Typography component="h1" variant="h6" gutterBottom>
                  <strong>Due date:</strong> {moment(item.due_date).format("dddd, MMMM Do YYYY, h:mm:ss a")}
                </Typography>
                <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit} onClick={handleUpdateOpen}> Update
                </Button>  
                <EditCard updateopen={updateopen} handleUpdateClose={handleUpdateClose}/>
                <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit} onClick={handleOpen}> Delete
                </Button>  
                <DeleteCard open={open} handleClose={handleClose} />
              </div>
            </Grid>
            </Grid>
      </div>
      </>
    )
  }
}