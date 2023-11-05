import React, { useContext, useEffect, useState } from "react";
import { authProvider } from "../../../Context/AuthContext/AuthContext";
import { toast } from "react-hot-toast";
import useTitle from "../../../Context/useTitle/useTitle";
import LoadingSpinner from "../../Shared/LoadingSpinner/LoadingSpinner";

const CastingVote = () => {
  useTitle("Voter Window");

  const { state, setCastingProcess } = useContext(authProvider);

  const [candidates, setCandidates] = useState([]);
  const [voter, setVoter] = useState(null);
  const [currentConstituencyInfo, setCurrentConstituencyInfo] = useState(null);
  const [isCast, setIsCast] = useState(false);
  const [currentConstituencyID, setCurrentConstituencyID] = useState(null);
  const [loading, setLoading] = useState(false);

  //get data from local storage
  const voterNID = JSON.parse(localStorage.getItem("voter"));
  const loggedCenterID = JSON.parse(localStorage.getItem("center"));

  setCastingProcess(true);

  //get initial data
  useEffect(() => {
    const { contract } = state;

    const getInitialData = async () => {
      //---------------get current constituency and center info
      const currentConstituencyCenter = await contract.constituencyCenterContract?.getSpecificCenter(loggedCenterID);
      // console.log(currentConstituencyCenter);
      setCurrentConstituencyInfo(currentConstituencyCenter);

      //   ---------------------get all constituency info
      let constituencyArr = [];

      const totalConstituency = await contract.constituencyCenterContract?.getConstituencyLength();

      for (let i = 0; i < totalConstituency?.toNumber(); i++) {
        const data = await contract.constituencyCenterContract?.constituencies(i);
        // console.log(data);
        constituencyArr.push(data);
      }

      const __id = constituencyArr?.filter((con) => con.constituencyName === currentConstituencyCenter.constituencyName);
      setCurrentConstituencyID(__id[0]?.constituencyID.toNumber());

      //--------------get all voter list for mapping
      let votersArray = [];
      const totalVoters = await contract.votersInfoContract?.getLength();
      // console.log(totalVoters);

      for (let i = 0; i < totalVoters?.toNumber(); i++) {
        const data = await contract.votersInfoContract?.voters(i);
        // console.log(data);
        votersArray.push(data);
      }

      //---------------get candidates list
      const candidateNID = await contract.candidatesInfoContract?.getAllCandidateNID();

      let candidatesArr = [];

      for (let i = 0; i < candidateNID?.length; i++) {
        let data1 = await contract.candidatesInfoContract?.candidates(candidateNID[i].toNumber());
        // console.log(data1);

        const candidateData = votersArray?.filter((voter) => voter.NID.toNumber() === candidateNID[i].toNumber());
        // console.log(candidateData);

        candidatesArr.push({
          NID: candidateNID[i].toNumber(),
          Name: candidateData[0]?.name,
          photo: candidateData[0]?.imageURL,
          partyName: data1.partyName,
          symbolURL: data1.symbolURL,
          standingConstituency: [],
        });

        let totalStandingConstituency = await contract.candidatesInfoContract?.getStandingConstituencyLength(candidateNID[i].toNumber());

        for (let j = 0; j < totalStandingConstituency?.toNumber(); j++) {
          let data2 = await contract.candidatesInfoContract?.standingConstituencies(candidateNID[i].toNumber(), j);

          const constituencyID = data2?.constituencyID.toNumber();

          const constituency = constituencyArr?.filter((cons) => cons.constituencyID.toNumber() === constituencyID);
          // console.log(constituency);

          candidatesArr[i].standingConstituency.push(constituency[0]?.constituencyName);
        }
      }
      //   console.log(candidatesArr);
      const filteredData = candidatesArr?.filter((c) => c.standingConstituency.includes(currentConstituencyCenter?.constituencyName));
      //   console.log(filteredData);
      setCandidates(filteredData);

      //--------------get voter data
      const voterData = await contract.votersInfoContract?.verifyVoterInfo(voterNID);
      // console.log(voterData);
      setVoter(voterData);
    };

    loggedCenterID && contract && getInitialData();
  }, [state, loggedCenterID, voterNID]);

  //-------------------casting vote handler
  const castingVoteHandler = async (_candidateID) => {
    // console.log(_candidateID);
    // console.log(currentConstituencyID);
    // console.log(voterNID);

    const { contract } = state;
    setLoading(true);

    const result = await contract.candidatesInfoContract?.castVoteAction(_candidateID, currentConstituencyID);
    await result.wait();

    if (result.hash) {
      const res = await contract.votersInfoContract?.castVote(voterNID);
      await res.wait();

      if (res.hash) {
        toast.success("Vote Casting Successful");
        setIsCast(true);
        setLoading(false);

        setTimeout(() => {
          localStorage.removeItem("voter");
          setCastingProcess(false);
          window.close();
        }, 5000);
      } else {
        setLoading(false);
        toast.error("Transaction Failed....!!!");
      }
    } else {
      setLoading(false);
      toast.error("Transaction Failed....!!!");
    }
  };

  if (!voterNID || candidates.length === 0) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  if (loading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  return (
    <div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <h1
          className="my-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 lg:text-5xl
            text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400"
        >
          Cast Your Vote
        </h1>
        <div className="flex items-start flex-col p-4">
          <div className="font-normal text-xl">
            Constituency Name:
            <span className="font-semibold text-2xl ps-3">{currentConstituencyInfo?.constituencyName}</span>
          </div>
          <div className="font-normal text-xl mb-10">
            Center Name:
            <span className="font-semibold text-2xl ps-3">{currentConstituencyInfo?.centerName}</span>
          </div>
          <div className="font-normal text-xl">
            Voter Name:
            <span className="font-semibold text-2xl ps-3">{voter?.name}</span>
          </div>
          <div className="font-normal text-xl mb-5">
            Voter NID:
            <span className="font-semibold text-2xl ps-3">{voter?.NID.toNumber()}</span>
          </div>
        </div>
        <table id="castingCandidateTable" className="w-full text-md text-center text-black">
          <thead className="text-sm text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                SN.
              </th>
              <th scope="col" className="px-6 py-3">
                Image & Name
              </th>
              <th scope="col" className="px-6 py-3">
                Party Name
              </th>
              <th scope="col" className="px-6 py-3">
                Symbol
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {candidates?.map((candidate, i) => (
              <tr className="border-b hover:bg-gray-50" key={i}>
                <td className="px-6 py-4">
                  <div className="text-base font-bold">{i + 1}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center items-center space-x-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img src={candidate?.photo} alt="Avatar Tailwind CSS Component" />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{candidate.Name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-semibold">{candidate.partyName}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="avatar">
                    <div className="mask w-14 h-14">
                      <img src={candidate.symbolURL} alt="candidate symbol" />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {isCast ? (
                    <button type="button" className="text-white bg-red-700 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 opacity-50">
                      Vote
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
                      onClick={() => castingVoteHandler(candidate?.NID)}
                    >
                      Vote
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isCast && (
        <p className="mt-16 text-4xl font-extrabold text-green-600" style={{ fontFamily: "Redressed" }}>
          Vote Cast Successful!!!
        </p>
      )}
    </div>
  );
};

export default CastingVote;
