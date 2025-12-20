import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return React.createElement(Navigate, {
      to: "/signIn",
      replace: true,
    });
  }

  return React.createElement(Outlet);
};

export default ProtectedRoute;
