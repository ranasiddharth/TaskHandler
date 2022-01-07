import http from "./axios.js";
import React from "react";
import axios from "axios";
import Typography from "@material-ui/core/Typography";
import moment from "moment";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import { useState, useEffect } from "react";
import {
  CardContent,
  CardActions,
  CssBaseline,
  Card,
  Button,
} from "@material-ui/core";
import NoDisplay from "./NoDisplay.js";
import useCardStyles from "../styles/DashboardCard";
import { Loading } from "./Loading.js";
import { useHistory } from "react-router-dom";
import "../styles/ListTags.css";
import "../styles/placeHolder.css";
import Header2 from "./Header2.js";
import SearchIcon from "@material-ui/icons/Search";
import useSearchStyles from "../styles/SearchBar.js";
import Checkbox from "@material-ui/core/Checkbox";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";
import FormControlLabel from "@mui/material/FormControlLabel";
import MaterialUISwitch from "./DarkMode.js";

import "../styles/DarkMode.css";

const Project = (props) => {
  const projects = props.projectState;
  const searcher = useSearchStyles();
  const [q, setQ] = useState("");
  const [searchParam] = useState(["project_name"]);

  const classes = useCardStyles();

  const history = useHistory();

  const proj = (id) => {
    history.push(`/gotasks/projects/${id}`);
  };

  function search(items) {
    return items.filter((item) => {
      return searchParam.some((newItem) => {
        return (
          item[newItem].toString().toLowerCase().indexOf(q.toLowerCase()) > -1
        );
      });
    });
  }

  return (
    <div>
      {props.checked ? (
        <h1 className={classes.heading} style={{ color: "#b3b2b2" }}>
          Projects
        </h1>
      ) : (
        <h1 className={classes.heading}>Projects</h1>
      )}
      <div
        className={searcher.search}
        style={{
          backgroundColor:
            document.getElementsByTagName("body")[0].style.backgroundColor ==
            "black"
              ? "#b3b2b2"
              : "white",
        }}
      >
        <SearchIcon />
        <input
          type="search"
          name="search-form"
          list="data"
          autocomplete="off"
          id="search-form"
          style={{
            flexGrow: "1",
            border: "none",
            outline: "none",
            height: "100%",
            borderRadius: "5px",
            fontSize: "16px",
            backgroundColor:
              document.getElementsByTagName("body")[0].style.backgroundColor ==
              "black"
                ? "#b3b2b2"
                : "white",
          }}
          className="search-input change"
          placeholder="Search projects by name..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <datalist id="data">
          {projects.map((item, key) => (
            <option key={key} value={item.project_name} />
          ))}
        </datalist>
      </div>
      <br />
      {projects.length > 0 ? (
        search(projects).map((project) => {
          return (
            <Card
              sx={{ minWidth: 275 }}
              variant="outlined"
              className={classes.cardattr}
              key={project.id}
              style={{
                backgroundColor: props.checked
                  ? "#b3b2b2"
                  : classes.cardattr.backgroundColor,
              }}
            >
              <CardContent>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <Typography variant="h5" component="div">
                      <strong>Name:</strong> {project.project_name}
                    </Typography>
                  </div>
                  <div>
                    <Avatar className={classes.avatar}>
                      {project.project_name.charAt(0).toUpperCase()}
                    </Avatar>
                  </div>
                </div>
                <Typography sx={{ fontSize: 14 }} gutterBottom>
                  <strong>Description:</strong>
                </Typography>
                <div>
                  <Typography
                    sx={{ fontSize: 14 }}
                    gutterBottom
                    dangerouslySetInnerHTML={{ __html: project.project_wiki }}
                  ></Typography>
                </div>
                <Typography variant="body2" gutterBottom>
                  <strong>Created by:</strong>{" "}
                  {project.project_creator.fullname}
                </Typography>
                <Typography
                  variant="body2"
                  gutterBottom
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <strong>Completion Status:</strong>{" "}
                  {project.is_completed ? (
                    <Checkbox
                      checked={true}
                      style={{
                        paddingTop: "0px",
                        paddingBottom: "0px",
                        color: "#3f51b5",
                      }}
                      inputProps={{ "aria-label": "controlled" }}
                    />
                  ) : (
                    <CancelRoundedIcon
                      style={{ color: "#3f51b5", marginLeft: "8px" }}
                    />
                  )}
                </Typography>
              </CardContent>
              <CardActions className={classes.cardActions}>
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    proj(project.id);
                  }}
                  disableElevation
                >
                  Details
                </Button>
              </CardActions>
            </Card>
          );
        })
      ) : (
        <NoDisplay whoisitem={"dashboard"} />
      )}
    </div>
  );
};

