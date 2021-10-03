import { makeStyles } from '@material-ui/core/styles';

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
    textAlign: 'center',
    padding: "20px",
    margin: "20px",
  },
  logoutIndiv: {
    width: "70%",
    margin: "auto",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
  }
}));

export default useCardStyles