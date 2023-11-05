import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import useTitle from "../../../Context/useTitle/useTitle";
import { authProvider } from "../../../Context/AuthContext/AuthContext";
import AddAsVoter from "../AddAsVoter/AddAsVoter";
import LoadingSpinner from "../../Shared/LoadingSpinner/LoadingSpinner";

const AllCitizen = () => {
  useTitle("Admin Dashboard");

  const { state } = useContext(authProvider);

  const [citizens, setCitizens] = useState([]);
  const [allCitizens, setAllCitizens] = useState([]);

  const [constituency, setConstituency] = useState([]);
  const [centers, setCenters] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [addedVoter, setAddedVoter] = useState([]);

  useEffect(() => {
    fetch(`https://fake-data-server-khhridoy.vercel.app/voter/smartVoting`)
      .then((res) => res.json())
      .then((data) => setAllCitizens(data))
      .catch((err) => console.log(err));
  }, []);

  //get all constituency from contract
  useEffect(() => {
    const { contract } = state;

    const getInitialData = async () => {
      let constituencyArr = [];

      const totalConstituency = await contract.constituencyCenterContract?.getConstituencyLength();

      for (let i = 0; i < totalConstituency?.toNumber(); i++) {
        const data = await contract.constituencyCenterContract.constituencies(i);
        // console.log(data);
        constituencyArr.push(data);
      }

      setConstituency(constituencyArr);

      //get center operation
      let centersArray = [];

      const totalCenter = await contract.constituencyCenterContract?.getCenterLength();
      // console.log(totalCenter);

      for (let i = 0; i < totalCenter?.toNumber(); i++) {
        const d = await contract.constituencyCenterContract?.centers(i);
        // console.log(d);
        centersArray.push(d);
      }
      setCenters(centersArray);
    };

    contract && getInitialData();
  }, [state]);

  //get already add voter NID
  useEffect(() => {
    const { contract } = state;

    const getAlreadyAddedVoterNID = async () => {
      const data = await contract.votersInfoContract?.getCitizenStatus();

      let existingVoterArr = [];
      data?.forEach((element) => {
        existingVoterArr.push(element?.toNumber());
      });

      setAddedVoter(existingVoterArr);

      let arr = [];
      allCitizens.forEach((c) => {
        if (!existingVoterArr.includes(parseInt(c.nid))) {
          arr.push(c);
        }
      });
      // console.log(arr);
      setCitizens(arr);
    };

    contract && getAlreadyAddedVoterNID();
  }, [state, selectedPerson, allCitizens]);

  const closeModal = () => {
    setSelectedPerson(null);
  };

  //adding new voter
  const addToVoterList = async (person, _centerID) => {
    const { contract } = state;

    //write
    const res = await contract.votersInfoContract.setVoter(
      person.nid,
      person.name,
      person.father,
      person.mother,
      person.age,
      person.gender,
      _centerID,
      person.imageURL
    );
    await res.wait();

    //console.log(res);
    if (res.hash) {
      toast.success("Voter Add Successful!");
      setSelectedPerson(null);
    }
  };

  //display loading spinner
  if (allCitizens.length === 0) {
    return <LoadingSpinner></LoadingSpinner>;
  }

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
        <div className="flex items-center justify-between py-4">
          <div>
            <h2> Citizen Database: {citizens?.length}</h2>
          </div>
          <label className="sr-only">Search</label>
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
              className="block p-2 pl-10 text-sm text-black border border-gray-300 rounded-lg w-80 bg-white focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search for citizens"
              onKeyUp={searchPeople}
            />
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
                Gender
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {citizens.map((citizen, i) => (
              <tr className="border-b hover:bg-gray-50" key={citizen._id}>
                <td className="px-6 py-4">
                  <div className="text-base font-semibold">{i + 1}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-base font-semibold">{citizen.nid}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img src={citizen?.imageURL} alt="Avatar Tailwind CSS Component" />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{citizen.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="pl-3">
                    <div className="font-normal text-gray-500">{citizen.father}</div>
                    <div className="font-normal text-gray-500">{citizen.mother}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-normal text-gray-500">{citizen.age}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-normal text-gray-500">{citizen.gender}</div>
                </td>
                <td className="px-6 py-4">
                  {/* <!-- Modal toggle --> */}
                  {addedVoter?.length && addedVoter.includes(citizen.nid) ? (
                    <label type="button" className="font-medium text-gray-600">
                      Added
                    </label>
                  ) : (
                    <label
                      onClick={() => setSelectedPerson(citizen)}
                      htmlFor="add-voter-modal"
                      type="button"
                      className="font-medium text-blue-600  hover:underline hover:cursor-pointer"
                    >
                      Add to Voter List
                    </label>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedPerson && (
        <AddAsVoter
          closeModal={closeModal}
          modalData={selectedPerson}
          successModal={addToVoterList}
          constituencyData={constituency}
          centerData={centers}
        ></AddAsVoter>
      )}
    </div>
  );
};

export default AllCitizen;
