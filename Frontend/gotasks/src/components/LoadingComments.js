import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
});

export const LoadingComments = () => {
  const classes = useStyles();
  return (
    <div className={classes.loading}>
      <div>
        <CircularProgress color="secondary" size="3rem" />
      </div>
    </div>
  );
};
