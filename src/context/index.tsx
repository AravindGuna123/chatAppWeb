import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { getLocalStorage, NotificationProps, User, UserContextProps, UserContextProviderProps } from "../shared/utils";
import { useNavigate } from "react-router-dom";


const UserContext = createContext<UserContextProps | null>(null);

const UserContextProvider = ({ children }: UserContextProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfoString = getLocalStorage("userInfo");
    if (userInfoString) {
      try {
        const userInfo = JSON.parse(userInfoString);
        setUser(userInfo);
      } catch (error) {
        console.error("Error parsing user info:", error);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <UserContext.Provider
      value={{ user, setUser, notifications, setNotifications }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(UserContext);
};

export { UserContextProvider, UserContext };
