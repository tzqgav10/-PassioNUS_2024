import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Main from "./components/Main";
import Signup from "./components/Signup";
import Login from "./components/Login";
import EmailVerify from "./components/EmailVerify";
import CreateProfile from "./components/CreateProfile";
import InterestsForm from "./components/Interests";
import Events from "./components/Events";
import CreateEvents from "./components/CreateEvents";
import ProfilePage from "./components/ProfilePage";
import ChangePassword from "./components/ChangePassword";
import SingleMatch from "./components/SingleMatching";
import MatchOptions from "./components/MatchOptions";
import GroupMatch from "./components/GroupMatching";
import Chat from "./components/Chat";
import StudyBuddy from "./components/StudyBuddy";

function App() {
  const user = localStorage.getItem("token");

  return (
    <Routes>
      {!user ? (
        <>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate replace to="/login" />} />
          <Route path="/students/:id/verify/:token" element={<EmailVerify />} />
        </>
      ) : (
        <>
          <Route path="/" element={<Layout />}>
            <Route index element={<Main />} />
            <Route path="create_profile" element={<CreateProfile />} />
            <Route path="interests" element={<InterestsForm />} />
            <Route path="home" element={<Main />} />
            <Route path="matching" element={<MatchOptions />} />
            <Route path="match_single" element={<SingleMatch />} />
            <Route path="match_group" element={<GroupMatch />} />
            <Route path="study" element={<StudyBuddy />} />
            <Route path="events" element={<Events />} />
            <Route path="create_event" element={<CreateEvents />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="chat" element={<Chat />} />
            <Route path="settings" element={<ChangePassword />} />
          </Route>
        </>
      )}
    </Routes>
  );
}

export default App;
