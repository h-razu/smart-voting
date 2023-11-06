import React, { useContext } from "react";
import userImg from "../../../images/user.png";
import { useNavigate } from "react-router-dom";
import { authProvider } from "../../../Context/AuthContext/AuthContext";

const Header = () => {
  const { setLoggedCenter, admin, setAdmin, loggedPresidingOfficer, setLoggedPresidingOfficer, setIsPresidingOfficer } = useContext(authProvider);

  const navigate = useNavigate();

  const handleLogout = () => {
    if (admin) {
      // console.log("admin");
      localStorage.removeItem("admin");
      setAdmin(null);
    } else {
      // console.log("officer");
      localStorage.removeItem("officer");
      localStorage.removeItem("center");
      localStorage.removeItem("status");
      setLoggedPresidingOfficer(null);
      setLoggedCenter(null);
      setIsPresidingOfficer(false);
    }

    navigate("/smart-voting", { replace: true });
  };

  return (
    <div className="navbar bg-base-100 shadow-md justify-between lg:justify-evenly z-10 ps-16">
      <label htmlFor="dashboard-drawer" tabIndex={2} className="btn btn-ghost lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
        </svg>
      </label>
      <div className="w-full">
        <div className="text-2xl font-bold cursor-pointer" style={{ fontFamily: "Redressed", fontSize: "50px" }}>
          Smart Voting
        </div>
      </div>
      <div className="flex-none gap-2">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <img className="w-10 h-10 p-1 rounded-full ring-2 ring-gray-400" src={userImg} alt="Bordered avatar" />
          </label>
          <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
            <li>{admin?.length > 0 ? admin : loggedPresidingOfficer}</li>
            <li>
              <div className="divider"></div>
            </li>
            <li>
              <button className="btn btn-ghost" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
