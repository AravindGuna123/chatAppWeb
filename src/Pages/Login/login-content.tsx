import { Button, Col, Form, Input } from "antd";
import React, { useState } from "react";
import { ObjectType } from "../../shared/types";
import {
  errorNotification,
  successNotification,
} from "../../shared/helper/functions";
import { ValidationMessages } from "../../shared/helper/constants";
import { loginUser } from "../../shared/helper/url";
import { get } from "lodash";
import { useNavigate } from "react-router-dom";
import { setLocalStorage } from "../../shared/utils";

const { LOGIN_SUCCESS } = ValidationMessages;

const LoginContent = () => {
  const [formData, setFormData] = useState<ObjectType>({});
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate=useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const {
      target: { name, value },
    } = e;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClick = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await loginUser(formData);
      const token = get(response, "accessToken", '');
      const userInfo = get(response, "userInfo", '');
      setLocalStorage('token', token);
      setLocalStorage('userInfo', JSON.stringify(userInfo));
      navigate('/')
      successNotification(LOGIN_SUCCESS);
      setLoading(false);
    } catch (err: ErrorType) {
      errorNotification(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="login-form-container">
      <Col xs={24} sm={24} md={24}>
        <Form form={form} onFinish={handleClick}>
          <div className="login-form">
            <Form.Item
              name="useremail"
              rules={[
                {
                  required: true,
                  message: "Please enter your User Email!",
                },
              ]}
            >
              <div className="input-group">
                <Input
                  className={"agro-form-input"}
                  value={formData?.email}
                  onChange={handleChange}
                  type="email"
                  name="email"
                  autoComplete="off"
                />
                <label
                  className={`input-label ${
                    formData?.email?.length > 0 && "active"
                  }`}
                >
                  User Email
                </label>
              </div>
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please enter your Password!",
                },
              ]}
              className="form-outer"
            >
              <div className="input-group">
                <Input.Password
                  onChange={handleChange}
                  value={formData?.password}
                  name="password"
                  className="login-input"
                  autoComplete="new-password"
                />
                <label
                  className={`input-label ${
                    formData?.password?.length > 0 && "active"
                  }`}
                >
                  Password
                </label>
              </div>
            </Form.Item>
          </div>
          <div className="login-form-button">
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="button-prop"
                loading={loading}
              >
                Log in
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Col>
    </div>
  );
};

export default LoginContent;
