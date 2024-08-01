import { Dispatch, ReactNode, SetStateAction } from "react";

export const setLocalStorage = (key: string, data: string): void => {
    localStorage.setItem(key, data);
  };
  
  export const getLocalStorage = (key: string): string | null => {
    return localStorage.getItem(key);
  };

  declare global {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type ErrorType = Error | any;
  }

export interface User {
    name: string;
    email: string;
    pic: string;
    _id:string;
}
export interface CardListProps {
  inputList: User[];
  cardClickFunction: (user: User) => void;
}

export interface currentChatProps{
  chatName: string;
  chatId : string;
  users : User[]
}
export interface ChatScreenProps {
  currentUser: User;
  currentChat? : currentChatProps;
  isMobile: boolean;
  handleBackClick: () => void;
}


export interface messageProps{
  message: string;
  senderId: string;
  messageId: string;
  senderName: string;
  senderMail: string;
}

export interface NotificationProps {
  chatName: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  message: string;
  users: User[];
  _id: string;
  isGroupChat:boolean;
  latestMessage: {
    sender:User,
    content: string;
  }
}

export interface UserContextProps {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  notifications: NotificationProps[];
  setNotifications: Dispatch<SetStateAction<NotificationProps[]>>;
}

export interface UserContextProviderProps {
  children: ReactNode;
}

export const userInitialState = {
  name: "",
  email: "",
  pic: "",
  _id:""
}
