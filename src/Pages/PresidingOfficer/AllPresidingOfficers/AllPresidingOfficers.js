import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import ConfirmationModal from "../../Shared/ConfirmationModal/ConfirmationModal";
import { authProvider } from "../../../Context/AuthContext/AuthContext";
import useTitle from "../../../Context/useTitle/useTitle";
import AddPresidingOfficer from "../AddPresidingOfficer/AddPresidingOfficer";
import EditPresidingOfficer from "../EditPresidingOfficer/EditPresidingOfficer";

const AllPresidingOfficers = () => {
  useTitle("Manage Presiding Officers");

  const { state } = useContext(authProvider);

  const [presidingOfficersData, setPresidingOfficersData] = useState([]);
  const [centersData, setCentersData] = useState([]);
  const [addNewPresidingOfficerStatus, setAddNewPresidingOfficerStatus] = useState(false);
  const [selectedPresidingOfficer, setSelectedPresidingOfficer] = useState([]);

  //initial data
  useEffect(() => {
    const { contract } = state;

    const fetchCentersData = async () => {
      //get center information
      let centersArray = [];

      const totalCenter = await contract.constituencyCenterContract?.getCenterLength();
      // console.log(totalCenter.toNumber());

      for (let i = 0; i < totalCenter?.toNumber(); i++) {
        const data = await contract.constituencyCenterContract?.centers(i);
        //console.log(data);
        centersArray.push(data);
      }
      setCentersData(centersArray);
    };
    contract && fetchCentersData();
  }, [state]);

  useEffect(() => {
    const { contract } = state;

    const fetchPresidingOfficersData = async () => {
      //get center information
      let officersArray = [];

      const totalOfficers = await contract.presidingOfficerContract?.getLength();

      for (let i = 0; i < totalOfficers; i++) {
        const data = await contract.presidingOfficerContract?.presidingOfficers(i);
        officersArray.push(data);
      }
      setPresidingOfficersData(officersArray);
    };

    contract && fetchPresidingOfficersData();
  }, [state, addNewPresidingOfficerStatus]);

  const closeAddModal = () => {
    setAddNewPresidingOfficerStatus(false);
  };

  const addNewPresidingOfficerHandler = async (name, id, pass, centerId) => {
    // console.log(name, id, pass);

    const { contract } = state;

    const res = await contract.presidingOfficerContract?.setPresidingOfficer(id, name, centerId, pass);
    await res.wait();

    if (res.hash) {
      toast.success("Presiding Officer add successful");

      setAddNewPresidingOfficerStatus(false);
    } else {
      toast.error("Transaction Failed....!!!");
    }
  };

  const closeDeleteModal = () => {
    setSelectedPresidingOfficer(null);
  };

  const officerDelete = async (id) => {
    const { contract } = state;

    const res = await contract.presidingOfficerContract?.deletePresidingOfficer(id?.toNumber());
    await res.wait();

    if (res.hash) {
      toast.success("Presiding Officer delete successful");

      setAddNewPresidingOfficerStatus(true);

      setTimeout(() => {
        setAddNewPresidingOfficerStatus(false);
      }, 1000);
    } else {
      toast.error("Transaction Failed....!!!");
    }
  };

  const closeEditModal = () => {
    setSelectedPresidingOfficer(null);
  };

  const editOfficer = async (id, centerId) => {
    // console.log(id, centerId);

    const { contract } = state;

    const res = await contract.presidingOfficerContract?.allocateCenter(id, centerId);
    await res.wait();

    if (res.hash) {
      toast.success("Officer data update successful");

      setAddNewPresidingOfficerStatus(true);

      setTimeout(() => {
        setAddNewPresidingOfficerStatus(false);
      }, 1000);
    } else {
      toast.error("Transaction Failed....!!!");
    }
  };

  const getConstituency = (centerId) => {
    const data = centersData?.filter((center) => center.centerID.toNumber() === centerId);
    // console.log(data[0].constituencyName);
    return data[0]?.constituencyName;
  };

  const getCenter = (centerId) => {
    const data = centersData?.filter((center) => center.centerID.toNumber() === centerId);
    // console.log(data[0].centerName);
    return data[0]?.centerName;
  };
  return (
    <div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="flex items-center justify-between p-4">
          <div></div>
          <div className="relative">
            <label
              type="button"
              className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
              onClick={() => setAddNewPresidingOfficerStatus(true)}
              htmlFor="add-officer-modal"
            >
              Add New Presiding Officer
            </label>
          </div>
        </div>
        <table id="peopleTable" className="w-full text-sm text-gray-500 text-center">
          <thead className="text-sm text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                SN.
              </th>
              <th scope="col" className="px-6 py-3">
                Presiding Officer ID
              </th>
              <th scope="col" className="px-6 py-3">
                Presiding Officer Name
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Allocated Constituency & Center
              </th>
              <th scope="col" className="px-6 py-3"></th>
              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {presidingOfficersData?.map((officer, i) => (
              <tr className="border-b hover:bg-gray-50" key={i}>
                <td className="px-6 py-4">
                  <div className="text-base font-semibold">{i + 1}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-base font-semibold">{officer.presidingOfficerID.toNumber()}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-base font-semibold">{officer.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="pl-3">
                    <div className="font-normal text-gray-500">{getConstituency(officer.centerID.toNumber())}</div>
                    <div className="font-normal text-gray-500">{getCenter(officer.centerID.toNumber())}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <label
                    onClick={() => setSelectedPresidingOfficer(officer)}
                    htmlFor="edit-officer-modal"
                    type="button"
                    className="font-medium text-green-600  hover:underline hover:cursor-pointer"
                  >
                    Edit
                  </label>
                </td>
                <td className="px-6 py-4">
                  <label
                    onClick={() => setSelectedPresidingOfficer(officer)}
                    htmlFor="confirmation-modal"
                    type="button"
                    className="font-medium text-red-600  hover:underline hover:cursor-pointer"
                  >
                    Delete
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {addNewPresidingOfficerStatus && (
        <AddPresidingOfficer
          closeModal={closeAddModal}
          successModal={addNewPresidingOfficerHandler}
          presidingOfficerData={presidingOfficersData}
          centerData={centersData}
        ></AddPresidingOfficer>
      )}
      {selectedPresidingOfficer && (
        <ConfirmationModal
          title={"Are you sure to delete this Presiding Officer?"}
          message={`Click DELETE to delete "${selectedPresidingOfficer?.name}". This process can't be undone.`}
          closeModal={closeDeleteModal}
          modalData={selectedPresidingOfficer?.presidingOfficerID}
          successModal={officerDelete}
        ></ConfirmationModal>
      )}
      {selectedPresidingOfficer && (
        <EditPresidingOfficer
          closeModal={closeEditModal}
          modalData={selectedPresidingOfficer}
          presidingOfficerData={presidingOfficersData}
          successModal={editOfficer}
          centerData={centersData}
        ></EditPresidingOfficer>
      )}
    </div>
  );
};

export default AllPresidingOfficers;
