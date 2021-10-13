import React from 'react';
import http from './axios.js'
import Dialog from '@material-ui/core/Dialog';
import { TextField, Button, MenuItem, Select, FormControl, InputLabel, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Checkbox } from '@material-ui/core';
import { ListItemIcon, ListItemText } from '@material-ui/core';
import AddBoxIcon from '@material-ui/icons/AddBox';
import UpdateIcon from '@material-ui/icons/Update';
import CancelIcon from '@material-ui/icons/Cancel';
import { useState, useEffect } from 'react';
import axios from 'axios'
import Cookies from 'js-cookie'
import { useParams } from 'react-router';


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
    width: "100%",
  },
  ckeditorwidth:{
    width: "100%"
  }
}));


const Form = ({ handleUpdateClose }) => {

  const classes = useStyles()
  const { proj_id } = useParams()

  const [name, setName] = useState('');
  const [wiki, setWiki] = useState('');
  const [members, setMembers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [errormsg, setErrormsg] = useState(false);
  const [err, setErr] = useState(false)
  const [duperr, setDuperr] = useState(false)


  const handleUpdateSubmit = async(e) => {

    e.preventDefault();
    console.log(name, wiki, selected);

    var formData = new FormData();
    formData.append("project_name", name);
    formData.append("project_wiki", wiki);

    selected.map(select => {
      formData.append("project_members", select)
    })

    const config = {
      headers: {
        "Content-Type": 'multipart/form-data',
        'X-CSRFToken': Cookies.get("csrftoken"),
        'X-Requested-With': 'XMLHttpRequest'
      }
    }
    await axios.put(`http://127.0.0.1:8000/gotasks/projects/${proj_id}/`,
    formData, config)
    .then(res => {
      setErr(false)
      setDuperr(false)
      console.log("edit successful")
      handleUpdateClose();
    }).catch(err => {
      if(err.response.status === 403){
        setErr(true)
        console.log("edit unauthorized")
      }
      if(err.response.status === 400){
        setDuperr(true);
        console.log("edit same name project")
      }
      console.log(err)
    })

  };

  useEffect(async() => {

    await http.get(`/gotasks/usershow/`).then(
      (res) => {
        setMembers(res.data)
      }).catch(err => {
        console.log(err)
    });

    await http.get(`/gotasks/projects/${proj_id}/`).then(
      (res) => {
        setName(res.data.project_name)
        setWiki(res.data.project_wiki)
        setSelected(res.data.project_members)
      }).catch(err => {
        console.log(err)
    });
    
  }, [])


  return (
    <form className={classes.root} onSubmit={handleUpdateSubmit}>
      <h3 style={{color:"red"}}>{err ? "Updation of project unsuccessful! Available for only admins and project members." : ""}</h3>
      <h3 style={{color:"red"}}>{duperr ? "Project with this name already exists" : ""}</h3>
      <TextField 
          label="Name" 
          variant="filled" 
          fullWidth
          required value={name}
          // helperText={errormsg ? "Project name already exists !" : "Available"}
          onInput={(e) => {
            setName(e.target.value)
          }}/>

      <div className={classes.ckeditorwidth}>
      <h4>Description</h4>
      <br />
      <CKEditor
          editor={ ClassicEditor }
          data=""
          onReady={(editor) => {
            // You can store the "editor" and use when it is needed.
            // console.log('Editor is ready to use!', editor);
          }}
          data={wiki}
          onChange={(event, editor) => {
            const data = editor.getData();
            setWiki(data);
          }}
      />
      </div>
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
            <MenuItem key={id} value={id}>
              {fullname}
            </MenuItem>
            )
          })}
        </Select>
      </FormControl>

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


export const EditProject = ({ updateopen, handleUpdateClose }) => {

  return (
    <Dialog width='100%' open={updateopen} onClose={handleUpdateClose}>
      <Form handleUpdateClose={handleUpdateClose} />
    </Dialog>
  );

};