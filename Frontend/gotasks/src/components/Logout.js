import axios from "axios";
import Cookies from "js-cookie";
import { useHistory } from "react-router-dom";

export const loggingout = () => {
  const history = useHistory();

  axios
    .get("http://127.0.0.1:8000/gotasks/logout", { withCredentials: true })
    .then((resp) => {
      Cookies.remove("mytoken");
      Cookies.remove("sessionid");
      Cookies.remove("csrftoken");
      history.push("/");
    })
    .catch((err) => {
      console.log("error while logging out");
    });
};
