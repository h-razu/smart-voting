import React from "react";
import { Link, Outlet } from "react-router-dom";
import Header from "../../Pages/Shared/Header/Header";

const PresidingOfficerLayout = () => {
  return (
    <div>
      <Header></Header>
      {/* drawer  */}
      <div className="drawer drawer-mobile">
        <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content bg-[#F1F5F9]">
          <Outlet></Outlet>
        </div>
        <div className="drawer-side">
          <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
          <ul className="menu p-2 w-80 lg:mt-1 text-base-content">
            <li>
              <Link to="/smart-voting/presidingOfficer">
                <span className="font-bold">Voters</span>
              </Link>
            </li>
            <li>
              <Link to="/smart-voting/presidingOfficer/verifyVoter">
                <span className="font-bold">Verify Voter</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PresidingOfficerLayout;
