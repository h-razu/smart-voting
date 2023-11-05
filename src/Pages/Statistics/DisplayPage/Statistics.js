import React, { useContext, useEffect, useState } from "react";
import { authProvider } from "../../../Context/AuthContext/AuthContext";
import useTitle from "../../../Context/useTitle/useTitle";
import VoterStats from "../VoterStats/VoterStats";
import PartyStats from "../PartyStats/PartyStats";
import LoadingSpinner from "../../Shared/LoadingSpinner/LoadingSpinner";

const Statistics = () => {
  useTitle("Voting Statistics");

  const { state } = useContext(authProvider);

  const [constituencyData, setConstituencyData] = useState(null);
  const [centersData, setCentersData] = useState([]);
  const [allVoters, setAllVoters] = useState([]);
  const [option, setOption] = useState("All Constituency");

  const [totalCentersInConstituency, setTotalCentersInConstituency] = useState(0);
  const [allParty, setAllParty] = useState([]);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const { contract } = state;

    const fetchPartyCenterVoterData = async () => {
      //------get center data
      let centersArray = [];

      const totalCenter = await contract.constituencyCenterContract?.getCenterLength();
      setTotalCentersInConstituency(totalCenter);

      for (let i = 0; i < totalCenter; i++) {
        const data = await contract.constituencyCenterContract?.centers(i);
        //console.log(data);
        centersArray.push(data);
      }
      setCentersData(centersArray);

      //--------------get all voter list for mapping
      let votersArray = [];
      const totalVoters = await contract.votersInfoContract?.getLength();
      // console.log(totalVoters);

      for (let i = 0; i < totalVoters; i++) {
        const data = await contract.votersInfoContract?.voters(i);
        // console.log(data);
        votersArray.push(data);
      }
      setAllVoters(votersArray);

      //--fetch party data
      let partiesArr = [];

      const totalParties = await contract.politicalPartyContract?.getLength();

      for (let i = 0; i < totalParties; i++) {
        const data = await contract.politicalPartyContract?.parties(i);
        //console.log(data);
        partiesArr.push(data);
      }
      setAllParty(partiesArr);
    };

    contract && fetchPartyCenterVoterData();
  }, [state]);

  //getting candidates data
  useEffect(() => {
    const { contract } = state;

    const fetchCandidatesAndConstituencyData = async () => {
      //---fetch constituency data
      let constituencyArr = [];

      const totalConstituency = await contract.constituencyCenterContract?.getConstituencyLength();

      for (let i = 0; i < totalConstituency; i++) {
        const data = await contract.constituencyCenterContract?.constituencies(i);
        // console.log(data);
        constituencyArr.push(data);
      }
      setConstituencyData(constituencyArr);

      //--fetch candidates data
      const candidateNID = await contract.candidatesInfoContract?.getAllCandidateNID();

      let candidatesArr = [];

      for (let i = 0; i < candidateNID?.length; i++) {
        let data1 = await contract.candidatesInfoContract?.candidates(candidateNID[i].toNumber());
        // console.log(data1);

        const candidateData = allVoters?.filter((voter) => voter.NID.toNumber() === candidateNID[i].toNumber());
        // console.log(candidateData);

        candidatesArr.push({
          NID: candidateNID[i].toNumber(),
          Name: candidateData[0]?.name,
          photo: candidateData[0]?.imageURL,
          partyName: data1.partyName,
          symbolURL: data1.symbolURL,
          standingConstituency: [],
          totalVotes: [],
        });

        let totalStandingConstituency = await contract.candidatesInfoContract?.getStandingConstituencyLength(candidateNID[i].toNumber());

        for (let j = 0; j < totalStandingConstituency; j++) {
          let data2 = await contract.candidatesInfoContract?.standingConstituencies(candidateNID[i].toNumber(), j);

          const constituency = constituencyArr?.filter((cons) => cons.constituencyID.toNumber() === data2.constituencyID.toNumber());

          candidatesArr[i].standingConstituency.push(constituency[0]?.constituencyName);
          candidatesArr[i].totalVotes.push(data2.totalVotes.toNumber());
        }
      }
      //get candidates data
      setCandidates(candidatesArr);
    };

    contract && fetchCandidatesAndConstituencyData();
  }, [state, allVoters]);

  //for voter stats
  useEffect(() => {
    //---get number of center in specific constituency
    if (option === "All Constituency") {
      setTotalCentersInConstituency(centersData?.length);
    } else {
      const filterNumOfCenter = centersData?.filter((center) => center.constituencyName === option);
      setTotalCentersInConstituency(filterNumOfCenter?.length);
    }
  }, [option, centersData]);

  if (allVoters.length === 0) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  return (
    <div>
      <div className="flex items-center justify-between p-4">
        <div>
          <div className="flex items-start flex-col">
            <h2 className="text-2xl">
              Statistics: <span className="font-extrabold tracking-tight text-gray-900">{option}</span>
            </h2>
            <h2 className="text-xl">
              Total Centers: <span className="font-extrabold tracking-tight text-gray-900">{totalCentersInConstituency}</span>
            </h2>
          </div>
        </div>
        <div className="relative">
          <div className="form-control w-full">
            <select id="dropDown" required className="select select-bordered w-full mb-1" onChange={(e) => setOption(e.target.value)}>
              <option selected value={"All Constituency"}>
                All Constituency
              </option>
              {constituencyData?.length > 0 ? (
                constituencyData.map((d, index) => (
                  <option key={index} value={d.constituencyName}>
                    {d.constituencyName}
                  </option>
                ))
              ) : (
                <option></option>
              )}
            </select>
          </div>
        </div>
      </div>
      {/* voter stats display */}
      <div>{allVoters.length > 0 && <VoterStats voters={allVoters} option={option} centers={centersData}></VoterStats>}</div>
      {/* party stats display */}
      <div>{allParty.length > 0 && <PartyStats party={allParty} constituencyData={constituencyData} candidate={candidates}></PartyStats>}</div>
    </div>
  );
};

export default Statistics;
