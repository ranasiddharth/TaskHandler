import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import { TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import { useState, useEffect } from 'react';


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),
'& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '300px',
    },
'& .MuiButtonBase-root': {
      margin: theme.spacing(2),
    },
  },
}));


const Form = ({ handleClose }) => {

  const classes = useStyles()
  const [name, setName] = useState('');
  const [wiki, setWiki] = useState('');
  const [members, setMembers] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    console.log(name, wiki);

    handleClose();
  };

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <TextField label="Name" variant="filled" required value={name}
        onChange={e => setName(e.target.value)}/>
      <TextField label="Description" variant="filled" required value={wiki}
        onChange={e => setWiki(e.target.value)}/>

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