import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  toolbar: {
    display: "flex",
    justifyContent: "space-between"
  },
  navcol: {
    backgroundColor: "grey"
  },
  buttoncol: {
    backgroundColor: "white"
  },
  linkcol: {
    textDecoration: "none",
    color: "black",
  },
  buttonmargin: {
    marginRight: theme.spacing(4),
    backgroundColor: "white"
  }
}));

export default useStyles