import { Col, Input, Form, Button, Upload } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ObjectType } from "../../shared/types";
import { ValidationMessages } from "../../shared/helper/constants";
import {
  errorNotification,
  successNotification,
} from "../../shared/helper/functions";
import { registerUser } from "../../shared/helper/url";
import { UploadOutlined } from "@ant-design/icons";

const { REGISTRATION_SUCCESS } = ValidationMessages;

const Register = () => {
  const [formData, setFormData] = useState<ObjectType>({});
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const {
      target: { name, value },
    } = e;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (info: ObjectType) => {
      setFormData((prev) => ({ ...prev, imageUrl: info.fileList }));
  };

  const handleClick = async (): Promise<void> => {
    try {
      setLoading(true);
      await registerUser(formData).then(() => {
        navigate("/login");
        successNotification(REGISTRATION_SUCCESS);
        setLoading(false);
      });
    } catch (err: ErrorType) {
      errorNotification(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="custom-scroll-bar login-form-container">
      <Col xs={24} sm={24} md={24}>
        <Form
          form={form}
          onFinish={handleClick}
          initialValues={{ remember: true }}
          scrollToFirstError
        >
          <div className="login-form">
            <Form.Item
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please enter your name!",
                },
              ]}
            >
              <div className="input-group">
                <Input
                  className={"agro-form-input"}
                  value={formData?.name}
                  onChange={handleChange}
                  type="name"
                  name="name"
                  autoComplete="off"
                />
                <label
                  className={`input-label ${
                    formData?.name?.length > 0 && "active"
                  }`}
                >
                  Name
                </label>
              </div>
            </Form.Item>
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
            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please confirm your Password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The two passwords do not match!")
                    );
                  },
                }),
              ]}
              className="form-outer"
            >
              <div className="input-group">
                <Input.Password
                  onChange={handleChange}
                  value={formData?.confirmPassword}
                  name="confirmPassword"
                  className="login-input"
                  autoComplete="new-password"
                />
                <label
                  className={`input-label ${
                    formData?.confirmPassword?.length > 0 && "active"
                  }`}
                >
                  Confirm Password
                </label>
              </div>
            </Form.Item>
            <Form.Item
              name="image"
              valuePropName="fileList"
              getValueFromEvent={(e) => e?.fileList}
            >
              <Upload
                name="image"
                listType="picture"
                className="upload-list-inline"
                accept=".jpg,.jpeg"
                multiple={false}
                beforeUpload={() => false}
                onChange={handleImageUpload}
              >
                <Button icon={<UploadOutlined />}>Upload JPEG Image</Button>
              </Upload>
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
                Sign up
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Col>
    </div>
  );
};

export default Register;
