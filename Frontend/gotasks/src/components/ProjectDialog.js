import React from 'react';
import http from './axios.js'
import Dialog from '@material-ui/core/Dialog';
import { TextField, Button, MenuItem, Select, FormControl, InputLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import { useState, useEffect } from 'react';
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


const Form = ({ handleClose }) => {

  const classes = useStyles()
  const [name, setName] = useState('');
  const [wiki, setWiki] = useState('');
  const [members, setMembers] = useState([]);
  const [selected, setSelected] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(name, wiki, selected);
    var formData = new FormData();
    formData.append("project_name", name);
    formData.append("project_wiki", wiki);
    formData.append("project_members", selected);
    const config = {
      headers: {
        "Content-Type": 'multipart/form-data',
        "Authorisation": `Token ${Cookies.get("mytoken")}`
      }
    }
    axios.post("http://127.0.0.1:8000/gotasks/projects/",
    formData, config)
    .then(res => {
      console.log(res.data)
    }).catch(err => {
      console.log(err)
    })

    handleClose();
  };

  useEffect(() => {
    http.get("/gotasks/usershow").then(
      (res) => {
        console.log(res.data)
        setMembers(res.data)
      }).catch(err => {
        console.log(err)
      })
  }, [])

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <TextField 
          label="Name" 
          variant="filled" 
          fullWidth
          required value={name}
          onChange={e => setName(e.target.value)}/>

      <TextField 
          label="Description"
          variant="filled" 
          fullWidth
          required value={wiki}
          onChange={e => setWiki(e.target.value)}/>

      <FormControl className={classes.formControl}>
        <InputLabel> Members </InputLabel>
        <Select 
          multiple={true}
          fullWidth
          required
          value={selected}
          onChange = {(e) => 
            setSelected(e.target.value)
          }
        >
          {members.map(({id, username, fullname}, index) => {
            return(
            <MenuItem key={id} value={username}>
              {username}
            </MenuItem>
            )
          })}
        </Select>
      </FormControl>

      <div>
        <Button variant="contained"  onClick={handleClose}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Add
        </Button>
      </div>
    </form>
  )
}


export const ProjectDialog = ({ open, handleClose }) => {

  return (
    <Dialog open={open} onClose={handleClose}>
      <Form handleClose={handleClose} />
    </Dialog>
  );

};