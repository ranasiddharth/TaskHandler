import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import { TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import { useState, useEffect } from 'react';
import { useParams } from "react-router"
import AddBoxIcon from '@material-ui/icons/AddBox';
import CancelIcon from '@material-ui/icons/Cancel';
import axios from 'axios'
import http from './axios.js'
import Cookies from 'js-cookie'


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),
'& .MuiTextField-root': {
      margin: theme.spacing(2),
      width: "100%",
    },
'& .MuiButtonBase-root': {
      margin: theme.spacing(2),
    },
  },
  formControl: {
    minWidth: 100,
  }
}));


const Form = ({ handleUpdateClose }) => {

  const classes = useStyles()
  const { proj_id, list_id } = useParams()
  const [name, setName] = useState('');
  const [errormsg, setErrormsg] = useState(false);

  const handleUpdateSubmit = async(e) => {
    e.preventDefault();
    console.log(name);
    var formData = new FormData();
    formData.append("list_name", name);
    // console.log(getlists)

    const config = {
      headers: {
        "Content-Type": 'multipart/form-data',
        'X-CSRFToken': Cookies.get("csrftoken"),
        'X-Requested-With': 'XMLHttpRequest'
      }
    }
    await axios.put(`http://127.0.0.1:8000/gotasks/projects/${proj_id}/lists/${list_id}/`,
    formData, config)
    .then(res => {
      console.log(res.data)
      
    }).catch(err => {
      console.log(err)
    })

    // fetchList();
    handleUpdateClose();
  };


  useEffect(() => {
    http.get(`/gotasks/projects/${proj_id}/lists/${list_id}`).then(
      (res) => {
        console.log(res.data)
        setName(res.data.list_name)
      }).catch(err => {
        console.log(err)
      })
  }, [])


  // const validateName = () => {
  //   for (let i=0; i<getlists.length; i++){
  //     if(getlists[i].list_name === name){
  //       setErrormsg(true);
  //       break;
  //     }else{
  //       setErrormsg(false);
  //     }
  //   }
  // }

  return (
    <form className={classes.root} onSubmit={handleUpdateSubmit}>
      <TextField 
          label="Name" 
          variant="filled" 
          fullWidth
          required value={name}
          helperText={errormsg ? "List name already exists !" : "Available"}
          onInput={(e) => {
            setName(e.target.value)
            // validateName()
            }}/>

      <div>
        <Button variant="contained"  onClick={handleUpdateClose} startIcon={<CancelIcon />} disableElevation>
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary" startIcon={<AddBoxIcon />} disableElevation>
          Add
        </Button>
      </div>
    </form>
  )
}


export const EditList = ({ updateopen, handleUpdateClose }) => {

  return (
    <Dialog open={updateopen} onClose={handleUpdateClose}>
      <Form handleUpdateClose={handleUpdateClose} />
    </Dialog>
  );

};