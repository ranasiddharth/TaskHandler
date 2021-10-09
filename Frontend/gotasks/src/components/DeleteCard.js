import Dialog from '@material-ui/core/Dialog';
import { Button, Typography, Box } from "@material-ui/core"
import axios from 'axios';
import http from './axios.js';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react'
import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';


export const DeleteCard = ({ open, handleClose }) => {

  const {proj_id, list_id, card_id} = useParams()
  const history = useHistory()
  const [err, setErr] = useState(false)
  const [mailer, setMailer] = useState(false);

  const listlocation = () => {
    // window.location.href = `http://localhost:3000/gotasks/projects/${proj_id}/lists/${list_id}/cards/`
    history.push(`/gotasks/projects/${proj_id}/lists/${list_id}/cards/`)
    
  }

  const Delete = () => {
    setMailer(true);
    http.delete(`/gotasks/projects/${proj_id}/lists/${list_id}/cards/${card_id}`)
    .then(() => {
      setErr(false)
      setMailer(false)
      console.log("delete successful")
      handleClose();
      listlocation();
    })
    .catch((err)=>{
      setErr(true);
      setMailer(false)
      console.log("delete unsuccessful")
    });
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <Box 
      p="20px"
      pt="30px"      
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      border="1.5px solid black"
      >
      <Typography variant="h6" component="div" gutterBottom>
        Are you sure you want to delete this card ?
      </Typography>
      <h3 style={{color:"red"}}>{err ? "Deletion of card unsuccessful! Available for only admins and project members." : ""}</h3>
      <h3 style={{color:"red"}}>{mailer ? "Sending deletion mail to assignee...." : ""}</h3>
      <Box 
      pt="20px" 
      pb="20px"
      width="100%"      
      display="flex"
      justifyContent="space-evenly"
      alignItems="center"
      >
      <Button onClick={()=>{
        setErr(false);
        setMailer(false);
        handleClose()
      }} 
      variant="outlined" startIcon={<CancelIcon />} disableElevation>Cancel</Button>
      <Button onClick={Delete} variant="contained" startIcon={<DeleteIcon />} disableElevation>Delete</Button>
      </Box>
      </Box>
    </Dialog>
  );

};