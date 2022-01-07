import Dialog from "@material-ui/core/Dialog";
import { Button, Typography, Box } from "@material-ui/core";
import http from "./axios.js";
import { useParams } from "react-router";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import DeleteIcon from "@material-ui/icons/Delete";
import CancelIcon from "@material-ui/icons/Cancel";

export const DeleteList = ({ open, handleClose }) => {
  const { proj_id, list_id } = useParams();
  const history = useHistory();
  const [err, setErr] = useState(false);

  const listlocation = () => {
    history.push(`/gotasks/projects/${proj_id}/lists/`);
  };

  const Delete = () => {
    http
      .delete(`/gotasks/projects/${proj_id}/lists/${list_id}/`)
      .then(() => {
        setErr(false);
        handleClose();
        listlocation();
      })
      .catch((err) => {
        setErr(true);
      });
  };

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
          Are you sure you want to delete this list ?
        </Typography>
        <h3 style={{ color: "red" }}>
          {err
            ? "Deletion of list unsuccessful! Available for only admins and project members."
            : ""}
        </h3>
        <Box
          pt="20px"
          pb="20px"
          width="100%"
          display="flex"
          justifyContent="space-evenly"
          alignItems="center"
        >
          <Button
            onClick={() => {
              setErr(false);
              handleClose();
            }}
            variant="outlined"
            startIcon={<CancelIcon />}
            disableElevation
          >
            Cancel
          </Button>
          <Button
            onClick={Delete}
            variant="contained"
            startIcon={<DeleteIcon />}
            disableElevation
          >
            Delete
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};
