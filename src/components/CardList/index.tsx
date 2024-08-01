import React from "react";
import { CardListProps, User } from "../../shared/utils";
import "../Header/index.scss"

const CardList: React.FC<CardListProps> = ({
  inputList,
  cardClickFunction,
}) => {
  return (
    <div className="d-flex card-container gap-10 border f-column p-y-20">
      {inputList.map((each: User, index) => {
        return (
          <div
            key={index}
            onClick={() => cardClickFunction(each)}
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
  );
};

export default CardList;
