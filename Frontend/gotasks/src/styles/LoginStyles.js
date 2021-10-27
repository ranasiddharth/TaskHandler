import { makeStyles } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import loginpage from '../images/loginpage.jpg';

const bgcolroot = grey[600]
const bgcolsubdiv = grey[200]

const useLoginStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    backgroundColor: bgcolroot,
  },
  signupdiv: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupsubdiv: {
    height: '85%',
    backgroundColor: bgcolsubdiv,
  },
  signupsubdiv2: {
    // height: '85%',
    backgroundColor: bgcolsubdiv,
    borderRadius: "15px!important"
  },
  image: {
    backgroundImage: `url(${loginpage})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    height: '80%',
  },
  displayer: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    height: '80%',
  },
  divMargin: {
    // minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '30px',
    marginBottom: "30px",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    [theme.breakpoints.down(500)]: {
      width: "100%!important",
    },
    [theme.breakpoints.up(500)]: {
      width: "110px",
    }
  },
  loginbutton: {
    margin: theme.spacing(3, 0, 2),
  },
  buttonsdiv: {
    [theme.breakpoints.down(500)]: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-evenly",
      alignItems: "center",
    },
    [theme.breakpoints.up(500)]: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
  },
  chatdiv: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
  },
}));

export default useLoginStyles