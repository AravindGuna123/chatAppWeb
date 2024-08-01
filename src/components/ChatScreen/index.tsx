import React, { useEffect, useState } from "react";
import {
  ChatScreenProps,
  currentChatProps,
  messageProps,
  NotificationProps,
} from "../../shared/utils";
import { Button, Col, Input, Row, Spin } from "antd";
import "./index.scss";
import { createOrUpdateChat, fetchChat } from "../../shared/helper/url";
import {
  errorNotification,
  successNotification,
} from "../../shared/helper/functions";
import { get } from "lodash";
import { io, Socket } from "socket.io-client";
import { ChatState } from "../../context";
import "../Header/index.scss";
import { LoadingOutlined } from "@ant-design/icons";

const END_POINT = "http://localhost:5001";
let socket: Socket, selectedChatCompare: currentChatProps;

const ChatScreen = ({ currentUser, currentChat, isMobile, handleBackClick }: ChatScreenProps) => {
  const { name, _id: receiverId } = currentUser;
  const [message, setMessage] = useState("");
  const [chatId, setchatId] = useState("" || currentChat?.chatId);
  const [messageList, setMessageList] = useState<messageProps[]>([]);
  const [socketConnection, setSocketConnection] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, setNotifications } = ChatState();

  const handleEnter = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && message.length > 0) {
      const chatPayload = {
        chatName: currentChat?.chatName,
        message,
        receiverId: receiverId,
        users: currentChat?.users,
        senderId: user._id,
        senderName: user.name,
      };
      await createOrUpdateChat({ ...chatPayload })
        .then(() => {
          fetchMessages();
          setMessage("");
          successNotification("message sent successfully");
        })
        .catch((error: ErrorType) => console.log(error.message));
      socket.emit("new message", chatPayload);
    }
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      let results;
      if (chatId) {
        results = await fetchChat({ chatId });
      } else {
        results = await fetchChat({ receiverId });
      }
      socket.emit("join room", chatId);
      setchatId(get(results, "chatId", ""));
      setMessageList(get(results, "messagesAltered", []));
    } catch (error: ErrorType) {
      errorNotification(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      socket = io(END_POINT);
      socket.emit("setup", user);
      socket.on("connected", () => {
        setSocketConnection(true);
      });
    }
  }, [user]);

  useEffect(() => {
    setchatId(currentChat?.chatId);
  }, [currentChat]);

  useEffect(() => {
    if (receiverId || chatId) {
      fetchMessages();
      if (currentChat) {
        selectedChatCompare = currentChat;
      }
    }
  }, [receiverId, chatId]);

  useEffect(() => {
    if (user) {
      socket.on("message received", (newMessageReceived) => {
        if (
          !selectedChatCompare ||
          selectedChatCompare.chatName !== newMessageReceived.chatName
        ) {
          setNotifications((prev: NotificationProps[]) => [
            newMessageReceived,
            ...prev,
          ]);
        } else {
          setMessageList([...messageList, newMessageReceived]);
        }
      });
    }
  });

  const handleBackButton= ()=>{
    handleBackClick()
  }

  return (
    <div className="chat-main-container">
      <Row className="h-100">
        <Col xl={24} className="chat-header">
           {isMobile && (
              <Button onClick={handleBackButton} className="back-button">
                Back
              </Button>
            )}
          <h2>
            {currentChat && currentChat?.users?.length > 2
              ? currentChat?.chatName
              : name}
          </h2>
        </Col>
        <Col className="chat-page-container">
          <Col className="messages-container">
            {messageList.length > 0 &&
              messageList.map((each, index) => {
                return (
                  <div className="message-block" key={index}>
                    <div
                      className={`${
                        each.senderId === user._id
                          ? "sender-message-props"
                          : "receiver-message-props"
                      }`}
                    >
                      {currentChat && currentChat?.users?.length > 2 && (
                        <p className="m-0">∼ {each.senderName}</p>
                      )}
                      <p className="m-0">{each.message}</p>
                    </div>
                  </div>
                );
              })}
          </Col>
          <Input
            onKeyDown={(e) => handleEnter(e)}
            placeholder="Enter a message"
            className="input-box"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
        </Col>
      </Row>
    </div>
  );
};

export default ChatScreen;
