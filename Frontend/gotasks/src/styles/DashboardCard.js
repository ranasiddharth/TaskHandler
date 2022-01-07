import { makeStyles } from "@material-ui/core/styles";
import grey from "@material-ui/core/colors/grey";

const backcolgrey = grey[100];

const useCardStyles = makeStyles((theme) => ({
  cardattr: {
    margin: "auto",
    width: "80%",
    marginTop: "40px",
    marginBottom: "10px",
    minHeight: "195.55px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxShadow: "4px 4px #888888",
    borderRadius: "10px!important",
    backgroundColor: backcolgrey,
    transition: "all 0.3s ease-in-out",
    "&:hover": {
      transform: "scale(1.02)",
    },
  },
  heading: {
    marginTop: "30px",
    textAlign: "center",
  },
  mainGrid: {
    minHeight: "100vh",
  },
  cardActions: {
    padding: "16px",
  },
  logoutOutdiv: {
    textAlign: "center",
    padding: "20px",
    margin: "20px",
  },
  logoutIndiv: {
    width: "70%",
    margin: "auto",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: theme.palette.secondary.main,
    },
  },
  chatavatar: {
    marginRight: "0px",
    backgroundColor: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: theme.palette.secondary.main,
    },
  },
}));

export default useCardStyles;
