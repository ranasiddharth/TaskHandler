import { useParams } from "react-router";
import http from "./axios.js";
import axios from "axios";
import { useState, useEffect } from "react";
import {
  Button,
  Grid,
  Typography,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import UpdateIcon from "@material-ui/icons/Update";
import ViewListIcon from "@material-ui/icons/ViewList";
import moment from "moment";
import { Link } from "react-router-dom";
import useLoginStyles from "../styles/LoginStyles.js";
import { EditProject } from "./EditProject.jsx";
import { DeleteProject } from "./DeleteProject.js";
import { useHistory } from "react-router-dom";
import useCardStyles from "../styles/DashboardCard.js";
import "../styles/ListTags.css";
import { Loading } from "./Loading.js";
import Header from "./Header.js";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

export const ProjectDetails = (props) => {
  const history = useHistory();
  const classes = useLoginStyles();
  const [fetched, setFetched] = useState(false);
  const { proj_id } = useParams();
  const [item, setItem] = useState([]);
  const [proj_members, setProj_members] = useState([]);
  const [members, setMembers] = useState([]);

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

  const fetchList = async (id) => {
    await http
      .get(`/gotasks/usershow/`)
      .then((res) => {
        setMembers(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    await http
      .get(`/gotasks/projects/${id}`)
      .then((res) => {
        setItem(res.data);
        setProj_members(res.data.project_members);
        setFetched(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [loggedin, setLoggedin] = useState(false);
  const checkLoginStatus = async () => {
    await axios
      .get("http://127.0.0.1:8000/gotasks/login_check/", {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.loggedin === true && loggedin === false) {
          setLoggedin(true);
        } else if (response.data.loggedin === false && loggedin === false) {
          setLoggedin(false);
          history.push("/");
        } else {
          setLoggedin(false);
          history.push("/");
        }
      })
      .catch((error) => {
        console.log("login check failed, try again", error);
      });
  };

  const listDetails = (id) => {
    history.push(`/gotasks/projects/${id}/lists`);
  };

  const breadcrumbs = [
    <Link
      style={{
        textDecoration: "none",
        color: document.getElementsByTagName('body')[0].style.backgroundColor == "black" ? "#b3b2b2":"#3f51b5",
        fontSize: "20px",
        marginLeft: "0px!important",
        fontWeight: "bold",
      }}
      key="1"
      color="inherit"
      to="/gotasks/dashboard"
    >
      Gotasks
    </Link>,
    <Link
      style={{
        textDecoration: "none",
        color: document.getElementsByTagName('body')[0].style.backgroundColor == "black" ? "#b3b2b2":"#3f51b5",
        fontSize: "20px",
        marginLeft: "0px!important",
        fontWeight: "bold",
      }}
      key="2"
      color="inherit"
      to={{ pathname: `/gotasks/projects/${proj_id}/` }}
    >
      {item.project_name}
    </Link>,
  ];

  useEffect(async () => {
    await checkLoginStatus();
    await fetchList(proj_id);
  }, []);

  if (!fetched === true) {
    return (
      <>
        <Header />
        <Loading />
      </>
    );
  } else {
    return (
      <>
        <div>
          <Header />
          <div style={{ width: "91.6667%", margin: "auto", marginTop: "20px" }}>
            <Breadcrumbs
              separator={
                <NavigateNextIcon
                  fontSize="small"
                  style={{
                    color:
                      document.getElementsByTagName("body")[0].style
                        .backgroundCol == "black"
                        ? "#b3b2b2"
                        : "grey",
                  }}
                />
              }
              aria-label="breadcrumb"
            >
              {breadcrumbs}
            </Breadcrumbs>
          </div>
          <Grid item xs={12} sm={12} md={12} className={classes.divMargin}>
            <Grid
              item
              xs={11}
              sm={11}
              md={11}
              elevation={11}
              className={classes.signupsubdiv2}
              style={{
                backgroundColor:
                  document.getElementsByTagName("body")[0].style
                    .backgroundColor == "black"
                    ? "#b3b2b2"
                    : classes.signupsubdiv2.backgroundColor,
              }}
            >
              <div className={classes.displayer}>
                <Typography component="h1" variant="h5" gutterBottom>
                  <strong>Name:</strong> {item.project_name}
                </Typography>
                <Typography component="h1" variant="h6" gutterBottom>
                  <strong>Description:</strong>
                </Typography>
                <div>
                  <Typography
                    component="h1"
                    variant="h6"
                    gutterBottom
                    dangerouslySetInnerHTML={{ __html: item.project_wiki }}
                  ></Typography>
                </div>
                <Typography component="h1" variant="h6" gutterBottom>
                  <strong>Creator:</strong> {item.project_creator}
                </Typography>
                <Typography component="h1" variant="h6" gutterBottom>
                  <strong>Members:</strong>{" "}
                  {proj_members.map((member) => {
                    return members.map((users, index) => {
                      if (users.id == member) {
                        return <li>{users.fullname}</li>;
                      }
                    });
                  })}
                </Typography>
                <Typography component="h1" variant="h6" gutterBottom>
                  <strong>Created on:</strong>{" "}
                  {moment(item.project_created).format(
                    "dddd, MMMM Do YYYY, h:mm:ss a"
                  )}
                </Typography>
                <div className={classes.buttonsdiv}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<ViewListIcon />}
                    className={classes.submit}
                    onClick={(e) => {
                      listDetails(proj_id);
                    }}
                  >
                    {" "}
                    Lists
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<UpdateIcon />}
                    className={classes.submit}
                    onClick={handleUpdateOpen}
                  >
                    {" "}
                    Update
                  </Button>
                  <EditProject
                    updateopen={updateopen}
                    handleUpdateClose={handleUpdateClose}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<DeleteIcon />}
                    className={classes.submit}
                    onClick={handleOpen}
                    style={{ color: "white", backgroundColor: "#D70040" }}
                  >
                    {" "}
                    Delete
                  </Button>
                  <DeleteProject open={open} handleClose={handleClose} />
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      </>
    );
  }
};
