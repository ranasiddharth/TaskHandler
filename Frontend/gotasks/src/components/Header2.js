import Cookies from "js-cookie";
import React from "react";
import axios from "axios";
import Typography from "@material-ui/core/Typography";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import GroupIcon from "@material-ui/icons/Group";
import WorkIcon from "@material-ui/icons/Work";
import { useState, useEffect } from "react";
import { AppBar, Toolbar, Box, Button } from "@material-ui/core";
import useStyles from "../styles/Navbar.js";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import "../styles/ListTags.css";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import Divider from "@material-ui/core/Divider";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

const Header2 = () => {
  const [admin, setAdmin] = useState(false);
  const [opendrawer, setOpendrawer] = useState(false);
  const history = useHistory();
  const classes = useStyles();

  const loggingout = () => {
    axios
      .get("http://127.0.0.1:8000/gotasks/logout", { withCredentials: true })
      .then((resp) => {
        Cookies.remove("mytoken");
        Cookies.remove("sessionid");
        Cookies.remove("csrftoken");
        history.push("/");
      })
      .catch((err) => {
        console.log("error while logging out");
      });
  };

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/gotasks/users/", { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          setAdmin(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            GOTASKS
          </Typography>
          <Hidden smDown>
            <div>
              <Button
                className={classes.buttonmargin}
                startIcon={<WorkIcon />}
                disableElevation
              >
                <Link to="/gotasks/projects" className={classes.linkcol}>
                  Projects
                </Link>
              </Button>
              <Button
                disabled={!admin}
                className={classes.buttonmargin}
                startIcon={<GroupIcon />}
                disableElevation
              >
                <Link to="/gotasks/users" className={classes.linkcol}>
                  Members
                </Link>
              </Button>
              <Button
                className={classes.buttoncol}
                startIcon={<LogoutIcon />}
                onClick={() => {
                  loggingout();
                }}
                disableElevation
              >
                Logout
              </Button>
            </div>
          </Hidden>
          <Hidden mdUp>
            <IconButton>
              <MenuIcon
                style={{ color: "white" }}
                onClick={() => {
                  setOpendrawer(true);
                }}
              />
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
              <ChevronRightIcon
                onClick={() => {
                  setOpendrawer(false);
                }}
              />
            </IconButton>
          </div>
          <Divider />
          <List>
            <ListItem className={classes.phonelistitems}>
              <Button
                className={classes.buttonmargin}
                startIcon={<WorkIcon />}
                disableElevation
              >
                <Link to="/gotasks/projects" className={classes.linkcol}>
                  Projects
                </Link>
              </Button>
            </ListItem>
            <ListItem className={classes.phonelistitems}>
              <Button
                disabled={!admin}
                className={classes.buttonmargin}
                startIcon={<GroupIcon />}
                disableElevation
              >
                <Link to="/gotasks/users" className={classes.linkcol}>
                  Members
                </Link>
              </Button>
            </ListItem>
            <ListItem className={classes.phonelistitems}>
              <Button
                className={classes.buttoncol}
                startIcon={<LogoutIcon />}
                onClick={() => {
                  loggingout();
                }}
                disableElevation
              >
                Logout
              </Button>
            </ListItem>
          </List>
        </SwipeableDrawer>
      </AppBar>
    </Box>
  );
};

export default Header2;
