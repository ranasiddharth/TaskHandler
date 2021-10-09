import { useParams } from "react-router"
import http from './axios.js'
import axios from 'axios';
import Cookies from "js-cookie";
import { useState, useEffect } from "react"
import useStyles from '../styles/Navbar.js'
import {AppBar, Toolbar, Grid, Button, Typography, Box} from '@material-ui/core'
import HomeIcon from '@material-ui/icons/Home';
import { Link } from 'react-router-dom'
import useLoginStyles from "../styles/LoginStyles.js"
import { DeleteList } from "./DeleteList.js"
import { useHistory } from "react-router-dom"
import useCardStyles from "../styles/DashboardCard.js";
import moment from "moment";
import { EditList } from "./EditList.js";
import { Loading } from "./Loading.js";
import Header from "./Header.js";


// const Navbar = () => {

//   const classes = useStyles()

//   return (
//     <Box sx={{ flexGrow: 1 }}>
//       <AppBar position="static">
//         <Toolbar className={classes.toolbar}>
//           <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
//             LIST
//           </Typography>
//           <div>
//           <Button className={classes.buttonmargin} startIcon={<HomeIcon />} disableElevation><Link to="/gotasks/dashboard" className={classes.linkcol}>DASHBOARD</Link></Button>
//           </div>
//         </Toolbar>
//       </AppBar>
//     </Box>
//   );
// }


export const ProjectListDetails = (props) => {

  const history = useHistory();

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [updateopen, setUpdateOpen] = useState(false);

  const handleUpdateOpen = () => {
    setUpdateOpen(true);
  };

  const handleUpdateClose = () => {
    fetchList(proj_id, list_id);
    setUpdateOpen(false);
  };

  const classes = useLoginStyles()
  const classescard = useCardStyles()
  const [fetched, setFetched] = useState(false)
  const { proj_id, list_id } = useParams()
  const [item, setItem] = useState([])

  const fetchList = (proj_id, list_id) => {
    http.get(`/gotasks/projects/${proj_id}/lists/${list_id}`)
    .then(res => {
      // console.log(id)
      // console.log(res.data)
      setItem(res.data)
      setFetched(true)
    }).catch(err=>{
      console.log(err)
    })
  }

  const listDetails = (proj_id, list_id) => {

    history.push(`/gotasks/projects/${proj_id}/lists/${list_id}/cards/`)

  }

  useEffect(() => {
    if(!props.loginStatus){
      history.push("/");
    }
    fetchList(proj_id, list_id)
  }, [])


  if(!fetched === true){
    return(
      <>
        <Header />
        <Loading />
      </>
    )
  }
  else{
    return(
      <>
      <div>
        <Header />
        <Grid item xs={12} sm={12} md={12} className={classes.divMargin}>
            <Grid item xs={11} sm={11} md={11} elevation={11} className={classes.signupsubdiv2}>
              <div className={classes.displayer}>
                <Typography component="h1" variant="h4" gutterBottom >
                <strong>List Name:</strong> {item.list_name}
                </Typography>
                <Typography component="h1" variant="h6" gutterBottom>
                <strong>Project:</strong> {item.project}
                </Typography>
                <Typography component="h1" variant="h6" gutterBottom>
                <strong>Created:</strong> {moment(item.list_created).format("dddd, MMMM Do YYYY, h:mm:ss a")}
                </Typography>
                <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit} onClick={(e)=>{listDetails(proj_id, list_id)}} > Details
                </Button>   
                <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit} onClick={handleUpdateOpen}> Update
                </Button>  
                <EditList updateopen={updateopen} handleUpdateClose={handleUpdateClose}/>
                <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit} onClick={handleOpen}> Delete
                </Button>  
                <DeleteList open={open} handleClose={handleClose} />
              </div>
            </Grid>
            </Grid>
      </div>
      </>
    )
  }
}