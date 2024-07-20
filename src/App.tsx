import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./Pages/Login";
import "./styles/common.scss";
import Chats from "./Pages/Chats";
import PrivateRoute from "./shared/helper/privateRoute";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Chats />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
