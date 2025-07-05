// src/Components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

// Helper to validate the user object structure
const isUserValid = (user) => {
  return user && user.token && user.user && user.user._id;
};

// User Protected Route
export const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  return isUserValid(user) ? children : <Navigate to="/login" />;
};

// Admin Protected Route
export const AdminProtectedRoute = ({ children }) => {
  const admin = JSON.parse(localStorage.getItem("admin"));
  return admin && admin.token ? children : <Navigate to="/admin/login" />;
};


export default ProtectedRoute;
