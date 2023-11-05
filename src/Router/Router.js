import { createBrowserRouter } from "react-router-dom";
import AdminDashboard from "../Layout/AdminLayout/AdminDashboard";
import Error from "../Pages/Shared/Error/Error";
import Home from "../Pages/Home/Home";
import AllConstituency from "../Pages/Constituency/AllConstituency/AllConstituency";
import AllCenters from "../Pages/Center/AllCenters/AllCenters";
import AllVoters from "../Pages/Voters/AllVoters/AllVoters";
import AllCandidates from "../Pages/Candidates/AllCandidates/AllCandidates";
import AdminRoute from "../AuthRequired/AdminRoute/AdminRoute";
import CandidatesResult from "../Pages/Result/CandidatesResult/CandidatesResult";
import PresidingOfficerRoute from "../AuthRequired/PresidingOfficerRoute/PresidingOfficerRoute";
import PresidingOfficerLayout from "../Layout/PresidingOfficerLayout/PresidingOfficerLayout";
import VerifyVoter from "../Pages/PresidingOfficerDashboard/VerifyVoter/VerifyVoter";
import VotersDisplay from "../Pages/PresidingOfficerDashboard/VotersDisplay/VotersDisplay";
import CenterStatus from "../Pages/PresidingOfficerDashboard/CenterStatus/CenterStatus";
import CastingVote from "../Pages/PresidingOfficerDashboard/CastingVote/CastingVote";
import AllPresidingOfficers from "../Pages/PresidingOfficer/AllPresidingOfficers/AllPresidingOfficers";
import AllParty from "../Pages/Party/AllParty/AllParty";
import Statistics from "../Pages/Statistics/DisplayPage/Statistics";
import AddCandidate from "../Pages/AddCandidate/AddCandidate";
import AdminLogin from "../Pages/Login/AdminLogin/AdminLogin";
import PresidingOfficerLogin from "../Pages/Login/PresidingOfficerLogin/PresidingOfficerLogin";
import AllCitizen from "../Pages/AddVoter/AllCitizen/AllCitizen";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home></Home>,
    errorElement: <Error></Error>,
  },
  {
    path: "/adminLogin",
    element: <AdminLogin></AdminLogin>,
  },
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminDashboard></AdminDashboard>
      </AdminRoute>
    ),
    children: [
      {
        path: "/admin",
        element: (
          <AdminRoute>
            <AllCitizen></AllCitizen>
          </AdminRoute>
        ),
      },
      {
        path: "/admin/allConstituency",
        element: (
          <AdminRoute>
            <AllConstituency></AllConstituency>
          </AdminRoute>
        ),
      },
      {
        path: "/admin/allCenters",
        element: (
          <AdminRoute>
            <AllCenters></AllCenters>
          </AdminRoute>
        ),
      },
      {
        path: "/admin/allParty",
        element: (
          <AdminRoute>
            <AllParty></AllParty>
          </AdminRoute>
        ),
      },
      {
        path: "/admin/allVoters",
        element: (
          <AdminRoute>
            <AllVoters></AllVoters>
          </AdminRoute>
        ),
      },
      {
        path: "/admin/addCandidate",
        element: (
          <AdminRoute>
            <AddCandidate></AddCandidate>
          </AdminRoute>
        ),
      },
      {
        path: "/admin/allCandidates",
        element: (
          <AdminRoute>
            <AllCandidates></AllCandidates>
          </AdminRoute>
        ),
      },
      {
        path: "/admin/AllPresidingOfficers",
        element: (
          <AdminRoute>
            <AllPresidingOfficers></AllPresidingOfficers>
          </AdminRoute>
        ),
      },
      {
        path: "/admin/result",
        element: (
          <AdminRoute>
            <CandidatesResult></CandidatesResult>
          </AdminRoute>
        ),
      },
      {
        path: "/admin/statistics",
        element: (
          <AdminRoute>
            <Statistics></Statistics>
          </AdminRoute>
        ),
      },
    ],
  },
  {
    path: "/presidingOfficerLogin",
    element: <PresidingOfficerLogin></PresidingOfficerLogin>,
  },
  {
    path: "/presidingOfficer",
    element: (
      <PresidingOfficerRoute>
        <PresidingOfficerLayout></PresidingOfficerLayout>
      </PresidingOfficerRoute>
    ),
    children: [
      {
        path: "/presidingOfficer",
        element: (
          <PresidingOfficerRoute>
            <VotersDisplay></VotersDisplay>
          </PresidingOfficerRoute>
        ),
      },
      {
        path: "/presidingOfficer/verifyVoter",
        element: (
          <PresidingOfficerRoute>
            <VerifyVoter></VerifyVoter>
          </PresidingOfficerRoute>
        ),
      },
    ],
  },
  {
    path: "/castingVote",
    element: <CastingVote></CastingVote>,
  },
  {
    path: "/centerInactive",
    element: <CenterStatus></CenterStatus>,
  },
  {
    path: "*",
    element: <Error></Error>,
  },
]);

export default router;
