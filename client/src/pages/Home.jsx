import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Navigate } from "react-router";

const Home = () => {
  const { authUser } = useAuthStore();
  if (!authUser) {
    return <Navigate to="/login" />;
  }
  return <div>Home</div>;
};

export default Home;
