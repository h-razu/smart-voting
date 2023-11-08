import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import ConfirmationModal from "../../Shared/ConfirmationModal/ConfirmationModal";
import { authProvider } from "../../../Context/AuthContext/AuthContext";
import useTitle from "../../../Context/useTitle/useTitle";
import EditVoter from "../EditVoter/EditVoter";
import LoadingSpinner from "../../Shared/LoadingSpinner/LoadingSpinner";

const AllVoters = () => {
  useTitle("Manage Voters");

  const { state } = useContext(authProvider);

  const [voters, setVoters] = useState([]);
  const [allVoters, setAllVoters] = useState([]);
  const [centersInfo, setCentersInfo] = useState([]);
  const [constituencyInfo, setConstituencyInfo] = useState([]);
  const [selectedVoter, setSelectedVoter] = useState(null);
  const [editVoter, setEditVoter] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState(false);
  const [existingCandidatesNID, setExistingCandidatesNID] = useState([]);
  const [option, setOption] = useState("All Constituency");

  useEffect(() => {
    const { contract } = state;

    const fetchInitialData = async () => {
      //..........get voters data
      let votersArray = [];
      const totalVoters = await contract.votersInfoContract?.getLength();
      // console.log(totalVoters);

      for (let i = 0; i < totalVoters; i++) {
        const data = await contract.votersInfoContract?.voters(i);
        // console.log(data);
        votersArray.push(data);
      }
      setVoters(votersArray);
      setAllVoters(votersArray);

      //..........get center data
      let centersArray = [];

      const totalCenter = await contract.constituencyCenterContract?.getCenterLength();
      // console.log(totalCenter);

      for (let i = 0; i < totalCenter; i++) {
        const d = await contract.constituencyCenterContract?.centers(i);
        // console.log(d);
        centersArray.push(d);
      }
      setCentersInfo(centersArray);

      //set constituency data
      const uniqueConstituency = [...new Set(centersArray.map((item) => item.constituencyName))];
      setConstituencyInfo(uniqueConstituency);
      // console.log(uniqueConstituency);

      //get existing candidate NID
      const candidateNID = await contract.candidatesInfoContract?.getAllCandidateNID();
      let arr = [];
      candidateNID?.forEach((element) => {
        arr.push(element.toNumber());
      });
      // console.log(arr);
      setExistingCandidatesNID(arr);
    };

    contract && fetchInitialData();
  }, [state, deleteStatus]);

  useEffect(() => {
    setVoters([]);

    if (option === "All Constituency") {
      setVoters(allVoters);
    } else {
      const center = centersInfo?.filter((cn) => cn.constituencyName === option);
      let centerIDs = [];
      center.forEach((element) => {
        centerIDs.push(element.centerID.toNumber());
      });
      // console.log(centerIDs);

      const filteredVoter = allVoters?.filter((voter) => centerIDs.includes(voter.centerID.toNumber()));
      setVoters(filteredVoter);
    }
  }, [option, allVoters, centersInfo]);

  if (allVoters?.length === 0 && centersInfo?.length === 0) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  //get constituency name from centersInfo object to display in each row
  const getConstituencyName = (id) => {
    const consName = centersInfo?.filter((cn) => cn.centerID.toNumber() === id);
    return consName[0]?.constituencyName.length ? consName[0].constituencyName : "Constituency Not Found";
  };

  //get center name from centersInfo object to display in each row
  const getCenterName = (id) => {
    const centName = centersInfo?.filter((cn) => cn.centerID.toNumber() === id);
    return centName[0]?.centerName.length ? centName[0]?.centerName : "Center Not Found";
  };

  //delete voter
  const closeDeleteModal = () => {
    setSelectedVoter(null);
  };

  const deleteVoterHandler = async (nid) => {
    // console.log(nid);

    const { contract } = state;

    const res = await contract.votersInfoContract?.deleteVoter(nid);
    await res.wait();

    if (res.hash) {
      toast.success("Delete Successful!");
      setSelectedVoter(null);

      setDeleteStatus(true);

      setTimeout(() => {
        setDeleteStatus(false);
      }, 1000);
    } else {
      toast.error("Transaction Failed....!!!");
    }
  };

  //editing voter
  const editModalClose = () => {
    setEditVoter(null);
  };

  const editHandler = async (person, _centerID) => {
    // console.log(person.NID.toNumber());
    // console.log(_centerID);
    const { contract } = state;

    const result = await contract.votersInfoContract?.deleteVoter(person.NID.toNumber());
    await result.wait();

    if (result.hash) {
      //write
      const res = await contract.votersInfoContract?.setVoter(
        person.NID,
        person.name,
        person.fatherName,
        person.motherName,
        person.age,
        person.gender,
        _centerID,
        person.imageURL
      );
      await res.wait();

      //console.log(res);
      if (res.hash) {
        toast.success("Voter Data Edit Successful!");
        setEditVoter(null);

        setDeleteStatus(true);

        setTimeout(() => {
          setDeleteStatus(false);
        }, 1000);
      } else {
        toast.error("Transaction Failed....!!!");
      }
    } else {
      toast.error("Transaction Failed....!!!");
    }
  };

  //search field action
  const searchPeople = () => {
    let input, filter, table, tr, td, i, txtValue;

    input = document.getElementById("table-search-people");
    filter = input.value.toUpperCase();
    table = document.getElementById("peopleTable");
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[2];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  };

  return (
    <div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="flex items-center justify-between p-4">
          <div>
            <h2>Total Voter: {voters?.length}</h2>
          </div>
          <div className="flex">
            {/* <label className="sr-only">Search</label> */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                id="table-search-people"
                className="block p-3 me-2 pl-10 text-sm text-black border border-gray-300 rounded-lg w-80 bg-white focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search for Voter"
                onKeyUp={searchPeople}
              />
            </div>
            <div className="relative">
              <div className="form-control w-full">
                <select id="dropDown" required className="select select-bordered w-full mb-1" onChange={(e) => setOption(e.target.value)}>
                  <option selected value={"All Constituency"}>
                    All Constituency
                  </option>
                  {constituencyInfo?.length > 0 ? (
                    constituencyInfo.map((d, index) => (
                      <option key={index} value={d}>
                        {d}
                      </option>
                    ))
                  ) : (
                    <option></option>
                  )}
                </select>
              </div>
            </div>
          </div>
        </div>
        <table id="peopleTable" className="w-full text-sm text-left text-gray-500">
          <thead className="text-sm text-gray-700 uppercase bg-gray-50">
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
                Age
              </th>
              <th scope="col" className="px-6 py-3">
                Constituency & Center
              </th>
              <th scope="col" className="px-6 py-3"></th>
              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {voters?.map((voter, i) => (
              <tr className="border-b hover:bg-gray-50" key={i}>
                <td className="px-6 py-4">
                  <div className="text-base font-semibold">{i + 1}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-base font-semibold">{voter.NID.toNumber()}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img src={voter?.imageURL} alt="Avatar Tailwind CSS Component" />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{voter.name}</div>
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
                  <div className="text-base font-semibold">{voter.age.toNumber()}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="pl-3">
                    <div className="font-normal text-gray-500">{getConstituencyName(voter.centerID.toNumber())}</div>
                    <div className="font-normal text-gray-500">{getCenterName(voter.centerID.toNumber())}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <label
                    onClick={() => setEditVoter(voter)}
                    htmlFor="edit-voter-modal"
                    type="button"
                    className="font-bold text-green-600  hover:underline hover:cursor-pointer"
                  >
                    Edit
                  </label>
                </td>
                <td className="px-6 py-4">
                  {existingCandidatesNID?.includes(voter.NID.toNumber()) ? (
                    <label type="button" className="font-medium text-gray-400">
                      Delete
                    </label>
                  ) : (
                    <label
                      onClick={() => setSelectedVoter(voter)}
                      htmlFor="confirmation-modal"
                      type="button"
                      className="font-bold text-red-600  hover:underline hover:cursor-pointer"
                    >
                      Delete
                    </label>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedVoter && (
        <ConfirmationModal
          title={"Are you sure to delete this voter?"}
          message={`Click DELETE to delete "${selectedVoter?.name}". This process can't be undone.`}
          closeModal={closeDeleteModal}
          modalData={selectedVoter?.NID.toNumber()}
          successModal={deleteVoterHandler}
        ></ConfirmationModal>
      )}

      {editVoter && <EditVoter closeModal={editModalClose} successModal={editHandler} data={editVoter} centerData={centersInfo}></EditVoter>}
    </div>
  );
};

export default AllVoters;
