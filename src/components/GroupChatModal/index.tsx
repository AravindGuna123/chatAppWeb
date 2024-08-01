import { Button, Col, Input, Spin } from "antd";
import React, { useState } from "react";
import CardList from "../CardList";
import { createOrUpdateChat, getAllUsers } from "../../shared/helper/url";
import { debounce, get } from "lodash";
import { LoadingOutlined } from "@ant-design/icons";
import { User } from "../../shared/utils";
import { CloseOutlined } from "@ant-design/icons";
import {
  errorNotification,
  successNotification,
} from "../../shared/helper/functions";
import "./index.scss";

interface GroupUsersProps {
  name: string;
  id: string;
}
interface GroupChatModalProps {
  closeModal: () => void;
}

const GroupChatModal: React.FC<GroupChatModalProps> = ({ closeModal }) => {
  const [groupName, setGroupName] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [groupList, setGroupList] = useState<GroupUsersProps[]>([]);

  const fetchUsers = async (value: string) => {
    try {
      setLoading(true);
      const results = await getAllUsers({ searchValue: value });
      const usersList = get(results, "usersList", [])
      setUsersList(usersList);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFunction = debounce(fetchUsers, 1000);

  const handleUserSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUserSearch(value);
    debouncedFunction(value);
  };

  const handleSelectUser = (each: User) => {
    const userDetails = {
      name: each.name,
      id: each._id,
    };
    setGroupList((prev) => [...prev, userDetails]);
  };

  const handleUserDelete = (groupUser: GroupUsersProps) => {
    const filteredList = groupList.filter((each) => each.id !== groupUser.id);
    setGroupList([...filteredList]);
  };

  const handleOk = async () => {
    console.log(groupList.length);

    if (!groupName || groupList.length < 2) {
      errorNotification(
        "Please enter a group name and add more than one user."
      );
      return;
    }
    try {
      const userIdList = groupList.map((each) => {
        return {
          _id: each.id,
        };
      });
      const response = await createOrUpdateChat({
        chatName: groupName,
        users: userIdList,
      });
      const message = get(response, "message", "");
      successNotification(message);
      closeModal();
    } catch (error) {
      errorNotification("Failed to create group chat.");
    }
  };

  return (
    <Col className="d-flex f-column gap-10">
      <Input
        placeholder="Enter group name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />
      <Input
        placeholder="Search User"
        value={userSearch}
        onChange={(e) => handleUserSearch(e)}
      />
      {groupList.length > 0 && (
        <div className="d-flex gap-10">
          {groupList.map((each, index) => {
            return (
              <div
                key={index}
                className="d-flex gap-10 align-center group-user-block"
              >
                <p className="m-0">{each.name}</p>
                <span onClick={() => handleUserDelete(each)}>
                  <CloseOutlined />
                </span>
              </div>
            );
          })}
        </div>
      )}
      <Spin
        spinning={loading}
        indicator={<LoadingOutlined spin />}
        size="large"
      >
        {usersList && userSearch && (
          <>
            <CardList
              inputList={usersList}
              cardClickFunction={handleSelectUser}
            />
            {groupList.length>0 && <Button className="w-100" onClick={handleOk}>OK</Button>}
          </>
        )}
      </Spin>
    </Col>
  );
};

export default GroupChatModal;
