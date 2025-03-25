import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CircularLoader from "../loaders/CircularLoader";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const checkAuth = () => {
      setLoading(false);
    };
    checkAuth();
    return () => {
      setLoading(false);
    };
  }, []);

  if (loading) {
    return <CircularLoader seconds={30} />;
  }

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
