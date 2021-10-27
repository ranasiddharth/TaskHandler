import React, { useState, useEffect } from 'react';
import SendIcon from '@material-ui/icons/Send';
import axios from "axios";
import http from './axios.js'
import Cookies from 'js-cookie';
import moment from "moment";
import grey from '@material-ui/core/colors/grey';
import Header from './Header';
import useCardStyles from '../styles/DashboardCard';
import Avatar from '@material-ui/core/Avatar';
import {Card, CardContent, CardActions} from '@material-ui/core'
import useChatStyles from '../styles/ChatBar';
import "../styles/placeHolder.css"
import { useHistory, useParams } from 'react-router';
import { LoadingComments } from './LoadingComments';
import '../styles/Chat.css'
import { DeleteComment } from './DeleteComment.js';
import { Menu } from '@mui/material';
import { MenuItem } from '@mui/material';
import DeleteIcon from '@material-ui/icons/Delete';
import UpdateIcon from '@material-ui/icons/Update';

const backcolgrey = grey[100];


const Comments = (props) => {

  const chat = useChatStyles();
  const classes = useCardStyles();
  const history = useHistory()
  const { proj_id, list_id, card_id } = useParams();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState()

  const recordButtonPosition = (event) => {
      setAnchorEl(event.currentTarget);
      setMenuOpen(true);
  }

  let closeMenu = () => {
      setMenuOpen(false);
  }

  if(props.comment.commentor!==props.loggedUser.id){
    return (
      <div className="container darker" style={{width: "60%"}}>
        {props.users.map((user, index) => {
          if(user.id==props.comment.commentor){
            const arr = user.fullname.split(" ")
            return(
              <div style={{display: "flex", flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center"}}>
              <Avatar className={classes.chatavatar} alt={user.fullname}>{arr[0].charAt(0).toUpperCase()}{arr[1].charAt(0).toUpperCase()}</Avatar>
              <strong><span style={{color: "red"}}>{user.fullname}</span></strong>
              </div>
            )
          }
        })}
        <p>{props.comment.body}</p>
        <div style={{display: "flex", flexDirection: "column"}}>
        <span className="time-left">{moment(props.comment.timestamp).format("LT")}</span>
        <span className="time-left">{moment(props.comment.timestamp).format("LL")}</span>
        </div>
      </div>
    )
  }else{
    const arr = props.loggedUser.fullname.split(" ")
    return (
      <div className="container darker" style={{width: "60%", marginLeft: "auto"}}>
              <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
              <Avatar className={classes.chatavatar} alt={props.loggedUser.fullname} onClick={recordButtonPosition}>{arr[0].charAt(0).toUpperCase()}{arr[1].charAt(0).toUpperCase()}</Avatar>
              <Menu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={closeMenu}>
                <MenuItem onClick={() => {
                    handleOpen();
                }}> 
                <DeleteIcon style={{marginRight: "6px"}}/>
                    Delete
                </MenuItem>
                <DeleteComment open={open} handleClose={handleClose} comment={props.comment}/> 
                {/* <MenuItem onClick={() => {
                    closeMenu();
                }}> 
                <UpdateIcon style={{marginRight: "6px"}}/>
                    Update
                </MenuItem>  */}
              </Menu>
              <strong><span style={{color: "green"}}>You</span></strong>
              </div>
        <p style={{textAlign: "right"}}>{props.comment.body}</p>
        <div style={{display: "flex", flexDirection: "column"}}>
        <span className="time-right" style={{textAlign:"right"}}>{moment(props.comment.timestamp).format("LT")}</span>
        <span className="time-right" style={{textAlign:"right"}}>{moment(props.comment.timestamp).format("LL")}</span>
        </div>
      </div>
    )
  }
}


const Chat = (props) => {

  const chat = useChatStyles();
  const classes = useCardStyles();
  const history = useHistory()
  const { proj_id, list_id, card_id } = useParams();
  const [message, setMessage] = useState()
  const [fetched, setFetched] = useState(false)
  const [users, setUsers] = useState([])
  const [loggedUser, setLoggedUser] = useState({})
  const [prevComments, setPrevComments] = React.useState([]);
  const [socket, setSocket] = React.useState({});

  const establishConnection = () => {
    const chatSocket = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${card_id}/`);
    setSocket(chatSocket)
    chatSocket.onopen = () => {
        console.log("Websocket Connection established");
    };
    fetchPrevComments(); 
  }

  function fetchPrevComments() {
    http
        .get(`/gotasks/projects/${proj_id}/lists/${list_id}/cards/${card_id}/comments/`)
        .then((response) => {
            setPrevComments(response.data)
            // console.log(prevComments)
            setScroll_Bottom()
            // console.log(response.data)
        })
        .catch((error) => console.log(error));

    setFetched(true)
  } 

  const fetchUsers = async() => {
    await http.get(`/gotasks/usershow/`).then(
      (res) => {
        setUsers(res.data)
      }).catch(err => {
        console.log(err)
    });
  }

  const [loggedin, setLoggedin] = useState(false)
  const checkLoginStatus = async() => {
    await axios.get("http://127.0.0.1:8000/gotasks/login_check/", {withCredentials:true})
    .then(response => {
      console.log(response)
      if (response.data.loggedin === true && loggedin === false){
        setLoggedin(true)
      }
      else if (response.data.loggedin === false && loggedin === false){
        setLoggedin(false)
        history.push("/")
      }
      else{
        setLoggedin(false);
        history.push("/")
      }
    }).catch(error => {
      console.log("login check failed, try again", error)
    })
  }

  useEffect(async()=>{
    await checkLoginStatus();

    await http.get("/gotasks/loggeduser/")
    .then(res => {
      setLoggedUser(res.data[0])
    })

    .catch(err => console.log(err))
    await fetchUsers();
    establishConnection();
  }, [])

  function setScroll_Bottom() {
      var objDiv = document.getElementById("comment-box");
      objDiv.scrollTop = objDiv.scrollHeight;
  }

  socket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    console.log(data['message'])
    var newComment = prevComments;
    if(data['info'] === 'created'){
      newComment.push(data['message']);
      setPrevComments([...newComment])
    }else if(data['info'] === 'deleted'){
      for(let i=0; i<prevComments.length; i++){
        if(prevComments[i].id === data['message'].id){
          prevComments.splice(i, 1);
        }
      }
      var newC = prevComments;
      setPrevComments([...newC])
    }
    setScroll_Bottom()
  };

  const disconnectSocket = () => {
    socket.close();
    socket.onclose = () => {
        console.log("Server disconnected");
    };
  }

  const sendComment = () => {
    if(message.trim()===''){
        return;
    }
    const data = {
        'message' : message,
        'card' : card_id
    };
    socket.send(JSON.stringify(data));
    setMessage('')
  }

  const handleKeyUp = (e) => {
    if (e.keyCode === 13) {  // enter, return
      if(message.trim()===''){
        return;
      }
      sendComment();
    }
  }

  return (
    <>
    <div style={{height: "10vh"}}>
    <Header style={{width: "100%", height: "100%"}}/>
    </div>
    <div style={{height: "90vh", display: "flex", flexDirection: "column", justifyContent: "center"}}>
    <Card sx={{ minWidth: 275 }} variant="outlined" className={chat.cardattr} style={{marginTop:"auto", marginBottom: "auto"}}>
        <CardContent style={{height: "100%", overflowY: "scroll"}} id="comment-box">
        {!fetched ? <LoadingComments /> :
          prevComments.length===0 && fetched ? <h2><strong>No comments to display !!</strong></h2> : 
             prevComments.map((comment, index) => {
                return(
                  <Comments comment={comment} loggedUser={loggedUser} users={users}/>
                )
             }
            )
        }
        </CardContent>
        <CardActions className={chat.cardActions}>
            <div style={{display: "flex", width: "100%", justifyContent: "center", alignItems: "center"}}>
              <div className={chat.search}>
                <input
                  type="text"
                  autocomplete="off"
                  name="comment-message"
                  id="comment-message"
                  style={{flexGrow: "1", border: "none", outline: "none", height: "100%", borderRadius: "5px", fontSize: "16px", backgroundColor: "grey", color: "white"}}
                  className="search-input change"
                  placeholder="Send Message"
                  value={message}
                  onKeyUp={(e) => {handleKeyUp(e)}}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <SendIcon id="sendmsg" className="sendmessageIcon" onClick={()=>{
                  console.log(message);
                  sendComment();
                  }
                } 
                  />
              </div>
            </div>
        </CardActions>
    </Card>
    </div>
    </>
  );
}

export default Chat;