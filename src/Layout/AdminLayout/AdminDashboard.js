import { Link, Outlet } from "react-router-dom";
import Header from "../../Pages/Shared/Header/Header";

const AdminDashboard = () => {
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
          <ul className="menu p-2 w-70 lg:mt-1 text-base-content">
            <li>
              <Link to="/smart-voting/admin">
                <span className="font-bold"> Add Voter</span>
              </Link>
            </li>
            <li>
              <Link to="/smart-voting/admin/allConstituency">
                <span className="font-bold"> Manage Constituency</span>
              </Link>
            </li>
            <li>
              <Link to="/smart-voting/admin/allCenters">
                <span className="font-bold"> Manage Center</span>
              </Link>
            </li>
            <li>
              <Link to="/smart-voting/admin/allParty">
                <span className="font-bold">Manage Political Party</span>
              </Link>
            </li>
            <li>
              <Link to="/smart-voting/admin/allVoters">
                <span className="font-bold"> Manage Voters</span>
              </Link>
            </li>
            <li>
              <Link to="/smart-voting/admin/addCandidate">
                <span className="font-bold"> Add Candidate</span>
              </Link>
            </li>
            <li>
              <Link to="/smart-voting/admin/allCandidates">
                <span className="font-bold"> Manage Candidates</span>
              </Link>
            </li>
            <li>
              <Link to="/smart-voting/admin/AllPresidingOfficers">
                <span className="font-bold"> Manage Presiding Officer</span>
              </Link>
            </li>
            <li>
              <Link to="/smart-voting/admin/result">
                <span className="font-bold">Voting Result</span>
              </Link>
            </li>
            <li>
              <Link to="/smart-voting/admin/statistics">
                <span className="font-bold">Voting Statistics</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
