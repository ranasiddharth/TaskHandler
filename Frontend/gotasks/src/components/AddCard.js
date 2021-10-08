import React from 'react';
import http from './axios.js'
import Dialog from '@material-ui/core/Dialog';
import { TextField, Button, MenuItem, Select, FormControl, InputLabel, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import { Checkbox } from '@material-ui/core';
import { ListItemIcon, ListItemText } from '@material-ui/core';
import AddBoxIcon from '@material-ui/icons/AddBox';
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
  },
  datehead:{
    textAlign: "left",
    width: "100%",
    marginBottom: '5px'
  },
  datepicker:{
    width: "100%",
  }
}));


const Form = ({ handleClose, getcards, setGetcards, fetchCard }) => {

  const { proj_id, list_id } = useParams()

  const classes = useStyles()
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [assigned, setAssigned] = useState('');
  const [duedate, setDuedate] = useState(new Date());
  const [members, setMembers] = useState([]);
  // const [projmembers, setProjmembers] = useState([])
  // const [checkboxesState, setCheckboxesState] = useState(-1)
  const [errormsg, setErrormsg] = useState(false);
  const [err, setErr] = useState(false)
  const [duperr, setDuperr] = useState(false)


  const handleSubmit = async(e) => {
    e.preventDefault();
    // console.log(name, desc, assigned, duedate);
    // console.log(getcards)

    var formData = new FormData();

    formData.append("card_name", name);
    formData.append("description", desc);
    formData.append("assigned", assigned);
    formData.append("due_date", duedate);


    const config = {
      headers: {
        "Content-Type": 'multipart/form-data',
        'X-CSRFToken': Cookies.get("csrftoken"),
        'X-Requested-With': 'XMLHttpRequest'
      }
    }

    await axios.post(`http://127.0.0.1:8000/gotasks/projects/${proj_id}/lists/${list_id}/cards/`,
    formData, config)
    .then(res => {
      // console.log(res.data);
      // fetchCard();
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
        console.log("post same name card")
      }
      console.log(err)
    })

    // fetchCard();
    // handleClose();
  };

  useEffect(async() => {
    await http.get(`/gotasks/projects/${proj_id}`).then(
      (res) => {
        // console.log(res.data.project_members)
        setMembers(res.data.project_members)
        // console.log("hello",members)
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
    for (let i=0; i<getcards.length; i++){
      if(getcards[i].card_name === name){
        setErrormsg(true);
        break;
      }else{
        setErrormsg(false);
      }
    }
  }

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <h3 style={{color:"red"}}>{err ? "Card creation unsuccessful ! Available for only admins and project members." : ""}</h3>
      <h3 style={{color:"red"}}>{duperr ? "Card with this name already exists" : ""}</h3>
      <TextField 
          label="Name" 
          variant="filled" 
          fullWidth
          required value={name}
          helperText={errormsg ? "Card name already exists !" : "Available"}
          onInput={(e) => {
            setName(e.target.value)
            validateName()
          }}
      />

      <TextField 
          label="Description"
          variant="filled" 
          fullWidth
          required value={desc}
          onChange={(e) => {
            setDesc(e.target.value)
          }}
      />


      <FormControl className={classes.formControl}>
        <InputLabel> Assign To </InputLabel>
        <Select 
          // defaultValue = ""
          fullWidth
          required
          value={assigned}
          onChange = {(e) => 
            setAssigned(e.target.value)
          }
        >
          {members.map((member, index) => {
            return(
            <MenuItem key={index} value={member}>
              
              {/* <Checkbox checked={checkedState[index]} onChange={handleCheckBox(index)} /> */}
              {member}
							{/* <ListItemText primary={option.username} /> */}
            </MenuItem>
            )
          })}
        </Select>
      </FormControl>


      <br/>
      <div className={classes.datehead}>
        <h4>Due Date</h4>
      </div>

      {/* <div className={classes.datepicker}> */}
      {/* <DateTimePicker
        required
        className={classes.datepicker}
        onChange={
          (event) => 
          handleDueDateChange(event)
        } 
        selected={duedate}
      /> */}
      <TextField 
          variant="filled" 
          type="datetime-local"
          fullWidth
          required 
          value={duedate}
          onChange={(e) => {
            setDuedate(e.target.value)
          }}
      />
      
      {/* </div> */}
      <br />


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


export const AddCard = ({ open, handleClose, getcards, setGetcards, fetchCard }) => {

  return (
    <Dialog width='100%' open={open} onClose={handleClose}>
      <Form getcards={getcards} setGetcards={setGetcards} fetchCard={fetchCard} handleClose={handleClose} />
    </Dialog>
  );

};