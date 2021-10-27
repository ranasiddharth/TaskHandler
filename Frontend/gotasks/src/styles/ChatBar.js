import { makeStyles } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';

const backcolgrey = grey[100];

const useChatStyles = makeStyles((theme) => ({
  search: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginLeft: "auto",
    marginRight: "auto",
    border: "1px solid grey",
    borderRadius: "5px",
    boxShadow: "1px 1px",
    height: "35px",
    padding: "5px",
    backgroundColor: "grey",
  },
  cardattr: {
    margin: "auto",
    width: "80%",
    marginTop: "40px",
    marginBottom: "10px", 
    minHeight: "195.55px",
    display: "flex",
    height: "85vh",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRadius: "10px!important",
    backgroundColor: backcolgrey,
    [theme.breakpoints.down(500)]: {
      width: "100%!important",
      height: "100%!important",
      borderRadius: "0px!important",
      boxShadow: "none",
    }
  },
  cardActions: {
    padding: "16px",
  },
}));

export default useChatStyles;