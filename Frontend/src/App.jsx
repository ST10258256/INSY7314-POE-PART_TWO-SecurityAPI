import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/navbar";

// Post pages are kept in repository but their imports/routes are commented out.
// Uncomment the imports and routes below to re-enable them.
// import PostList from "./components/PostList";
// import PostCreate from "./components/PostCreate";
// import PostEdit from "./components/PostEdit";

import Register from "./components/Register";
import Login from "./components/Login";

import Dashboard from "./pages/Dashboard";
import PaymentForm from "./pages/PaymentForm";
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <div>
      <Navbar />
      <main className="container my-4">
        <Routes>
          {/* Post routes are commented out to hide them without removing files */}
          {/*
            <Route path="/" element={<PostList />} />
            <Route path="/create" element={<PostCreate />} />
            <Route path="/edit/:id" element={<PostEdit />} />
          */}

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pay"
            element={
              <ProtectedRoute>
                <PaymentForm />
              </ProtectedRoute>
            }
          />

          {/* Set root to Login so users land on the authentication page */}
          <Route path="/" element={<Login />} />

          <Route path="*" element={<h2>404 - Not Found</h2>} />
        </Routes>
      </main>
    </div>
  );
}
