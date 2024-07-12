import './App.css';
import React from "react";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import QuestionList from "./components/Questions/QuestionList";
import PostQuestion from "./components/Questions/PostQuestion";
import QuestionDetail from "./components/Questions/QuestionDetail";
import ChatPage from './components/Chat Pages/ChatPage';
import SenderPage from './components/Chat Pages/SenderPage';
import PrivateRoute from "./utils/PrivateRoute";
import Navbar from "./Navbar";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import TopBar from "./components/TopBar";
import SocialLogin from "./components/Auth/SocialLogin";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Home from "./components/Home/Home";
import Profile from './components/Profile/Profile'
import MainHomeRoute from './components/mainHome/mainHomeRoute';
import QuestionRoute from './components/QuestionPage/QuestionRoute';
import QuestionDetailsRoute from './components/QuestionDetails/QuestionDetailsRoute';
import UserProfile from './Admin/pages/userProfile';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Chat from './components/chatComponent/Chat';
// import AskQuestionPost from './components/AskQuestion/AskQuestionRoute';


function App() {
  return (
    <div className="App">
      {/* <Navbar /> */}
      {/* <Home/> */}
      {/* <PostQuestion /> */}
    {/* <SocialLogin /> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainHomeRoute />}></Route>
          <Route path="/myquestions" element={<QuestionRoute />}></Route>
          <Route path="/questionDetails" element={<QuestionDetailsRoute />}></Route>
          {/* <Route path="/postquestion" element={<AskQuestionPost />}></Route> */}
          <Route path="/postquestion" element={<Home />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/sociallogin" element={<SocialLogin />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/questions/:id" element={<QuestionDetail />} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/otherProfile" element={<UserProfile/>} />
          <Route path="/chatPage" element={<ChatPage/>} />
          <Route path="/senderpage" element={<SenderPage/>} />
          <Route path="/chat" element={<Chat/>} />

        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </div>
  );
}

export default App;
