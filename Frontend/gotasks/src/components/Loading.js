import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
  },

})

export const Loading = () => {

    const classes = useStyles()
    return (
        <div className={classes.loading}>
            <div>
                <CircularProgress color="secondary" size="3rem" />
            </div>
        </div>
    );
}