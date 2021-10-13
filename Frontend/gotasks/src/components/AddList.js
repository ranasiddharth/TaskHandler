import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import { TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import { useState, useEffect } from 'react';
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
  const [err, setErr] = useState(false)
  const [duperr, setDuperr] = useState(false)

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log(name);
    var formData = new FormData();
    formData.append("list_name", name);

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
      setErr(false)
      setDuperr(false)
      console.log("post successful")
      handleClose();
    }).catch(err => {
      if(err.response.status === 403){
        setErr(true)
        console.log("post unauthorized")
      }
      if(err.response.status === 500){
        setDuperr(true);
        console.log("post same name list")
      }
      console.log(err)
    })

  };

  useEffect(() => {
    validateName();
  }, [name])

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
      <h3 style={{color:"red"}}>{err ? "List creation unsuccessful ! Available for only admins and project members." : ""}</h3>
      <h3 style={{color:"red"}}>{duperr ? "List with this name already exists" : ""}</h3>
      <TextField 
          label="Name" 
          variant="filled" 
          fullWidth
          required value={name}
          helperText={errormsg ? <h4 style={{color:"red"}}>List name already exists !</h4> : <h4 style={{color:"green"}}>Available !</h4>}
          onInput={(e) => {
            setName(e.target.value)
            }}/>

      <div>
        <Button variant="contained"  onClick={()=>{
          setErr(false);
          setDuperr(false);
          handleClose()
        }} startIcon={<CancelIcon />} disableElevation>
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