const CardShow = (props) => {
  const cards = props.cardState;
  const searcher = useSearchStyles();
  const [q, setQ] = useState("");
  const [searchParam] = useState(["card_name"]);

  const classes = useCardStyles();

  const history = useHistory();

  const getcard = (id1, id2, id3) => {
    history.push(`/gotasks/projects/${id1}/lists/${id2}/cards/${id3}`);
  };

  function search(items) {
    return items.filter((item) => {
      return searchParam.some((newItem) => {
        return (
          item[newItem].toString().toLowerCase().indexOf(q.toLowerCase()) > -1
        );
      });
    });
  }

  return (
    <div>
      {props.checked ? (
        <h1 className={classes.heading} style={{ color: "#b3b2b2" }}>
          Assigned Cards
        </h1>
      ) : (
        <h1 className={classes.heading}>Assigned Cards</h1>
      )}
      <div
        className={searcher.search}
        style={{
          backgroundColor: "white",
          backgroundColor:
            document.getElementsByTagName("body")[0].style.backgroundColor ==
            "black"
              ? "#b3b2b2"
              : "white",
        }}
      >
        <SearchIcon />
        <input
          type="search"
          name="search-form"
          list="datacards"
          autocomplete="off"
          id="search-form"
          style={{
            flexGrow: "1",
            border: "none",
            outline: "none",
            height: "100%",
            borderRadius: "5px",
            fontSize: "16px",
            backgroundColor:
              document.getElementsByTagName("body")[0].style.backgroundColor ==
              "black"
                ? "#b3b2b2"
                : "white",
          }}
          className="search-input change"
          placeholder="Search cards by name..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <datalist id="datacards">
          {cards.map((item, key) => (
            <option key={key} value={item.card_name} />
          ))}
        </datalist>
      </div>
      <br />
      {cards.length > 0 ? (
        search(cards).map((card) => {
          return (
            <Card
              sx={{ minWidth: 275 }}
              variant="outlined"
              className={classes.cardattr}
              key={card.id}
              style={{
                backgroundColor: props.checked
                  ? "#b3b2b2"
                  : classes.cardattr.backgroundColor,
              }}
            >
              <CardContent>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <Typography variant="h5" component="div">
                      <strong>Name:</strong> {card.card_name}
                    </Typography>
                  </div>
                  <div>
                    <Avatar className={classes.avatar}>
                      {card.card_name.charAt(0).toUpperCase()}
                    </Avatar>
                  </div>
                </div>
                <Typography sx={{ fontSize: 14 }} gutterBottom>
                  <strong>Description:</strong> {card.description}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Created on:</strong>{" "}
                  {moment(card.date_created).format(
                    "dddd, MMMM Do YYYY, h:mm:ss a"
                  )}
                </Typography>
                <Typography variant="body2">
                  <strong>Due Date:</strong>{" "}
                  {moment(card.due_date).format(
                    "dddd, MMMM Do YYYY, h:mm:ss a"
                  )}
                </Typography>
                <Typography
                  variant="body2"
                  gutterBottom
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <strong>Completion Status:</strong>{" "}
                  {card.is_completed ? (
                    <Checkbox
                      checked={true}
                      style={{
                        paddingTop: "0px",
                        paddingBottom: "0px",
                        color: "#3f51b5",
                      }}
                      inputProps={{ "aria-label": "controlled" }}
                    />
                  ) : (
                    <CancelRoundedIcon
                      style={{ color: "#3f51b5", marginLeft: "8px" }}
                    />
                  )}
                </Typography>
              </CardContent>
              <CardActions className={classes.cardActions}>
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    getcard(card.list.project, card.list.id, card.id);
                  }}
                  disableElevation
                >
                  Details
                </Button>
              </CardActions>
            </Card>
          );
        })
      ) : (
        <NoDisplay whoisitem={"dashboard"} />
      )}
    </div>
  );
};

export const Dashboard = () => {
  const history = useHistory();

  const classes = useCardStyles();
  const label = { inputProps: { "aria-label": "Switch demo" } };
  const [user, setUser] = useState({});
  const [fetched, setFetched] = useState(false);
  const [projects, setProjects] = useState([]);
  const [cards, setCards] = useState([]);
  const [loggedin, setLoggedin] = useState(false);
  const [checked, setChecked] = useState(false);

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

  async function fetchData() {
    await http
      .get("/gotasks/loggeduser/")
      .then((res) => {
        setUser(res.data[0]);
      })
      .catch((err) => console.log(err));

    let count = 0;
    await http
      .get("/gotasks/dashboard/projects")
      .then((res) => {
        setProjects(res.data);
        count = count + 1;
      })
      .catch((err) => console.log(err));

    await http
      .get("/gotasks/dashboard/cards")
      .then((res) => {
        setCards(res.data);
        count = count + 1;
      })
      .catch((err) => console.log(err));

    if (count == 2) {
      setFetched(true);
    }
  }

  useEffect(async () => {
    await checkLoginStatus();
    await handleRouterChange();
    await fetchData();
  }, []);

  const handleRouterChange = async () => {
    if (document.body.style.backgroundColor == "black") {
      setChecked(true);
    } else {
      setChecked(false);
    }
  };

  const handleToggleChange = async () => {
    if (!checked) {
      setChecked(true);
      document.body.style.backgroundColor = "black";
    } else {
      setChecked(false);
      document.body.style.backgroundColor = "white";
    }
  };

  if (!fetched === true) {
    return (
      <>
        <Loading />
      </>
    );
  } else {
    return (
      <div>
        <Header2 />
        <div className="dark-mode">
          <FormControlLabel
            control={
              <MaterialUISwitch
                sx={{ m: 1 }}
                checked={checked}
                onChange={handleToggleChange}
              />
            }
            label={
              checked ? (
                <p style={{ color: "#b3b2b2" }}>Dark Mode</p>
              ) : (
                <p style={{ color: "black" }}>Light Mode</p>
              )
            }
          />
        </div>
        {checked ? (
          <h3
            style={{
              textAlign: "center",
              margin: "20px",
              marginBottom: "0px",
              color: "#b3b2b2",
            }}
          >
            Welcome {user.fullname} !
          </h3>
        ) : (
          <h3
            style={{ textAlign: "center", margin: "20px", marginBottom: "0px" }}
          >
            Welcome {user.fullname} !
          </h3>
        )}
        <Grid container component="main" className={classes.mainGrid}>
          <CssBaseline />
          <Grid item xs={12} sm={12} md={6}>
            <Project projectState={projects} checked={checked} />
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <CardShow cardState={cards} checked={checked} />
          </Grid>
        </Grid>
      </div>
    );
  }
};
