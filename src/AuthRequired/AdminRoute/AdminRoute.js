import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authProvider } from "../../Context/AuthContext/AuthContext";

const AdminRoute = ({ children }) => {
  const { setAdmin } = useContext(authProvider);

  const location = useLocation();

  const data = JSON.parse(localStorage.getItem("admin"));

  if (data) {
    setAdmin(data);
    return children;
  }

  return <Navigate to="/smart-voting" state={{ from: location }} replace></Navigate>;
};

export default AdminRoute;
