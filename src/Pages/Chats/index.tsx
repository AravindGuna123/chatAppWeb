import { Button, Col, Modal, Row } from "antd";
import React, { useEffect, useState } from "react";
import "./index.scss";
import Header from "../../components/Header";
import {
  currentChatProps,
  NotificationProps,
  User,
  userInitialState,
} from "../../shared/utils";
import ChatScreen from "../../components/ChatScreen";
import { PlusIcon } from "../../assets/svg";
import GroupChatModal from "../../components/GroupChatModal";
import { ChatState } from "../../context";
import { getChatsList } from "../../shared/helper/url";
import { get } from "lodash";

const Chats = () => {
  const [currentUser, setCurrentUser] = useState<User>(userInitialState);
  const [currentChat, setCurrentChat] = useState<currentChatProps>({
    chatName: "",
    chatId: "",
    users: [],
  });
  const [showModal, setShowModal] = useState(false);
  const [chatsList, setChatsList] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [view, setView] = useState("chatsList");
  const { user } = ChatState();

  const fetchChats = async () => {
    const chats = await getChatsList({ userId: user._id });
    setChatsList(get(chats, "chatsList", []));
  };

  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 998);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChatClick = (chat: NotificationProps) => {
    const modifiedChat = {
      chatName: chat.chatName,
      chatId: chat._id,
      users: chat.users,
    };
    if (chat.users.length === 2) {
      chat.users.forEach((each: User) => {
        if (each._id !== user._id) {
          setCurrentUser(each);
        }
      });
    }
    setCurrentChat(modifiedChat);
    if (isMobile) setView("chatScreen");
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleBackClick = () => {
    setView("chatsList");
  };

  return (
    <div className="chat-container">
      <Row className="header row-top p-x-20">
        <Col className="w-100">
          <Header setCurrentUser={setCurrentUser} />
        </Col>
      </Row>
      <Row className="content-container">
        {(view === "chatsList" || !isMobile) && (
          <Col
            className="chat-list-container"
            xs={24}
            sm={24}
            md={24}
            xl={7}
            xxl={7}
          >
            <Col className="d-flex w-full align-center justify-space-between p-x-20">
              <h2>My Chats</h2>
              <Button
                className="group-chat-button"
                onClick={() => setShowModal(!showModal)}
              >
                Group Chat <img src={PlusIcon} />
              </Button>
            </Col>
            <Col className="d-flex f-column gap-10 p-10">
              {chatsList &&
                chatsList.map((chat: NotificationProps, index) => {
                  let chatName, pic;
                  if (chat.isGroupChat) {
                    chatName = chat.chatName;
                  } else {
                    const chatReceiver = chat.users.find(
                      (userDetails: User) => userDetails.name !== user.name
                    );

                    chatName = chatReceiver && chatReceiver.name;
                    pic = chatReceiver && chatReceiver.pic;
                  }
                  
                  return (
                    <div
                      key={index}
                      onClick={() => handleChatClick(chat)}
                      className="d-flex p-10 gap-10 user-container"
                    >
                      <img src={pic} className="profile-pic" />
                      <div className="d-flex f-column justify-space-between gap-0">
                        <p className="m-0 chat-name-props">{chatName}</p>
                        <p>
                          {chat.isGroupChat
                            ? `${chat.latestMessage.sender.name} : ${chat.latestMessage.content}`
                            : chat.latestMessage.content}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </Col>
          </Col>
        )}
        {(view === "chatScreen" || !isMobile) && (
          <Col className="chat-screen-container" md={24} xl={16} xxl={16}>
            <ChatScreen
              currentUser={currentUser}
              handleBackClick={handleBackClick}
              isMobile={isMobile}
              currentChat={currentChat}
            />
          </Col>
        )}
        <Modal
          title="Basic Modal"
          open={showModal}
          onCancel={() => setShowModal(false)}
          footer={null}
        >
          <GroupChatModal closeModal={closeModal} />
        </Modal>
      </Row>
    </div>
  );
};

export default Chats;
