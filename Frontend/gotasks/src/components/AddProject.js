import React from 'react';
import http from './axios.js'
import Dialog from '@material-ui/core/Dialog';
import { TextField, Button, MenuItem, Select, FormControl, InputLabel, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Checkbox } from '@material-ui/core';
import { ListItemIcon, ListItemText } from '@material-ui/core';
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
  },
  ckeditorwidth:{
    width: "100%"
  }
}));


const Form = ({ handleClose, getproj, setGetproj }) => {

  const classes = useStyles()
  const [name, setName] = useState('');
  const [wiki, setWiki] = useState('');
  const [members, setMembers] = useState([]);
  const [selected, setSelected] = useState([]);
  // const [checkboxesState, setCheckboxesState] = useState(-1)
  const [errormsg, setErrormsg] = useState(false);


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(name, wiki, selected);
    console.log(getproj)
    var formData = new FormData();
    formData.append("project_name", name);
    formData.append("project_wiki", wiki);

    selected.map(select => {
      formData.append("project_members", select)
    })

    // setGetproj(prevState => {
    //     return {
    //       ...prevState, 
    //     }
    // })

    const config = {
      headers: {
        "Content-Type": 'multipart/form-data',
        'X-CSRFToken': Cookies.get("csrftoken"),
        'X-Requested-With': 'XMLHttpRequest'
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


  // const [checkedState, setCheckedState] = useState(
  //   new Array(members.length).fill(false)
  // );

  // const handleCheckBox = (position) => {
  //   const updatedCheckedState = checkedState.map((item, index) =>
  //     index === position ? !item : item
  //   );
  //   setCheckedState(updatedCheckedState);
  // };


  const validateName = () => {
    for (let i=0; i<getproj.length; i++){
      if(getproj[i].project_name === name){
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
          helperText={errormsg ? "Project name already exists !" : "Available"}
          onInput={(e) => {
            setName(e.target.value)
            validateName()
            }}/>

      {/* <TextField 
          label="Description"
          variant="filled" 
          fullWidth
          required value={wiki}
          onChange={e => setWiki(e.target.value)}/> */}

      <div className={classes.ckeditorwidth}>
      <h4>Description</h4>
      <br />
      <CKEditor
          editor={ ClassicEditor }
          onReady={(editor) => {
            // You can store the "editor" and use when it is needed.
            // console.log('Editor is ready to use!', editor);
          }}
          data=""
          onChange={(event, editor) => {
            const data = editor.getData();
            setWiki(data);
            console.log(data);
            console.log(wiki)
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
              
              {/* <Checkbox checked={checkedState[index]} onChange={handleCheckBox(index)} /> */}
              {username}
							{/* <ListItemText primary={option.username} /> */}
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


export const AddProject = ({ open, handleClose, getproj, setGetproj }) => {

  return (
    <Dialog width='100%' open={open} onClose={handleClose}>
      <Form getproj={getproj} setGetproj={setGetproj} handleClose={handleClose} />
    </Dialog>
  );

};