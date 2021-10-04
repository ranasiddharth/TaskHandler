import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import { TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import { useState } from 'react';
import { useParams } from "react-router"
import AddBoxIcon from '@material-ui/icons/AddBox';
import CancelIcon from '@material-ui/icons/Cancel';
import axios from 'axios'
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


const Form = ({ handleClose, getlists, setGetlists, fetchList }) => {

  const classes = useStyles()
  const { proj_id } = useParams()
  const [name, setName] = useState('');
  const [errormsg, setErrormsg] = useState(false);

  const handleSubmit = async(e) => {
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
    await axios.post(`http://127.0.0.1:8000/gotasks/projects/${proj_id}/lists/`,
    formData, config)
    .then(res => {
      console.log(res.data)
      
    }).catch(err => {
      console.log(err)
    })

    // fetchList();
    handleClose();
  };


  const validateName = () => {
    for (let i=0; i<getlists.length; i++){
      if(getlists[i].list_name === name){
        setErrormsg(true);
        break;
      }else{
        setErrormsg(false);
      }
    }
  }

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <TextField 
          label="Name" 
          variant="filled" 
          fullWidth
          required value={name}
          helperText={errormsg ? "List name already exists !" : "Available"}
          onInput={(e) => {
            setName(e.target.value)
            validateName()
            }}/>

      <div>
        <Button variant="contained"  onClick={handleClose} startIcon={<CancelIcon />} disableElevation>
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary" startIcon={<AddBoxIcon />} disableElevation>
          Add
        </Button>
      </div>
    </form>
  )
}


export const AddList = ({ open, handleClose, getlists, setGetlists, fetchList }) => {

  return (
    <Dialog open={open} onClose={handleClose}>
      <Form getlists={getlists} setGetlists={setGetlists} fetchList={fetchList} handleClose={handleClose} />
    </Dialog>
  );

};
