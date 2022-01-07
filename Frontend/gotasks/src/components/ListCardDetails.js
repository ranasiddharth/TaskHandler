import { useParams } from "react-router";
import http from "./axios.js";
import axios from "axios";
import moment from "moment";
import { useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import ViewListIcon from "@material-ui/icons/ViewList";
import { Grid } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import DeleteIcon from "@material-ui/icons/Delete";
import UpdateIcon from "@material-ui/icons/Update";
import useLoginStyles from "../styles/LoginStyles.js";
import useCardStyles from "../styles/DashboardCard.js";
import { DeleteCard } from "./DeleteCard.js";
import { EditCard } from "./EditCard";
import { Loading } from "./Loading.js";
import Header from "./Header.js";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

export const ListCardDetails = (props) => {
  const classescard = useCardStyles();
  const history = useHistory();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const classes = useLoginStyles();
  const { proj_id, list_id, card_id } = useParams();
  const [item, setItem] = useState([]);
  const [users, setUsers] = useState([]);
  const [projectname, setProjectname] = useState("");
  const [listname, setListname] = useState("");

  const [updateopen, setUpdateOpen] = useState(false);

  const handleUpdateOpen = () => {
    setUpdateOpen(true);
  };

  const handleUpdateClose = () => {
    fetchCard(proj_id, list_id, card_id);
    setUpdateOpen(false);
  };

  const goToComments = () => {
    history.push(
      `/gotasks/projects/${proj_id}/lists/${list_id}/cards/${card_id}/comments`
    );
  };

  const [fetched, setFetched] = useState(false);
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

  const fetchProjectName = async () => {
    await http
      .get(`/gotasks/projects/${proj_id}/`)
      .then((res) => {
        setProjectname(res.data.project_name);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchListName = async () => {
    await http
      .get(`/gotasks/projects/${proj_id}/lists/${list_id}`)
      .then((res) => {
        setListname(res.data.list_name);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchCard = async (proj_id, list_id, card_id) => {
    await http
      .get(`/gotasks/usershow/`)
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    await http
      .get(`/gotasks/projects/${proj_id}/lists/${list_id}/cards/${card_id}`)
      .then((res) => {
        setItem(res.data);
        setFetched(true);
      })
      .catch((err) => {
        console.log(err);
      });
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
      {projectname}
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
      to={{ pathname: `/gotasks/projects/${proj_id}/lists/${list_id}/` }}
    >
      {listname}
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
      to={{
        pathname: `/gotasks/projects/${proj_id}/lists/${list_id}/cards/${card_id}`,
      }}
    >
      {item.card_name}
    </Link>,
  ];

  useEffect(async () => {
    await checkLoginStatus();
    await fetchProjectName();
    await fetchListName();
    await fetchCard(proj_id, list_id, card_id);
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
                  <strong>Card Name:</strong> {item.card_name}
                </Typography>
                <Typography component="h1" variant="h6" gutterBottom>
                  <strong>Description:</strong> {item.description}
                </Typography>
                <Typography component="h1" variant="h6" gutterBottom>
                  <strong>Assigned To:</strong>{" "}
                  {users.map((user, index) => {
                    if (user.id == item.assigned) {
                      return user.fullname;
                    }
                  })}
                </Typography>
                <Typography component="h1" variant="h6" gutterBottom>
                  <strong>Created on:</strong>{" "}
                  {moment(item.date_created).format(
                    "dddd, MMMM Do YYYY, h:mm:ss a"
                  )}
                </Typography>
                <Typography component="h1" variant="h6" gutterBottom>
                  <strong>Due date:</strong>{" "}
                  {moment(item.due_date).format(
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
                      goToComments();
                    }}
                  >
                    Comment
                  </Button>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    startIcon={<UpdateIcon />}
                    color="primary"
                    className={classes.submit}
                    onClick={handleUpdateOpen}
                  >
                    {" "}
                    Update
                  </Button>
                  <EditCard
                    updateopen={updateopen}
                    handleUpdateClose={handleUpdateClose}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    startIcon={<DeleteIcon />}
                    className={classes.submit}
                    onClick={handleOpen}
                    style={{ color: "white", backgroundColor: "#D70040" }}
                  >
                    {" "}
                    Delete
                  </Button>
                  <DeleteCard open={open} handleClose={handleClose} />
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      </>
    );
  }
};
