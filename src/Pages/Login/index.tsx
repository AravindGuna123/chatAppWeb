import React, { useEffect } from "react";
import { Col, Row, Tabs, TabsProps } from "antd";
import LoginContent from "./login-content";
import Register from "../Register";
import "./index.scss";
import { getLocalStorage } from "../../shared/utils";
import { useNavigate } from "react-router-dom";

const onChange = (key: string) => {
  console.log(key);
};

const items: TabsProps["items"] = [
  {
    key: "1",
    label: "Login",
    children: <LoginContent />,
  },
  {
    key: "2",
    label: "Sign up",
    children: <Register />,
  },
];

const Login = () => {
  const userId = getLocalStorage("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      navigate("/");
    }
  }, []);

  return (
    <Row className="login" gutter={[0,16]}>
      <Col className="title-container" sm={14} md={14} xl={12} xxl={14}>
        <h1>Welcome to Chat App</h1>
      </Col>
      <Col className="content-container custom-scroll-bar" sm={14} md={14} xl={12} xxl={14}>
        <Tabs
          tabBarStyle={{
            display: "flex",
            justifyContent: "space-between",    
          }}
          size="large"
          centered
          defaultActiveKey="1"
          items={items}
          onChange={onChange}
        />
      </Col>
    </Row>
  );
};

export default Login;
