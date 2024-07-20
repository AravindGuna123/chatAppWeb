import React, { useEffect, useRef, useState } from "react";
import "./index.scss";
import { Button, Drawer, Input, InputRef, Spin } from "antd";
import { getAllUsers } from "../../shared/helper/url";
import { get } from "lodash";
import { LoadingOutlined } from "@ant-design/icons";
import {
  errorNotification,
  successNotification,
} from "../../shared/helper/functions";
import { User } from "../../shared/utils";

const { Search } = Input;

interface HeaderProps {
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>;
}

const Header = ({ setCurrentUser }: HeaderProps) => {
  const [showSider, setShowSider] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [usersList, setUsersList] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<InputRef>(null);

  useEffect(() => {
    if (showSider && inputRef.current) {
      inputRef.current.focus();
    }
    setUsersList([]);
    setSearchValue("");
  }, [showSider]);

  const handleGo = async () => {
    try {
      setLoading(true);
      const results = await getAllUsers({ searchValue });
      setUsersList(get(results, "usersList", []));
      successNotification("Users Fetched successsfully");
    } catch (error) {
      errorNotification("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (each: User) => {
    setCurrentUser(each);
    setShowSider(false);
  };

  return (
    <>
      <Search
        placeholder="Search Users"
        onKeyDown={() => setShowSider(true)}
        style={{ width: 200 }}
      />
      <Drawer
        title="Search Users"
        placement={"left"}
        closable={false}
        onClose={() => setShowSider(false)}
        open={showSider}
        key={"left"}
      >
        <Spin
          spinning={loading}
          indicator={<LoadingOutlined spin />}
          size="large"
        >
          <div className="d-flex gap-10">
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              ref={inputRef}
            />
            <Button onClick={handleGo}>Go</Button>
          </div>
          {usersList && (
            <div className="d-flex gap-10 border f-column p-y-20">
              {usersList.map((each: User) => {
                return (
                  <div
                    onClick={() => handleUserClick(each)}
                    className="d-flex gap-10 user-container"
                  >
                    <img src={each.pic} className="profile-pic" />
                    <div className="d-flex f-column gap-0">
                      <p>{each.name}</p>
                      <p>Email : {each.email}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Spin>
      </Drawer>
    </>
  );
};

export default Header;
