import React from "react";
import { User } from "../../shared/utils";
import { Col, Input, Row } from "antd";
import "./index.scss"

interface ChatScreenProps {
  currentUser: User;
}

const ChatScreen = ({ currentUser }: ChatScreenProps) => {
  const { name } = currentUser;
  return (
    <div className="chat-main-container">
      <Row className="h-100">
        <Col xl={24} className="chat-header">
          <h2>{name}</h2>
          <div></div>
        </Col>
        <Col className="chat-page-container">
          <Input placeholder="Enter a message" className="input-box"/>
        </Col>
      </Row>
    </div>
  );
};

export default ChatScreen;
