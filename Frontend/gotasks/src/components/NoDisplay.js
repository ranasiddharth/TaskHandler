import React from "react";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyle = makeStyles((theme) => ({
  maindiv: {
    marginTop: "50px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  headingtag: {
    textAlign: "center",
    fontSize: "32px",
  },
  linktag: {
    textDecoration: "none",
    fontSize: "16px",
    marginBottom: "15px",
    marginTop: "10px",
  },
}));

function NoDisplay(props) {
  const classes = useStyle();

  const handleButtonClick = () => {
    alert(
      `Click on Add ${props.whoisitem} in the Navbar to add a new ${props.whoisitem}`
    );
  };

  return (
    <div className={classes.maindiv}>
      <h1
        className={classes.headingtag}
        style={{
          color:
            document.body.style.backgroundColor == "black" ? "#b3b2b2" : "black",
        }}
      >
        Nothing to display !!
      </h1>
      {props.whoisitem !== "dashboard" ? (
        <h3
          className={classes.linktag}
          style={{
            color:
              document.body.style.backgroundColor == "black"
                ? "#b3b2b2"
                : "black",
          }}
        >
          Please add {props.whoisitem} to see something.
        </h3>
      ) : (
        <h3
          className={classes.linktag}
          style={{
            color:
              document.body.style.backgroundColor == "black"
                ? "#b3b2b2"
                : "black",
          }}
        >
          Nothing assigned !
        </h3>
      )}
      {props.whoisitem !== "dashboard" ? (
        <Button variant="contained" color="primary" onClick={handleButtonClick}>
          What to do ?
        </Button>
      ) : (
        ""
      )}
    </div>
  );
}

export default NoDisplay;
