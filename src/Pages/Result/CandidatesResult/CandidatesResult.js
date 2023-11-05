import React, { useContext, useEffect, useState } from "react";
import { authProvider } from "../../../Context/AuthContext/AuthContext";
import useTitle from "../../../Context/useTitle/useTitle";
import LoadingSpinner from "../../Shared/LoadingSpinner/LoadingSpinner";

const CandidatesResult = () => {
  useTitle("Result");

  const { state } = useContext(authProvider);

  const [constituencyData, setConstituencyData] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [allVoters, setAllVoters] = useState([]);
  const [option, setOption] = useState(null);

  //get center data
  useEffect(() => {
    const { contract } = state;

    const fetchInitialData = async () => {
      //-------------get constituency name and id
      let constituencyArr = [];

      const totalConstituency = await contract.constituencyCenterContract?.getConstituencyLength();

      for (let i = 0; i < totalConstituency; i++) {
        const data = await contract.constituencyCenterContract?.constituencies(i);
        // console.log(data);
        constituencyArr.push(data);
      }
      setConstituencyData(constituencyArr);

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
    };

    contract && fetchInitialData();
  }, [state]);

  useEffect(() => {
    const { contract } = state;

    const fetchDynamicData = async () => {
      //---------------get candidates list
      const candidateNID = await contract.candidatesInfoContract?.getAllCandidateNID();

      let candidatesArr = [];

      for (let i = 0; i < candidateNID?.length; i++) {
        let data1 = await contract.candidatesInfoContract?.candidates(candidateNID[i].toNumber());
        // console.log(data1);

        const candidateData = allVoters.filter((voter) => voter.NID.toNumber() === candidateNID[i].toNumber());
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

          const constituency = constituencyData?.filter((cons) => cons.constituencyID.toNumber() === data2.constituencyID.toNumber());
          candidatesArr[i].standingConstituency.push(constituency[0]?.constituencyName);
          candidatesArr[i].totalVotes.push(data2.totalVotes.toNumber());
        }
      }
      //get candidates data
      setCandidates(candidatesArr);
    };
    contract && fetchDynamicData();
  }, [state, allVoters, constituencyData]);

  //get candidates
  useEffect(() => {
    //clearing
    setFilteredCandidates([]);
    //   console.log(option);

    //candidates filtering
    const filtering = candidates.filter((c) => c.standingConstituency.includes(option));
    // console.log(filtering);

    let voteCountArr = [];

    filtering.forEach((data) => {
      for (let i = 0; i < data.standingConstituency.length; i++) {
        if (data.standingConstituency[i] === option) {
          voteCountArr.push({
            NID: data.NID,
            Name: data.Name,
            Photo: data.photo,
            PartyName: data.partyName,
            PartySymbol: data.symbolURL,
            Constituency: option,
            totalVotes: data.totalVotes[i],
          });
        }
      }
    });
    //sort according to total votes
    let sorted = voteCountArr.sort((c1, c2) => (c1.totalVotes < c2.totalVotes ? 1 : c1.totalVotes > c2.totalVotes ? -1 : 0));
    setFilteredCandidates(sorted);
  }, [option, candidates]);

  if (candidates.length === 0) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div className="flex items-center justify-between p-4">
        <div>
          <h2>Total Candidates: {filteredCandidates?.length}</h2>
        </div>
        <div>
          <h2 className="p-4 text-2xl font-extrabold tracking-tight text-gray-900">Constituency Result</h2>
        </div>
        <div className="relative">
          <div className="form-control w-full">
            <select id="dropDown" required className="select select-bordered w-full mb-1" onChange={(e) => setOption(e.target.value)}>
              <option disabled selected>
                Constituency Name
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
      <table id="peopleTable" className="w-full text-sm text-center text-gray-500">
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
              Constituency Name
            </th>
            <th scope="col" className="px-6 py-3">
              Total Votes
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredCandidates?.length > 0 &&
            filteredCandidates?.map((candidate, i) => (
              <tr className="border-b hover:bg-gray-50" key={i}>
                <td className="px-6 py-4">
                  <div className="text-base font-semibold">{i + 1}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img src={candidate?.Photo} alt="Avatar Tailwind CSS Component" />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-lg">
                        {candidate.Name}
                        <span className="ps-2">
                          {i === 0 && candidate.totalVotes > 0 && filteredCandidates[1]?.totalVotes < candidate.totalVotes ? (
                            <div className="badge font-serif text-sm font-extrabold badge-info gap-2">WINNER</div>
                          ) : null}
                          {i === 1 &&
                          candidate.totalVotes > 0 &&
                          filteredCandidates[0]?.totalVotes > candidate.totalVotes &&
                          filteredCandidates[2]?.totalVotes < candidate.totalVotes ? (
                            <div className="badge font-sans font-medium badge-success gap-2">NEAREST CANDIDATE</div>
                          ) : null}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-normal text-gray-500">{candidate.PartyName}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="avatar">
                    <div className="mask w-14 h-14">
                      <img src={candidate.PartySymbol} alt="Avatar Tailwind CSS Component" />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-normal text-gray-500">{candidate.Constituency}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-normal text-gray-500">{candidate.totalVotes}</div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="flex justify-around">
        {filteredCandidates?.length === 0 && <div className="text-3xl text-red-600 font-bold my-10">No Data!!!</div>}
      </div>
    </div>
  );
};

export default CandidatesResult;
