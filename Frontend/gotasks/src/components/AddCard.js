import React from "react";
import http from "./axios.js";
import Dialog from "@material-ui/core/Dialog";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import AddBoxIcon from "@material-ui/icons/AddBox";
import CancelIcon from "@material-ui/icons/Cancel";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams } from "react-router";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(2),
    "& .MuiTextField-root": {
      margin: theme.spacing(2),
      width: "100%",
    },
    "& .MuiButtonBase-root": {
      margin: theme.spacing(2),
    },
  },
  formControl: {
    minWidth: 100,
    width: "100%",
  },
  ckeditorwidth: {
    width: "100%",
  },
  datehead: {
    textAlign: "left",
    width: "100%",
    marginBottom: "5px",
  },
  datepicker: {
    width: "100%",
  },
}));

const Form = ({ handleClose, getcards, setGetcards, fetchCard }) => {
  const { proj_id, list_id } = useParams();

  const classes = useStyles();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [assigned, setAssigned] = useState([]);
  const [duedate, setDuedate] = useState(new Date());
  const [members, setMembers] = useState([]);
  const [errormsg, setErrormsg] = useState(false);
  const [err, setErr] = useState(false);
  const [duperr, setDuperr] = useState(false);
  const [mailer, setMailer] = useState(false);
  const [users, setUsers] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMailer(true);

    var formData = new FormData();

    formData.append("card_name", name);
    formData.append("description", desc);
    formData.append("assigned", assigned);
    formData.append("due_date", duedate);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        "X-CSRFToken": Cookies.get("csrftoken"),
        "X-Requested-With": "XMLHttpRequest",
      },
    };

    await axios
      .post(
        `http://127.0.0.1:8000/gotasks/projects/${proj_id}/lists/${list_id}/cards/`,
        formData,
        config
      )
      .then((res) => {
        setErr(false);
        setDuperr(false);
        setMailer(false);
        handleClose();
      })
      .catch((err) => {
        if (err.response.status === 403) {
          setErr(true);
          setMailer(false);
        }
        if (err.response.status === 500) {
          setDuperr(true);
          setMailer(false);
        }
        console.log(err);
      });
  };

  useEffect(async () => {
    http
      .get(`/gotasks/usershow/`)
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    await http
      .get(`/gotasks/projects/${proj_id}`)
      .then((res) => {
        setMembers(res.data.project_members);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    validateName();
  }, [name]);

  const validateName = () => {
    for (let i = 0; i < getcards.length; i++) {
      if (getcards[i].card_name === name) {
        setErrormsg(true);
        break;
      } else {
        setErrormsg(false);
      }
    }
  };

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <h3 style={{ color: "red" }}>
        {err
          ? "Card creation unsuccessful ! Available for only admins and project members."
          : ""}
      </h3>
      <h3 style={{ color: "red" }}>
        {duperr ? "Card with this name already exists" : ""}
      </h3>
      <h3 style={{ color: "black" }}>
        {mailer ? "Sending email to assignee...." : ""}
      </h3>
      <TextField
        label="Name"
        variant="filled"
        fullWidth
        required
        value={name}
        helperText={
          errormsg ? (
            <h4 style={{ color: "red" }}>Card name already exists !</h4>
          ) : (
            <h4 style={{ color: "green" }}>Available !</h4>
          )
        }
        onInput={(e) => {
          setName(e.target.value);
          validateName();
        }}
      />

      <TextField
        label="Description"
        variant="filled"
        fullWidth
        required
        value={desc}
        onChange={(e) => {
          setDesc(e.target.value);
        }}
      />

      <FormControl className={classes.formControl}>
        <InputLabel> Assign To </InputLabel>
        <Select
          fullWidth
          required
          value={assigned}
          onChange={(e) => setAssigned(e.target.value)}
        >
          {members.map((member, index) => {
            return users.map((user, index) => {
              if (user.id == member) {
                return (
                  <MenuItem key={index} value={user.id}>
                    {user.fullname}
                  </MenuItem>
                );
              }
            });
          })}
        </Select>
      </FormControl>

      <br />
      <div className={classes.datehead}>
        <h4>Due Date</h4>
      </div>

      <TextField
        variant="filled"
        type="datetime-local"
        fullWidth
        required
        value={duedate}
        onChange={(e) => {
          setDuedate(e.target.value);
        }}
      />

      <br />

      <div>
        <Button
          variant="contained"
          onClick={() => {
            setErr(false);
            setDuperr(false);
            setMailer(false);
            handleClose();
          }}
          startIcon={<CancelIcon />}
          disableElevation
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          startIcon={<AddBoxIcon />}
          disableElevation
        >
          Add
        </Button>
      </div>
    </form>
  );
};

export const AddCard = ({
  open,
  handleClose,
  getcards,
  setGetcards,
  fetchCard,
}) => {
  return (
    <Dialog width="100%" open={open} onClose={handleClose}>
      <Form
        getcards={getcards}
        setGetcards={setGetcards}
        fetchCard={fetchCard}
        handleClose={handleClose}
      />
    </Dialog>
  );
};
