import "./App.css";
import React from "react";
// we use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
// we import all the components we need in our app
import NavBar from "./components/navbar";   // Use same casing as component
import PostList from "./components/postList";
import EditPost from "./components/postEdit";
import CreatePost from "./components/postCreate";
import Register from "./components/register";
import Login from "./components/login";

const App = () => {
  return (
    <div>
      <NavBar />
      <Routes>
        {/* In React Router v6, "exact" is no longer needed */}
        <Route path="/" element={<PostList />} />
        <Route path="/edit/:id" element={<EditPost />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
};

export default App;
