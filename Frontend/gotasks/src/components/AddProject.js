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
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import AddBoxIcon from "@material-ui/icons/AddBox";
import CancelIcon from "@material-ui/icons/Cancel";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

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
}));

const Form = ({ handleClose, getproj, setGetproj, fetchData }) => {
  const classes = useStyles();

  const [name, setName] = useState("");
  const [wiki, setWiki] = useState("");
  const [members, setMembers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [errormsg, setErrormsg] = useState(false);
  const [err, setErr] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    var formData = new FormData();
    formData.append("project_name", name);
    formData.append("project_wiki", wiki);

    selected.map((select) => {
      formData.append("project_members", select);
    });

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        "X-CSRFToken": Cookies.get("csrftoken"),
        "X-Requested-With": "XMLHttpRequest",
      },
    };
    await axios
      .post("http://127.0.0.1:8000/gotasks/projects/", formData, config)
      .then((res) => {
        setErr(false);
        handleClose();
      })
      .catch((err) => {
        if (err.response.status === 400) {
          setErr(true);
        }
        console.log(err);
      });
  };

  useEffect(() => {
    http
      .get("/gotasks/usershow")
      .then((res) => {
        setMembers(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    validateName();
  }, [name]);

  const validateName = () => {
    for (let i = 0; i < getproj.length; i++) {
      if (getproj[i].project_name === name) {
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
        {err ? "Project with this name already exists" : ""}
      </h3>
      <TextField
        label="Name"
        variant="filled"
        fullWidth
        required
        value={name}
        helperText={
          errormsg ? (
            <h4 style={{ color: "red" }}>Project name already exists !</h4>
          ) : (
            <h4 style={{ color: "green" }}>Available !</h4>
          )
        }
        onChange={(e) => {
          setName(e.target.value);
        }}
      />

      <div className={classes.ckeditorwidth}>
        <h4>Description</h4>
        <br />
        <CKEditor
          editor={ClassicEditor}
          onReady={(editor) => {
            // You can store the "editor" and use when it is needed.
            // console.log('Editor is ready to use!', editor);
          }}
          data=""
          onChange={(event, editor) => {
            const data = editor.getData();
            setWiki(data);
          }}
        />
      </div>
      <br />
      <FormControl className={classes.formControl}>
        <InputLabel> Members </InputLabel>
        <Select
          multiple={true}
          fullWidth
          required
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          {members.map(({ id, username, fullname }, index) => {
            return (
              <MenuItem key={id} value={id}>
                {fullname}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      <div>
        <Button
          variant="contained"
          onClick={() => {
            setErr(false);
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

export const AddProject = ({
  open,
  handleClose,
  getproj,
  setGetproj,
  fetchData,
}) => {
  return (
    <Dialog width="100%" open={open} onClose={handleClose}>
      <Form
        getproj={getproj}
        setGetproj={setGetproj}
        fetchData={fetchData}
        handleClose={handleClose}
      />
    </Dialog>
  );
};
