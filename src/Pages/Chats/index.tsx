import { Col, Row } from "antd";
import React, { useState } from "react";
import "./index.scss";
import Header from "../../components/Header";
import { User, userInitialState } from "../../shared/utils";
import ChatScreen from "../../components/ChatScreen";

const Chats = () => {
  const [currentUser, setCurrentUser] = useState<User>(userInitialState);
  return (
    <div className="chat-container">
      <Row className="header row-top p-x-20">
        <Col>
          <Header setCurrentUser={setCurrentUser} />
        </Col>
      </Row>
      <Row className="content-container">
        <Col className="chat-list-container" xl={8} xxl={8}></Col>
        <Col className="chat-screen-container" xl={15} xxl={15}>
          <ChatScreen currentUser={currentUser} />
        </Col>
      </Row>
    </div>
  );
};

export default Chats;
