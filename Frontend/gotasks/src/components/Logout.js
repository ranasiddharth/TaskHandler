import axios from 'axios'
import Cookies from 'js-cookie'

export const loggingout = () => {
  axios.get("http://127.0.0.1:8000/gotasks/logout", {withCredentials: true}).then((resp)=>{
    Cookies.remove('mytoken');
    Cookies.remove('sessionid');
    Cookies.remove('csrftoken');
    window.location.href="http://localhost:3000/";
  }).catch((err)=>{
    console.log("error while logging out")
  })
}