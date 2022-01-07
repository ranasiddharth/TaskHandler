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
  Box,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import UpdateIcon from "@material-ui/icons/Update";
import CancelIcon from "@material-ui/icons/Cancel";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useHistory, useParams } from "react-router";

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

const Form = ({ handleUpdateClose }) => {
  const { proj_id, list_id, card_id } = useParams();
  const history = useHistory();

  const classes = useStyles();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [assigned, setAssigned] = useState([]);
  const [duedate, setDuedate] = useState("");
  const [members, setMembers] = useState([]);
  const [lists, setLists] = useState([]);
  const [selectedlist, setSelectedlist] = useState(null);
  const [checked, setChecked] = useState(false);
  const [errormsg, setErrormsg] = useState(false);
  const [err, setErr] = useState(false);
  const [duperr, setDuperr] = useState(false);
  const [mailer, setMailer] = useState(false);
  const [users, setUsers] = useState([]);

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setMailer(true);

    var formData = new FormData();

    formData.append("card_name", name);
    formData.append("description", desc);
    formData.append("assigned", assigned);
    formData.append("list", selectedlist);
    formData.append("due_date", duedate);
    formData.append("is_completed", checked);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        "X-CSRFToken": Cookies.get("csrftoken"),
        "X-Requested-With": "XMLHttpRequest",
      },
    };

    await axios
      .put(
        `http://127.0.0.1:8000/gotasks/projects/${proj_id}/lists/${list_id}/cards/${card_id}/`,
        formData,
        config
      )
      .then((res) => {
        setErr(false);
        setDuperr(false);
        setMailer(false);
        handleUpdateClose();
        history.push(
          `/gotasks/projects/${proj_id}/lists/${selectedlist}/cards/${card_id}`
        );
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

    await http
      .get(`/gotasks/projects/${proj_id}/lists/`)
      .then((res) => {
        setLists(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    await http
      .get(`/gotasks/projects/${proj_id}/lists/${list_id}/cards/${card_id}/`)
      .then((res) => {
        setAssigned(res.data.assigned);
        setName(res.data.card_name);
        setDesc(res.data.description);
        setDuedate(res.data.due_date.slice(0, -1));
        setSelectedlist(res.data.list);
        setChecked(res.data.is_completed);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function handleCompleteChange(e) {
    setChecked(e.target.checked);
  }

  return (
    <form className={classes.root} onSubmit={handleUpdateSubmit}>
      <h3 style={{ color: "red" }}>
        {err
          ? "Updation of card unsuccessful! Available for only admins and project members."
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
        onInput={(e) => {
          setName(e.target.value);
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

      <FormControl className={classes.formControl}>
        <InputLabel> List </InputLabel>
        <Select
          fullWidth
          required
          value={selectedlist || ""}
          onChange={(e) => {
            setSelectedlist(e.target.value);
          }}
        >
          {lists.map((list, index) => {
            return (
              <MenuItem key={index} value={list.id}>
                {list.list_name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      <br />

      <TextField
        variant="filled"
        type="datetime-local"
        label="Due Date"
        fullWidth
        required
        value={duedate}
        onChange={(e) => {
          setDuedate(e.target.value);
        }}
      />

      <FormControlLabel
        style={{ alignSelf: "flex-start" }}
        control={
          <Checkbox
            style={{ margin: "0px", paddingRight: "3px" }}
            checked={checked}
            onChange={handleCompleteChange}
          />
        }
        label="Completion Status"
      />

      <div>
        <Button
          variant="contained"
          onClick={() => {
            setErr(false);
            setDuperr(false);
            setMailer(false);
            handleUpdateClose();
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
          startIcon={<UpdateIcon />}
          disableElevation
        >
          Add
        </Button>
      </div>
    </form>
  );
};

export const EditCard = ({ updateopen, handleUpdateClose }) => {
  return (
    <Dialog width="100%" open={updateopen} onClose={handleUpdateClose}>
      <Form handleUpdateClose={handleUpdateClose} />
    </Dialog>
  );
};
