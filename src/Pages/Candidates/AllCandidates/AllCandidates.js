import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import ConfirmationModal from "../../Shared/ConfirmationModal/ConfirmationModal";
import { authProvider } from "../../../Context/AuthContext/AuthContext";
import useTitle from "../../../Context/useTitle/useTitle";
import LoadingSpinner from "../../Shared/LoadingSpinner/LoadingSpinner";

const AllCandidates = () => {
  useTitle("Manage Candidates");

  const { state } = useContext(authProvider);

  const [constituencyData, setConstituencyData] = useState([]);
  const [voters, setVoters] = useState([]);
  const [parties, setParties] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [allCandidates, setAllCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [status, setStatus] = useState(false);
  const [option, setOption] = useState("All Constituency");

  useEffect(() => {
    const { contract } = state;
    const getConstantInitialData = async () => {
      //............get voters data
      let votersArray = [];
      const totalVoters = await contract.votersInfoContract?.getLength();
      // console.log(totalVoters);

      for (let i = 0; i < totalVoters; i++) {
        const data = await contract.votersInfoContract?.voters(i);
        // console.log(data);
        votersArray.push(data);
      }
      setVoters(votersArray);

      //..........get constituency info
      let constituencyArr = [];

      const totalConstituency = await contract.constituencyCenterContract?.getConstituencyLength();

      for (let i = 0; i < totalConstituency; i++) {
        const data = await contract.constituencyCenterContract?.constituencies(i);
        // console.log(data);
        constituencyArr.push(data);
      }
      setConstituencyData(constituencyArr);

      //.........get parties data
      let partiesArr = [];

      const totalParties = await contract.politicalPartyContract?.getLength();

      for (let i = 0; i < totalParties?.toNumber(); i++) {
        const data = await contract.politicalPartyContract?.parties(i);
        //console.log(data);
        partiesArr.push(data);
      }
      setParties(partiesArr);
    };

    contract && getConstantInitialData();
  }, [state]);

  useEffect(() => {
    const { contract } = state;

    const getInitialData = async () => {
      //......get existing candidate data and their standingConstituency
      const candidateNID = await contract.candidatesInfoContract?.getAllCandidateNID();

      let candidatesArr = [];

      for (let i = 0; i < candidateNID?.length; i++) {
        let data1 = await contract.candidatesInfoContract?.candidates(candidateNID[i].toNumber());
        // console.log(data1);

        const candidateData = voters?.filter((voter) => voter.NID.toNumber() === candidateNID[i].toNumber());
        // console.log(candidateData);

        candidatesArr.push({
          NID: candidateNID[i].toNumber(),
          Name: candidateData[0]?.name,
          photo: candidateData[0]?.imageURL,
          Father: candidateData[0]?.fatherName,
          Mother: candidateData[0]?.motherName,
          candidateType: data1.candidateType,
          partyName: data1.partyName,
          symbolURL: data1.symbolURL,
          cid: data1.cid,
          standingConstituency: [],
        });

        let totalStandingConstituency = await contract.candidatesInfoContract?.getStandingConstituencyLength(candidateNID[i].toNumber());

        for (let j = 0; j < totalStandingConstituency?.toNumber(); j++) {
          let data2 = await contract.candidatesInfoContract?.standingConstituencies(candidateNID[i].toNumber(), j);

          const constituencyID = data2?.constituencyID.toNumber();

          const constituency = constituencyData?.filter((cons) => cons.constituencyID.toNumber() === constituencyID);
          // console.log(constituency);

          candidatesArr[i].standingConstituency.push(constituency[0]?.constituencyName);
        }
      }
      // console.log(candidatesArr);
      setCandidates(candidatesArr);
      setAllCandidates(candidatesArr);
    };

    contract && getInitialData();
  }, [state, constituencyData, voters, status]);

  useEffect(() => {
    setCandidates([]);

    if (option === "All Constituency") {
      setCandidates(allCandidates);
    } else {
      const filtered = allCandidates?.filter((candidate) => candidate.standingConstituency.includes(option));
      // console.log(filtered);

      setCandidates(filtered);
    }
  }, [option, allCandidates]);

  if (allCandidates.length === 0) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  //candidate delete operation
  const deleteConstituencyFromCandidate = async (data) => {
    // console.log(data);
    const { contract } = state;

    const res = await contract.candidatesInfoContract?.deleteCandidate(data.NID, data.constituencyID);
    await res.wait();

    if (res.hash) {
      //decrease the number of participated seat for each party
      if (data.partyName !== "Independent Candidate") {
        const party = parties.filter((party) => party.partyName === data.partyName);

        const result = await contract.politicalPartyContract?.decreaseSeat(party[0].partyID.toNumber());
        await result.wait();

        if (result.hash) {
          toast.success("Participated Constituency Delete Successful!");
          setStatus(true);

          setTimeout(() => {
            setStatus(false);
          }, 1000);
        } else {
          toast.error("Transaction Failed....!!!");
        }
      } else {
        toast.success("Participated Constituency Delete Successful!");
        setStatus(true);

        setTimeout(() => {
          setStatus(false);
        }, 1000);
      }
    } else {
      toast.error("Transaction Failed....!!!");
    }
  };

  const constituencyDeleteHandler = (candidate, _constituencyName) => {
    // console.log(candidate);
    // console.log(_constituencyName);

    const constituency = constituencyData.filter((cons) => cons.constituencyName === _constituencyName);

    const arr = {
      NID: candidate.NID,
      constituencyID: constituency[0].constituencyID.toNumber(),
      partyName: candidate.partyName,
    };

    setSelectedData(arr);

    setSelectedCandidate(candidate);
  };

  const closeDeleteModal = () => {
    setSelectedCandidate(null);
  };

  return (
    <div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="flex items-center justify-between py-4">
          <div>
            <h2> Total Candidates: {candidates.length}</h2>
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
        <table id="peopleTable" className="w-full text-sm text-left text-gray-500">
          <thead className="text-sm text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3">
                SN.
              </th>
              <th scope="col" className="px-4 py-3">
                NID No.
              </th>
              <th scope="col" className="px-4 py-3">
                Image & Name
              </th>
              <th scope="col" className="px-4 py-3">
                Father & Mother
              </th>
              <th scope="col" className="px-4 py-3">
                Party Name
              </th>
              <th scope="col" className="px-4 py-3">
                Symbol
              </th>
              <th scope="col" className="px-4 py-3">
                Constituency Name
              </th>
            </tr>
          </thead>
          <tbody>
            {candidates?.map((candidate, i) => (
              <tr className="border-b hover:bg-gray-50" key={i}>
                <td className="px-4 py-4">
                  <div className="text-base font-semibold">{i + 1}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-base font-semibold">{candidate.NID}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-3">
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
                <td className="px-4 py-4">
                  <div className="font-normal text-gray-500">{candidate.Father}</div>
                  <div className="font-normal text-gray-500">{candidate.Mother}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="font-normal text-gray-500">{candidate.partyName}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="avatar">
                    <div className="mask w-14 h-14">
                      <img src={candidate.symbolURL} alt="Avatar Tailwind CSS Component" />
                    </div>
                  </div>
                </td>
                <td className="text-center">
                  {candidate?.standingConstituency.length > 0
                    ? candidate?.standingConstituency.map((cons, index) => (
                        <div key={index} className="font-normal text-gray-500 my-1 flex items-center justify-between px-4">
                          <div>{cons} </div>
                          <div className="me-4">
                            <label
                              onClick={() => constituencyDeleteHandler(candidate, cons)}
                              htmlFor="confirmation-modal"
                              type="button"
                              className="font-medium text-red-600  hover:underline hover:cursor-pointer"
                            >
                              Delete
                            </label>
                          </div>
                        </div>
                      ))
                    : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* delete candidate constituency  */}
      {selectedCandidate && (
        <ConfirmationModal
          title={"Are you sure to delete this Constituency for this candidate?"}
          message={`Click DELETE to delete "${selectedCandidate?.Name} from this Constituency". This process can't be undone.`}
          closeModal={closeDeleteModal}
          modalData={selectedData}
          successModal={deleteConstituencyFromCandidate}
        ></ConfirmationModal>
      )}
    </div>
  );
};

export default AllCandidates;
