import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';


export const FileSendPopUp = ({
  popOpen,
  handleCloseModal,
  selectedFile,
  handleFileUpload,
  fileType,
}) => {
  const fileUrl = URL.createObjectURL(selectedFile);
  const renderContent = () => {
    if (fileType === "image") {
      return <img className="sendFileView" src={fileUrl} alt="Image" />;
    } else if (fileType === "video") {
      return (
        <div>
          <video className="sendFileView" controls>
            <source src={fileUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    } else if (fileType === "audio") {
      return (
        <div>
          <audio  className="sendFileView" controls>
            <source src={fileUrl} type="audio/mp3" />
            Your browser does not support the audio tag.
          </audio>
        </div>
      );
    } else if (fileType === "document") {
      return (
        <>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            Open Document
          </a>
          ;
          <span data-icon="preview-generic" class="">
            <svg
              viewBox="0 0 88 110"
              height="110"
              width="88"
              preserveAspectRatio="xMidYMid meet"
              class=""
            >
              <title>preview-generic</title>
              <g transform="translate(4 3)">
                <path
                  stroke-opacity="0.08"
                  stroke="#000"
                  d="M3-.5h56.929a5.5 5.5 0 0 1 3.889 1.61l15.071 15.072a5.5 5.5 0 0 1 1.611 3.89V101a3.5 3.5 0 0 1-3.5 3.5H3A3.5 3.5 0 0 1-.5 101V3A3.5 3.5 0 0 1 3-.5z"
                  fill="#FFF"
                  fill-rule="evenodd"
                ></path>
              </g>
              <path
                d="M65.5 3.5v15a3 3 0 0 0 3 3h15"
                stroke-opacity="0.12"
                stroke="#000"
                fill="#FFF"
              ></path>
            </svg>
          </span>
          <div class="x1anpbxc x11i5rnm xyorhqc x1mh8g0r xngnso2">
            No preview available
          </div>
        </>
      );
    } else {
      return <div>Unsupported file type</div>;
    }
  };

  return (
    <>
      <Box
        sx={{
          position: "relative",
          bgcolor: "background.paper",
          boxShadow: 1,
          p: 2,
        }}
      >
        <CloseIcon onClick={handleCloseModal} variant="contained" sx={{ mt: 1, mb: 1 }}/>
        <Divider/>
        <div className="send-file-box">
          {renderContent()}
        </div>
        <Button variant="outlined" onClick={handleFileUpload} >
          Send
        </Button>
      </Box>
    </>
  );
};
