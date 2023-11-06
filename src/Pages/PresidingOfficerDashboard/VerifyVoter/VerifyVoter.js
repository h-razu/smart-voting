import React, { useContext, useEffect, useState } from "react";
import { authProvider } from "../../../Context/AuthContext/AuthContext";
import { Link } from "react-router-dom";
import useTitle from "../../../Context/useTitle/useTitle";

const VerifyVoter = () => {
  useTitle("Verify Voter");

  const { loggedCenter, state } = useContext(authProvider);

  const [center, setCenter] = useState(null);
  const [allCentersData, setAllCentersData] = useState([]);
  const [voter, setVoter] = useState(null);

  // console.log(loggedCenter);

  //get center operation
  useEffect(() => {
    const { contract } = state;

    const getCenterFromContract = async () => {
      let centersArray = [];

      const totalCenter = await contract.constituencyCenterContract?.getCenterLength();
      // console.log(typeof totalCenter.toNumber());
      const centerLength = totalCenter?.toNumber();

      for (let i = 0; i < centerLength; i++) {
        const data = await contract.constituencyCenterContract?.centers(i);
        // console.log(data);
        centersArray.push(data);
      }
      setAllCentersData(centersArray);

      const cntName = centersArray?.filter((center) => center.centerID.toNumber() === loggedCenter);
      // console.log(loggedCenter[0]);
      setCenter(cntName[0]);
    };
    loggedCenter && contract && getCenterFromContract();
  }, [loggedCenter, state]);

  // get voter data
  const getVoterData = async (event) => {
    event.preventDefault();

    const _nid = event.target.voterNID.value;
    // console.log(_nid);

    const { contract } = state;

    const data = await contract.votersInfoContract?.verifyVoterInfo(_nid);
    // console.log(data);
    setVoter(data);
    // console.log(voter);

    event.target.voterNID.value = "";
  };

  return (
    <div className="relative overflow-x-auto  sm:rounded-lg">
      <div className="flex items-center justify-between p-2">
        <div className="flex items-start flex-col">
          <div className="font-normal">
            Constituency Name: <span className="font-semibold">{center?.constituencyName}</span>
          </div>
          <div className="font-normal">
            Center Name: <span className="font-semibold">{center?.centerName}</span>
          </div>
        </div>
        <div className="relative">
          <form className="flex justify-center gap-3" onSubmit={getVoterData}>
            <div className="form-control w-full">
              <input type="number" className="input input-bordered mb-1" id="voterNID" required placeholder="Enter NID No." />
            </div>
            <button
              type="submit"
              className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 mb-1"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      {voter?.name ? (
        <div className="flex items-center justify-between px-4">
          <div class="flex justify-start text-left bg-blue-lightest mt-8">
            <div class="rounded flex text-grey-darkest">
              <div class="w-full flex justify-start flex-col">
                <div class="pb-0">
                  <p class="font-bold mb-1 text-grey-darkest">Name: {voter?.name}</p>
                </div>
                <div class="pb-0">
                  <h4 class="font-semibold mb-1 text-grey-darkest">NID: {voter?.NID.toNumber()}</h4>
                </div>
                <div class="text-normal font-semibold">Father Name: {voter?.fatherName}</div>
                <div class="text-normal font-semibold">Mother Name: {voter?.motherName}</div>
                <div class="text-normal font-semibold">Age: {voter?.age.toNumber()}</div>
                <div class="text-normal font-semibold">Gender: {voter?.gender}</div>

                <div class="text-normal font-semibold mt-4">
                  Constituency Name:
                  <span className="font-bold ps-2">
                    {allCentersData?.filter((c) => c.centerID.toNumber() === voter.centerID.toNumber())[0]?.constituencyName}
                  </span>
                </div>
                <div className="text-normal font-semibold">
                  Center Name:
                  <span className="font-bold ps-2">
                    {allCentersData?.filter((c) => c.centerID.toNumber() === voter.centerID.toNumber())[0]?.centerName}
                  </span>
                </div>
                <div className="mt-6">
                  {voter?.centerID.toNumber() === loggedCenter ? (
                    voter?.votingStatus ? (
                      <button type="button" className="text-white bg-red-700 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">
                        Voted
                      </button>
                    ) : (
                      <Link to="/smart-voting/castingVote" target="_blank">
                        <button
                          type="button"
                          className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
                          onClick={() => {
                            localStorage.setItem("voter", JSON.stringify(voter?.NID.toNumber()));

                            setTimeout(() => {
                              window.location.reload();
                            }, 2000);
                          }}
                        >
                          Cast Vote
                        </button>
                      </Link>
                    )
                  ) : (
                    <div>
                      <h1 className="text-3xl font-bold text-red-600">Not Listed in this Center!!!</h1>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div class="max-w-md bg-white border border-gray-200 rounded-lg shadow me-20">
            <img class="rounded" src={voter?.imageURL} alt="" />
          </div>
        </div>
      ) : (
        <div className="mt-12 p-12 text-red-600">
          <h1 className="text-4xl font-bold" style={{ fontFamily: "Redressed" }}>
            NO DATA TO SHOW
          </h1>
        </div>
      )}
    </div>
  );
};

export default VerifyVoter;
