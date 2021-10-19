import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import { TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import { useState, useEffect } from 'react';
import { useParams } from "react-router"
import AddBoxIcon from '@material-ui/icons/AddBox';
import UpdateIcon from '@material-ui/icons/Update';
import CancelIcon from '@material-ui/icons/Cancel';
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
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
  const [err, setErr] = useState(false)
  const [duperr, setDuperr] = useState(false)
  const [checked, setChecked] = useState(false)

  const handleUpdateSubmit = async(e) => {
    e.preventDefault();
    console.log(name);
    var formData = new FormData();
    formData.append("list_name", name);
    formData.append("is_completed", checked)

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
      setErr(false)
      setDuperr(false)
      console.log("edit successful")
      handleUpdateClose();
    }).catch(err => {
      if(err.response.status === 403){
        setErr(true)
        console.log("edit unauthorized")
      }
      if(err.response.status === 500){
        setDuperr(true);
        console.log("edit same name list")
      }
      console.log(err)
    })

    // fetchList();
    // handleUpdateClose();
  };


  useEffect(() => {
    http.get(`/gotasks/projects/${proj_id}/lists/${list_id}`).then(
      (res) => {
        console.log(res.data)
        setName(res.data.list_name)
        setChecked(res.data.is_completed)
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

  function handleCompleteChange(e){
    setChecked(e.target.checked)
  }

  return (
    <form className={classes.root} onSubmit={handleUpdateSubmit}>
      <h3 style={{color:"red"}}>{err ? "Updation of list unsuccessful! Available for only admins and project members." : ""}</h3>
      <h3 style={{color:"red"}}>{duperr ? "List with this name already exists" : ""}</h3>
      <TextField 
          label="Name" 
          variant="filled" 
          fullWidth
          required value={name}
          // helperText={errormsg ? "List name already exists !" : "Available"}
          onInput={(e) => {
            setName(e.target.value)
            // validateName()
          }}
      />

      <FormControlLabel 
        style={{alignSelf: "flex-start"}}
        control={<Checkbox style={{margin: "0px", paddingRight: "3px"}} checked={checked} onChange={handleCompleteChange}/>} 
        label="Completion Status" 
      />

      <div>
        <Button variant="contained"  onClick={()=>{
          setErr(false);
          setDuperr(false);
          handleUpdateClose()
        }} startIcon={<CancelIcon />} disableElevation>
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary" startIcon={<UpdateIcon />} disableElevation>
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
