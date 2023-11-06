import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authProvider } from "../../Context/AuthContext/AuthContext";

const PresidingOfficerRoute = ({ children }) => {
  const { setLoggedCenter, setLoggedPresidingOfficer } = useContext(authProvider);

  const location = useLocation();

  setLoggedCenter(JSON.parse(localStorage.getItem("center")));

  const data = JSON.parse(localStorage.getItem("officer"));
  const centerStatus = JSON.parse(localStorage.getItem("status"));

  if (data && centerStatus) {
    setLoggedPresidingOfficer(data);

    return children;
  } else {
    localStorage.removeItem("officer");
    localStorage.removeItem("center");
    localStorage.removeItem("status");
    setLoggedPresidingOfficer(null);
    setLoggedCenter(null);
  }

  return <Navigate to="/smart-voting" state={{ from: location }} replace></Navigate>;
};

export default PresidingOfficerRoute;
