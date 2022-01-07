import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const useStyle = makeStyles((theme) => ({
  maindiv: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  headingtag: {
    textAlign: "center",
    fontSize: "50px",
  },
  linktag: {
    textDecoration: "none",
    fontSize: "40px",
  },
}));

function Banned() {
  const classes = useStyle();

  return (
    <div className={classes.maindiv}>
      <h1 className={classes.headingtag}>
        You are banned ! Please contact IMG maintainers
      </h1>
      <Link to="/" className={classes.linktag}>
        Go to Login Page
      </Link>
    </div>
  );
}

export default Banned;
