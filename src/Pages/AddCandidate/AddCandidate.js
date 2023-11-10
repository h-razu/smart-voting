import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import useTitle from "../../Context/useTitle/useTitle";
import { authProvider } from "../../Context/AuthContext/AuthContext";
import makeStorageClient from "../../web3Storage/makeStorageClient";
import LoadingSpinner from "../Shared/LoadingSpinner/LoadingSpinner";

const AddCandidate = () => {
  useTitle("Add Candidate");

  const { state } = useContext(authProvider);

  const [voters, setVoters] = useState([]);
  const [constituencyInfo, setConstituencyInfo] = useState([]);
  const [parties, setParties] = useState([]);
  const [existingCandidatesNID, setExistingCandidatesNID] = useState([]);
  const [existingCandidates, setExistingCandidates] = useState([]);
  const [candidate, setCandidate] = useState(null);
  const [isExist, setIsExist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [candidateType, setCandidateType] = useState(null);

  let candidateTypeArr = [];
  candidateTypeArr.push("Party Based");
  candidateTypeArr.push("Independent");

  useEffect(() => {
    const { contract } = state;

    const fetchVotersConstituencyAndPartyData = async () => {
      //..........get voters data
      let votersArray = [];
      const totalVoters = await contract.votersInfoContract?.getLength();
      // console.log(totalVoters?.toNumber());

      for (let i = 0; i < totalVoters?.toNumber(); i++) {
        const data = await contract.votersInfoContract?.voters(i);
        // console.log(data);
        votersArray.push(data);
      }
      setVoters(votersArray);
      //...........party data
      let partiesArr = [];

      const totalParties = await contract.politicalPartyContract?.getLength();

      for (let i = 0; i < totalParties; i++) {
        const data = await contract.politicalPartyContract?.parties(i);
        //console.log(data);
        partiesArr.push(data);
      }
      setParties(partiesArr);

      //.........get constituency data
      let constituencyArr = [];

      const totalConstituency = await contract.constituencyCenterContract?.getConstituencyLength();

      for (let i = 0; i < totalConstituency; i++) {
        const data = await contract.constituencyCenterContract?.constituencies(i);
        // console.log(data);
        constituencyArr.push(data);
      }
      setConstituencyInfo(constituencyArr);
    };

    contract && fetchVotersConstituencyAndPartyData();
  }, [state]);

  useEffect(() => {
    const { contract } = state;

    const fetchCandidateData = async () => {
      //..........get existing candidate NID and data
      const candidateNID = await contract.candidatesInfoContract?.getAllCandidateNID();
      let arr = [];

      candidateNID?.forEach((element) => {
        arr.push(element.toNumber());
      });
      //   console.log(arr);
      setExistingCandidatesNID(arr);

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
          Age: candidateData[0]?.age.toNumber(),
          candidateType: data1.candidateType,
          partyName: data1.partyName,
          cid: data1.cid,
          standingConstituency: [],
        });

        let totalStandingConstituency = await contract.candidatesInfoContract?.getStandingConstituencyLength(candidateNID[i].toNumber());

        for (let j = 0; j < totalStandingConstituency?.toNumber(); j++) {
          let data2 = await contract.candidatesInfoContract?.standingConstituencies(candidateNID[i].toNumber(), j);

          const constituencyID = data2?.constituencyID.toNumber();

          const constituency = constituencyInfo.filter((cons) => cons.constituencyID.toNumber() === constituencyID);
          // console.log(constituency);

          candidatesArr[i].standingConstituency.push(constituency[0]?.constituencyName);
        }
      }
      // console.log(candidatesArr);
      setExistingCandidates(candidatesArr);
    };

    contract && fetchCandidateData();
  }, [state, constituencyInfo, voters]);

  if (constituencyInfo.length === 0 || voters.length === 0 || existingCandidates.length === 0) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  //search query
  const getCandidateData = (event) => {
    event.preventDefault();
    setIsExist(false);
    setCandidate(null);

    const NID = event.target.voterNID.value;
    // console.log(NID);

    if (existingCandidatesNID.includes(parseInt(NID))) {
      const candidate = existingCandidates?.filter((c) => c.NID === parseInt(NID));
      // console.log("object");
      setCandidate(candidate[0]);
      setIsExist(true);
    } else {
      const candidate = voters?.filter((v) => v.NID.toNumber() === parseInt(NID));
      const c = {
        NID: candidate[0]?.NID.toNumber(),
        Name: candidate[0]?.name,
        photo: candidate[0]?.imageURL,
        Father: candidate[0]?.fatherName,
        Age: candidate[0]?.age.toNumber(),
      };
      setCandidate(c);
    }
  };

  //adding candidate
  //==insert data for new candidate
  const insertData = async (_candidateNID, _candidateType, _partyName, _symbol, _cid, _constituencyID, _partyID) => {
    // console.log(_candidateNID);
    // console.log(_candidateType);
    // console.log(_partyName);
    // console.log(_symbol);
    // console.log(_cid);
    // console.log(_constituencyID);

    const { contract } = state;
    //write
    let res = await contract.candidatesInfoContract?.addCandidate(_candidateNID, _candidateType, _partyName, _symbol, _cid, _constituencyID);
    await res.wait();

    //console.log(res);
    if (res.hash) {
      //increase the participated seat in party
      if (_partyName !== "Independent Candidate") {
        const result = await contract.politicalPartyContract?.increaseSeat(_partyID);
        await result.wait();

        if (result.hash) {
          toast.success("Candidate Add Successful!");
          setCandidate(null);
          setIsExist(false);
          setLoading(false);
        } else {
          toast.error("Transaction Failed....!!!");
        }
      } else {
        toast.success("Candidate Add Successful!");
        setCandidate(null);
        setIsExist(false);
        setLoading(false);
      }
    } else {
      toast.error("Transaction Failed....!!!");
    }
  };

  //===============
  const handleNewCandidate = async (data) => {
    // console.log(data);
    setLoading(true);

    const constituencyName = document.getElementById("constituency-name").value;
    const constituency = constituencyInfo.filter((cons) => cons.constituencyName === constituencyName);
    // console.log(constituency);

    if (constituencyName !== "Constituency Name") {
      //upload symbol image for independent candidate
      if (candidateType === "Independent") {
        //get symbol image
        const fileInput = document.querySelector('input[type="file"]');
        // console.log(fileInput.files);

        //upload IPFS using web3storage gateway
        if (fileInput.files.length > 0) {
          const fileName = fileInput.files[0].name;
          // console.log(fileName);

          const client = makeStorageClient();
          const cid = await client.put(fileInput.files);
          // console.log(cid);

          if (cid) {
            //check
            const isAlreadyAllocate = existingCandidates.filter(
              (candidate) => candidate.cid === cid && !candidate.standingConstituency.includes(constituencyName)
            );

            // console.log(isAlreadyAllocate);

            if (isAlreadyAllocate.length > 0) {
              toast.error("Symbol Already Allocated");
              setLoading(false);
            } else {
              //create symbol URL
              const symbolURl = `https://${cid}.ipfs.dweb.link/${fileName}`;

              insertData(data.NID, candidateType, "Independent Candidate", symbolURl, cid, constituency[0].constituencyID.toNumber(), 0);
            }
          }
        } else {
          toast.error("Please Upload Symbol..!!");
          setLoading(false);
        }
      } else if (candidateType === "Party Based") {
        const partyName = document.getElementById("party-name").value;
        if (partyName !== "Party Name") {
          const party = parties.filter((party) => party.partyName === partyName);

          const checkForExistence = existingCandidates.filter(
            (can) => can.partyName === partyName && can.standingConstituency.includes(constituencyName)
          );
          // console.log(checkForExistence);

          if (checkForExistence.length === 0) {
            insertData(
              data.NID,
              candidateType,
              partyName,
              party[0].partySymbol,
              party[0].cid,
              constituency[0].constituencyID.toNumber(),
              party[0].partyID.toNumber()
            );
          } else {
            toast.error("Constituency Already Allocated");
            setLoading(false);
          }
        } else {
          toast.error("Please Choose Party..!!");
          setLoading(false);
        }
      } else {
        toast.error("Please Choose Candidate Type..!!");
        setLoading(false);
      }
    } else {
      toast.error("Please Choose Constituency..!!");
      setLoading(false);
    }
  };

  //------------
  const handleExistingCandidate = async (data) => {
    // console.log(data);
    //constituency name
    if (data.standingConstituency.length === 5) {
      toast.error("Maximum Constituency Reached...");
    } else {
      const constituencyName = document.getElementById("constituency-name").value;
      const constituency = constituencyInfo.filter((cons) => cons.constituencyName === constituencyName);
      // console.log(constituency);

      if (constituencyName !== "Constituency Name") {
        const checkForExistence = existingCandidates.filter(
          (can) => can.partyName === data.partyName && can.standingConstituency.includes(constituencyName)
        );
        //   console.log(checkForExistence);

        if (checkForExistence.length === 0) {
          setLoading(true);
          const { contract } = state;

          //write
          const res = await contract.candidatesInfoContract?.addStandingConstituency(data.NID, constituency[0].constituencyID.toNumber());
          await res.wait();

          if (res.hash) {
            // increase the number of participated seat for each party
            if (data.partyName !== "Independent Candidate") {
              const party = parties.filter((party) => party.partyName === data.partyName);

              const result = await contract.politicalPartyContract?.increaseSeat(party[0].partyID.toNumber());

              await result.wait();

              if (result.hash) {
                toast.success("New Constituency Add Successful");
                setCandidate(null);
                setIsExist(false);
                setLoading(false);
              } else {
                toast.error("Transaction Failed....!!!");
              }
            }
          } else {
            toast.error("Transaction Failed....!!!");
          }
        } else {
          toast.error("Constituency Already Allocated To Same Party");
        }
      } else {
        toast.error("Please Choose Constituency..!!");
      }
    }
  };

  //=============
  const addCandidateBtnHandler = () => {
    if (candidate.Age >= 25) {
      if (isExist) {
        handleExistingCandidate(candidate);
      } else {
        handleNewCandidate(candidate);
      }
    } else {
      toast.error("Minimum Age Requirement is 25!!!");
    }
  };

  //for loading screen
  if (existingCandidates?.length === 0 && voters?.length === 0) {
    return <LoadingSpinner></LoadingSpinner>;
  }
  if (loading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  return (
    <div className="relative overflow-x-auto  sm:rounded-lg">
      <div className="flex items-center justify-between p-2">
        <h2 className="ps-3 pt-4 text-2xl font-extrabold tracking-tight text-gray-900 text-left">Add Candidate</h2>
        <div className="relative">
          <form className="flex justify-center gap-3" onSubmit={getCandidateData}>
            <div className="form-control w-full">
              <input
                type="number"
                className="input input-bordered mb-1 block text-sm text-black border border-gray-300 rounded-lg w-80 bg-white focus:ring-blue-500 focus:border-blue-500"
                id="voterNID"
                required
                placeholder="Enter NID No."
              />
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
      {candidate?.photo ? (
        <div>
          <div className="flex items-center justify-between px-4">
            <div>
              <div className="avatar">
                <div className="w-24 rounded">
                  <img src={candidate?.photo} alt="" />
                </div>
              </div>
              <div className="form-control w-96">
                <label className="label">
                  <span className="label-text">NID No.</span>
                </label>
                <input type="text" id="nid" defaultValue={candidate.NID} readOnly className="input input-bordered w-full mb-1" />
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input type="text" defaultValue={candidate.Name} readOnly className="input input-bordered w-full mb-1" />
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Father Name</span>
                </label>
                <input type="text" defaultValue={candidate.Father} readOnly className="input input-bordered w-full mb-1" />
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Age</span>
                </label>
                <input type="text" defaultValue={candidate.Age} readOnly className="input input-bordered w-full mb-1" />
              </div>
            </div>
            <div>
              <div className="form-control w-96 mt-20">
                <label className="label">
                  <span className="label-text">Constituency Name</span>
                </label>
                <select name="constituency" id="constituency-name" required className="select select-bordered w-full mb-4">
                  <option disabled selected>
                    Constituency Name
                  </option>
                  {constituencyInfo?.length > 0 ? (
                    constituencyInfo.map((d, index) => (
                      <option key={index} value={d.constituencyName}>
                        {d.constituencyName}
                      </option>
                    ))
                  ) : (
                    <option></option>
                  )}
                </select>
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Candidate Type</span>
                </label>
                {isExist ? (
                  <input
                    type="text"
                    id="candidate-type"
                    defaultValue={candidate.candidateType}
                    readOnly
                    className="input input-bordered w-full mb-4"
                  />
                ) : (
                  <select
                    name="candidate-type"
                    id="candidate-type"
                    required
                    className="select select-bordered w-full mb-4"
                    onChange={(e) => setCandidateType(e.target.value)}
                  >
                    <option disabled selected>
                      Candidate Type
                    </option>
                    {candidateTypeArr?.length > 0 ? (
                      candidateTypeArr.map((d, index) => (
                        <option key={index} value={d}>
                          {d}
                        </option>
                      ))
                    ) : (
                      <option></option>
                    )}
                  </select>
                )}
              </div>
              <div className="form-control w-full">
                {isExist ? (
                  <div>
                    <label className="label">
                      <span className="label-text">Political Party Name</span>
                    </label>
                    <input type="text" id="party-name" defaultValue={candidate.partyName} readOnly className="input input-bordered w-full mb-4" />
                  </div>
                ) : candidateType === "Independent" ? (
                  <div>
                    <label className="label">
                      <span className="label-text">Symbol (image):</span>
                    </label>
                    <input type="file" className="file-input file-input-bordered w-full mb-4" />
                  </div>
                ) : (
                  <div>
                    <label className="label">
                      <span className="label-text">Political Party Name</span>
                    </label>
                    <select name="party" id="party-name" required className="select select-bordered w-full mb-4">
                      <option disabled selected>
                        Party Name
                      </option>
                      {parties?.length > 0
                        ? parties.map((party, index) => (
                            <option key={index} value={party.partyName}>
                              {party.partyName}
                            </option>
                          ))
                        : null}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>
          <label className="btn btn-wide mt-12" onClick={addCandidateBtnHandler}>
            SUBMIT
          </label>
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

export default AddCandidate;
