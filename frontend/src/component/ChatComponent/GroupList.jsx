import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import NewContact from "../NewContact";
import NewGroup from "../NewGroup";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import ChatSidebarNav from "./ChatSidebarNav";
import Badge from '@mui/material/Badge';


import { server, AuthContext } from "../../context/UserContext";
import { Box } from "@mui/material";

const GroupList = ({ chats, handleChatClick, selectedChat }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const { isAuthenticated } = useContext(AuthContext);
  const [addContact, setAddContact] = useState(false);
  const [createGroup, SetCreateGroup] = useState(false);

  const handleAddContact = () => {
    SetCreateGroup(false);
    setOpen(true);
    setAddContact(true);
  };

  const handleCreateGroup = () => {
    setAddContact(false);
    SetCreateGroup(true);
    setOpen(true);
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
    console.log(chats);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="chat-users">
      {/* <GroupManage/>       */}
      {/* <Stack direction="row" spacing={2} sx={{ mx: "auto", mt: 2, width: 300 }}>
        <Button variant="outlined" onClick={handleAddContact}>
          Add Contact
        </Button>
        <Button variant="outlined" onClick={handleCreateGroup}>
          Create Group
        </Button>
      </Stack> */}

      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{
            component: "form",
            onSubmit: (event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries(formData.entries());
              const email = formJson.email;
              console.log(email);
              handleClose();
            },
          }}
        >
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
          {addContact && <NewContact />}
          {createGroup && <NewGroup />}
        </Dialog>
      </div>
      <Box>
        <ChatSidebarNav />
        <List
          sx={{
            width: "100%",
            height: "calc(74vh)",
            overflowY: "auto",
            bgcolor: "background.paper",
          }}
        >
          {chats.map((chat, index) => (
            <ListItem
              key={index}
              alignItems="flex-start"
              className={`user ${selectedChat === chat ? "selected-chat" : ""}`}
              onClick={() => {
                handleChatClick(chat);
              }}
              divider
            >
              <ListItemAvatar>
                <Avatar alt={chat.groupName ? chat.groupName : "no name"} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <>
                    {chat.groupName ? chat.groupName : "no name"}{" "}
                    {chat.unreadMsgCount ? (
                      <Badge
                        badgeContent={chat.unreadMsgCount}
                        color="error"
                        sx={{float:"right", top: 20}}
                      ></Badge>
                    ) : (
                      ""
                    )}
                  </>
                }
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {chat.isGroupChat
                        ? chat.latestMessageSender
                          ? chat.latestMessageSender
                          : "You: "
                        : ""}
                    </Typography>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {chat.latestMessage
                        ? chat.latestMessage.length > 30
                          ? chat.latestMessage.slice(0, 50) + "..."
                          : chat.latestMessage
                        : ""}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </div>
  );
};

export default GroupList;
