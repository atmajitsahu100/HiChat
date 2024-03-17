import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import { server, AuthContext } from "../../context/UserContext";

import { FileShareMenu } from "./FileShareMenu";
import { FileSendPopUp } from "./FileSendPopUp";
import ZegoCloud from "./ZegoCloud";
import { ChatTextInput } from "./ChatTextInput";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { Grid, Avatar, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import Badge from "@mui/material/Badge";

let socket;

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 22,
  height: 22,
  border: `2px solid ${theme.palette.background.paper}`,
}));

const GroupChatBox = ({
  messages,
  setMessages,
  myId,
  selectedChat,
  setChats,
  chats,
}) => {
  const [messageInput, setMessageInput] = useState("");
  const [file, setFile] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(!open);
  const handleClose = () => setOpen(false);
  const [popOpen, setPopOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  const messagesEndRef = useRef(null);

  const [calleeId, setCalleeId] = useState();

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  const handleCloseModal = () => {
    setPopOpen(false);
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    socket = io("http://localhost:4000");
    // setSocket(socketIO);
    socket.emit("setup", myId);
    socket.on("connected", () => setSocketConnected(true));

    socket.emit("join chat", selectedChat._id);

    const oth = selectedChat.users.find((id) => id != myId);
    setCalleeId(oth);
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessage) => {
      console.log(newMessage);
      if (
        !selectedChat || // if chat is not selected or doesn't match current chat
        selectedChat._id !== newMessage.chat
      ) {
        // console.log('new message recived : ', newMessage)
        // console.log('selectedChat : ', selectedChat)
        const updatedChats = chats.map((chat) => {
          if (chat._id === newMessage.chat) {
            const cnt = (chat.unreadMsgCount || 0) + 1;
            return {
              ...chat,
              unreadMsgCount: cnt,
              latestMessage: newMessage.content,
            };
          }
          return chat;
        });

        const index = updatedChats.findIndex(
          (chat) => chat._id === newMessage.chat
        );
        if (index !== -1) {
          const chatWithNewMessage = updatedChats.splice(index, 1)[0];
          updatedChats.unshift(chatWithNewMessage);
        }
        setChats(updatedChats);
      } else {
        setMessages([...messages, newMessage]);
      }
    });

    socket.on("file recieved", (imageData) => {
      if (imageData) {
        const imgElement = document.createElement("img");
        imgElement.src = imageData;

        // const newMsg = { type: 'img', content: imgElement };
        setMessages([...messages, imgElement]);

        // if (messageHeaderRef.current) {
        //   messageHeaderRef.current.appendChild(imgElement);
        // }
      }
    });
    console.log(messages);
  }, [messages, selectedChat, chats, setChats]);

  const handleDeleteMessage = async (messageId) => {
    try {
      // await axios.post(`${server}/deletemessage/${messageId}`,{userId});
      const response = await axios.post(
        `${server}/deletemessage`,
        { messageId: messageId, userId: myId },
        { withCredentials: true }
      );

      const updatedMessages = messages;
      setMessages(updatedMessages);

      socket.emit("message deleted", messageId);
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  const handleFileUpload = () => {
    console.log(Date.now());
    try {
      if (selectedFile) {
        const reader = new FileReader();

        reader.onload = async (e) => {
          const fileData = e.target.result;
          const filename = selectedFile.name;
          const chatId = selectedChat._id;

          const data = new FormData();

          data.append("file", selectedFile);
          data.append("myId", myId);
          data.append("chatId", chatId);
          data.append("type", selectedType);
          // data.append("fileUrl", fileUrl);
          data.append("messageInput", messageInput);

          const response = await axios.post(`${server}/sendFiles`, data);
          console.log(response);
          // socket.emit("file", {
          //   chatUsers: response.data.chatUsers,
          //   filename: filename,
          //   fileData: fileData,
          // });
          setFile(null);
        };
        reader.readAsDataURL(selectedFile);
      }
    } catch (error) {
      console.error("Error file sending: ", error);
    }
  };

  return (
    <>
      <div className="message-area">
        <div className="message-header">
          <Box sx={{ flexGrow: 1 }}>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Grid>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ alignItems: "center;" }}
                >
                  <StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                  >
                    <Avatar>H</Avatar>
                  </StyledBadge>
                  <Typography>{selectedChat.groupName}</Typography>
                </Stack>
              </Grid>
              <Grid>
                <ZegoCloud myId={myId} calleeId={calleeId} />
              </Grid>
            </Grid>
          </Box>
        </div>
        {!popOpen && (
          <div className="msg-inner-container">
            <div className="msg-body">
              <ul className="messageArea">
                {messages && messages.length > 0 ? (
                  <ul className="messageArea">
                    {messages.map((message, index) => (
                      <li
                        key={index}
                        className={
                          message.sender === myId
                            ? "own-message"
                            : "other-message"
                        }
                      >
                        <div className="message">
                          <p>{message.sender}</p>

                          {/* Render message content based on message type */}
                          {message.type === "text" && <p>{message.content}</p>}

                          {message.type === "audio" && (
                            <audio controls>
                              <source src={`${server}/fetchfile/${message.audioUrl}`} type="audio/mp3" />
                              Your browser does not support the audio element.
                            </audio>
                          )}

                          {message.type === "video" && (
                            <video controls>
                              <source src={message.videoUrl} type="video/mp4" />
                              Your browser does not support the video element.
                            </video>
                          )}

                          {message.type === "image" && (
                            <img src={`${server}/fetchfile/${message.imageUrl}`} alt="message" />
                          )}

                          {/* Render delete button only if sender is the current user */}
                          {message.sender === myId && (
                            <button
                              onClick={() => handleDeleteMessage(message._id)}
                              className="delete-message-btn"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                        <div className="timestamp">
                          <p className="message-timestamp">
                            {new Date(message.timestamp).toLocaleString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "numeric",
                                day: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                              }
                            )}
                          </p>
                        </div>
                      </li>
                    ))}
                    <div ref={messagesEndRef}> </div>
                  </ul>
                ) : (
                  <p className="messageArea">No chat available</p>
                )}
                {/* <div ref={messagesEndRef} /> */}
              </ul>
            </div>
            <div className="message-footer">
              <FileShareMenu
                popOpen={popOpen}
                setPopOpen={setPopOpen}
                handleCloseModal={handleCloseModal}
                setSelectedFile={setSelectedFile}
                setSelectedType={setSelectedType}
              />
              <ChatTextInput
                messageInput={messageInput}
                setMessageInput={setMessageInput}
                myId={myId}
                selectedChat={selectedChat}
                socket={socket}
                chats={chats}
                setChats={setChats}
                messages={messages}
                setMessages={setMessages}
              />

              {/* <div>
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleFileUpload}>Upload File</button>
        </div> */}
            </div>
          </div>
        )}

        {popOpen && (
          <FileSendPopUp
            fileType={selectedType}
            popOpen={popOpen}
            handleCloseModal={handleCloseModal}
            selectedFile={selectedFile}
            handleFileUpload={handleFileUpload}
          />
        )}
      </div>
    </>
  );
};

export default GroupChatBox;
