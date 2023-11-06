import React, { useContext, useEffect, useState } from "react";
import { authProvider } from "../../../Context/AuthContext/AuthContext";
import { Link } from "react-router-dom";
import useTitle from "../../../Context/useTitle/useTitle";
import LoadingSpinner from "../../Shared/LoadingSpinner/LoadingSpinner";

const VotersDisplay = () => {
  useTitle("Presiding Officer Dashboard");

  const { loggedCenter, state } = useContext(authProvider);

  const [center, setCenter] = useState([]);
  const [voters, setVoters] = useState([]);

  // console.log(loggedCenter);

  //get center operation
  useEffect(() => {
    const { contract } = state;

    const getCenterFromContract = async () => {
      let centersArray = [];

      const totalCenter = await contract.constituencyCenterContract?.getCenterLength();
      // console.log(totalCenter);
      const centerLength = totalCenter?.toNumber();

      for (let i = 0; i < centerLength; i++) {
        const data = await contract.constituencyCenterContract?.centers(i);
        // console.log(data);
        centersArray.push(data);
      }

      const cntName = centersArray?.filter((center) => center.centerID.toNumber() === loggedCenter);
      // console.log(cntName[0]);
      setCenter(cntName[0]);
    };
    loggedCenter && contract && getCenterFromContract();
  }, [state, loggedCenter]);

  //get constituency and center wise voter
  useEffect(() => {
    const { contract } = state;

    const fetchVoterInfo = async () => {
      const index = await contract.votersInfoContract?.constituencyAndCenterWiseVoterIndex(loggedCenter);
      // console.log(index);

      let votersArray = [];

      for (let i = 0; i < index?.length; i++) {
        // console.log(index[i].toNumber());
        const data = await contract.votersInfoContract?.voters(index[i].toNumber());
        // console.log(data);
        votersArray.push(data);
      }
      setVoters(votersArray);
    };

    loggedCenter && contract && fetchVoterInfo();
  }, [state, loggedCenter]);

  const castingVoteActionHandler = (_nid) => {
    console.log(_nid);
    localStorage.setItem("voter", JSON.stringify(_nid));

    setTimeout(() => {
      window.location.reload();
    }, 10000);
  };

  if (voters?.length === 0) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  return (
    <div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-start flex-col p-4">
            <div className="font-normal">
              Constituency Name: <span className="font-semibold">{center?.constituencyName}</span>
            </div>
            <div className="font-normal">
              Center Name: <span className="font-semibold">{center?.centerName}</span>
            </div>
            <div className="font-normal">
              Total Voters: <span className="font-semibold">{voters?.length}</span>
            </div>
          </div>
          <div className="relative"></div>
        </div>
        <table id="centerVoterTable" className="w-full text-base text-left text-gray-500">
          <thead className="text-base text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                SN.
              </th>
              <th scope="col" className="px-6 py-3">
                NID No.
              </th>
              <th scope="col" className="px-6 py-3">
                Image & Name
              </th>
              <th scope="col" className="px-6 py-3">
                Father & Mother
              </th>
              <th scope="col" className="px-6 py-3">
                Voting Status
              </th>
            </tr>
          </thead>
          <tbody>
            {voters?.map((voter, i) => (
              <tr className="border-b hover:bg-gray-50" key={i}>
                <td className="px-6 py-4">
                  <div className="font-semibold">{i + 1}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-semibold">{voter.NID.toNumber()}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img src={voter?.imageURL} alt="Avatar Tailwind CSS Component" />
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold">{voter.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="pl-3">
                    <div className="font-normal text-gray-500">{voter.fatherName}</div>
                    <div className="font-normal text-gray-500">{voter.motherName}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {/* <!-- Modal toggle --> */}
                  {voter?.votingStatus ? (
                    <label type="button" className="text-md font-semibold text-red-700">
                      Voted
                    </label>
                  ) : (
                    <Link to="/smart-voting/castingVote" target="_blank">
                      <label
                        type="button"
                        className="text-md font-bold text-green-700  hover:underline hover:cursor-pointer"
                        onClick={() => castingVoteActionHandler(voter?.NID.toNumber())}
                      >
                        Yet to Vote
                      </label>
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VotersDisplay;
