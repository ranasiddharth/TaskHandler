import { makeStyles } from "@material-ui/core/styles";

const useSearchStyles = makeStyles((theme) => ({
  search: {
    marginTop: "30px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "60%",
    marginLeft: "auto",
    marginRight: "auto",
    border: "1px solid grey",
    borderRadius: "5px",
    boxShadow: "1px 1px",
    height: "35px",
    [theme.breakpoints.down(500)]: {
      width: "80%!important",
    },
  },
}));

export default useSearchStyles;
