import Dialog from '@material-ui/core/Dialog';
import { Button, Typography, Box } from "@material-ui/core"
import axios from 'axios';
import http from './axios.js';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react'
import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';


export const DeleteComment = ({ open, handleClose, comment }) => {

  const {proj_id, list_id, card_id} = useParams();
  const history = useHistory()

  const deletecomment = () => {
    http.delete(`/gotasks/projects/${proj_id}/lists/${list_id}/cards/${card_id}/comments/${comment.id}`)
    .then(res=>{
      console.log("comment deleted")
      handleClose();
    }
    ).catch(err => {
      console.log(err, "cannot delete the comment")
    })
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
        Are you sure you want to delete this comment ?
      </Typography>
      <Box 
      pt="20px" 
      pb="20px"
      width="100%"      
      display="flex"
      justifyContent="space-evenly"
      alignItems="center"
      >
      <Button onClick={()=>{
        handleClose()
      }} 
      variant="outlined" startIcon={<CancelIcon />} disableElevation>Cancel</Button>
      <Button onClick={deletecomment} variant="contained" startIcon={<DeleteIcon />} disableElevation>Delete</Button>
      </Box>
      </Box>
    </Dialog>
  );
};