import { useParams } from "react-router"
import http from './axios.js'
import axios from 'axios';
import Cookies from "js-cookie";
import { useState, useEffect } from "react"
import { Button, Grid, Box, Typography, AppBar, Toolbar } from "@material-ui/core"
import useStyles from '../styles/Navbar.js'
import HomeIcon from '@material-ui/icons/Home';
import DeleteIcon from '@material-ui/icons/Delete';
import UpdateIcon from '@material-ui/icons/Update';
import ViewListIcon from '@material-ui/icons/ViewList';
import moment from "moment";
import { Link } from 'react-router-dom'
import useLoginStyles from "../styles/LoginStyles.js"
import { EditProject } from "./EditProject.jsx";
import { DeleteProject } from "./DeleteProject.js"
import { useHistory } from "react-router-dom"
import useCardStyles from "../styles/DashboardCard.js";
import "../styles/ListTags.css"
import { Loading } from "./Loading.js";
import Header from "./Header.js";


// const Navbar = () => {

//   const classes = useStyles()
  
//   return (
//     <Box sx={{ flexGrow: 1 }}>
//       <AppBar position="static">
//         <Toolbar className={classes.toolbar}>
//           <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
//             PROJECT
//           </Typography>
//           <div>
//           <Button className={classes.buttonmargin} startIcon={<HomeIcon />} disableElevation><Link to="/gotasks/dashboard" className={classes.linkcol}>DASHBOARD</Link></Button>
//           </div>
//         </Toolbar>
//       </AppBar>
//     </Box>
//   );
// }


export const ProjectDetails = (props) => {

  const history = useHistory();
  const classes = useLoginStyles()
  const [fetched, setFetched] = useState(false);
  const classescard = useCardStyles();
  const { proj_id } = useParams()
  const [item, setItem] = useState([])
  const [proj_members, setProj_members] = useState([])
  const [members, setMembers] = useState([])

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
    fetchList(proj_id);
    setUpdateOpen(false);
  };


  const fetchList = (id) => {
    http.get(`/gotasks/usershow/`).then(
      (res) => {
        console.log(res.data)
        setMembers(res.data)
      }).catch(err => {
        console.log(err)
    });

    http.get(`/gotasks/projects/${id}`)
    .then(res => {
      // console.log(id)
      console.log(res.data)
      setItem(res.data)
      setProj_members(res.data.project_members)
      setFetched(true)
    }).catch(err=>{
      console.log(err)
    })
  }

  const listDetails = (id) => {

    history.push(`/gotasks/projects/${id}/lists`);

  }

  useEffect(() => {
    if(!props.loginStatus){
      history.push("/");
    }
    fetchList(proj_id)
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
                <Typography component="h1" variant="h4" gutterBottom>
                  <strong>Name:</strong> {item.project_name}
                </Typography>
                <Typography component="h1" variant="h6" gutterBottom>
                  <strong>Description:</strong>
                </Typography>
                <div>
                <Typography component="h1" variant="h6" gutterBottom dangerouslySetInnerHTML={{__html: item.project_wiki}}>
                  
                </Typography>
                </div>
                <Typography component="h1" variant="h6" gutterBottom>
                <strong>Creator:</strong> {item.project_creator}
                </Typography>
                <Typography component="h1" variant="h6" gutterBottom>
                <strong>Members:</strong> {proj_members.map((member)=>{
                  return (
                    members.map((users, index) => {
                      if(users.id==member){
                        return(
                        <li>
                          {users.fullname}
                        </li>
                        )
                      }
                    })
                  )
                  })}
                </Typography>
                <Typography component="h1" variant="h6" gutterBottom>
                <strong>Created on:</strong> {moment(item.project_created).format("dddd, MMMM Do YYYY, h:mm:ss a")}
                </Typography>
                <div className={classes.buttonsdiv}>
                <Button type="submit" variant="contained" color="primary" startIcon={<ViewListIcon />} className={classes.submit} onClick={(e)=>{listDetails(proj_id)}} > Lists
                </Button>   
                <Button type="submit" variant="contained" color="primary" startIcon={<UpdateIcon />} className={classes.submit} onClick={handleUpdateOpen} > Update
                </Button>  
                <EditProject updateopen={updateopen} handleUpdateClose={handleUpdateClose}/>
                <Button type="submit" variant="contained" startIcon={<DeleteIcon />} className={classes.submit} onClick={handleOpen} style={{color: "white", backgroundColor: "#D70040"}}> Delete
                </Button>  
                <DeleteProject open={open} handleClose={handleClose} />
                </div>
              </div>
            </Grid>
            </Grid>
      </div>
      </>
    )
  }
}