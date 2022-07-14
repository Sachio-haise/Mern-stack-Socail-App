import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/HOME/Home";
import Siderbar from "./components/Layout/SideBar/Siderbar";
import SignUp from "./components/SignUp/SignUp";
import EmailVerify from "./components/EmailVerfiy/EmailVerify";
import Post from "./components/POST/Post";
import Profile from "./components/Profile/Profile";
import PasswordReset from "./components/Password-reset/PasswordReset,";
import Verified from "./components/Verified/Verified";
import { IsAdmin, HasAuth } from "./Middleware/AuthMiddleware";
import Dashboard from "./components/Admin/Dashboard";
import Sidebar from "./components/Layout/Admin/Sidebar";

function App() {
  return (
    <div className="App">
      <>
        <Router>
          <Siderbar />

          <Routes>
            <Route path="/" element={<Home />} exact />
            <Route path="/verify/:token" element={<EmailVerify />} exact />
            <Route path="/user-profile" element={<Profile />} exact />
            <Route path="/reset-password" element={<PasswordReset />} exact />
            <Route path="/verified/:token" element={<Verified />} exact />
            <Route element={<HasAuth />}>
              <Route path="/auth" element={<SignUp />} exact />
            </Route>
            <Route element={<IsAdmin />}>
              <Route path="/dashboard" element={<Dashboard />} exact />
              <Route path="/dashboard-profile" element={<Profile />} exact />
            </Route>
          </Routes>
        </Router>
      </>
    </div>
  );
}

export default App;
