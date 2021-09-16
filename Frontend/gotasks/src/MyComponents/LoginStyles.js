import { makeStyles } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import loginpage from '../images/loginpage.jpg';

const bgcolroot = grey[600]
const bgcolsubdiv = grey[100]

const useStyles = makeStyles((theme) => ({
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
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default useStyles