import React, { useContext, useEffect, useState } from "react";
import AddCenter from "../AddCenter/AddCenter";
import { toast } from "react-hot-toast";
import ConfirmationModal from "../../Shared/ConfirmationModal/ConfirmationModal";
import EditCenter from "../EditCenter/EditCenter";
import { authProvider } from "../../../Context/AuthContext/AuthContext";
import useTitle from "../../../Context/useTitle/useTitle";

const AllCenters = () => {
  useTitle("Manage Centers");

  const { state } = useContext(authProvider);

  const [constituency, setConstituency] = useState([]);
  const [centers, setCenters] = useState([]);
  const [allCenter, setAllCenter] = useState([]);
  const [addCenterStatus, setAddCenterStatus] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [editData, setEditData] = useState({});
  const [option, setOption] = useState("All Constituency");

  //get all constituency from contract to display in dropdown as option
  useEffect(() => {
    const { contract } = state;

    const getConstituencyFromContract = async () => {
      let constituencyArr = [];

      const totalConstituency = await contract.constituencyCenterContract?.getConstituencyLength();

      for (let i = 0; i < totalConstituency; i++) {
        const data = await contract.constituencyCenterContract?.constituencies(i);
        // console.log(data);

        constituencyArr.push(data);
      }

      setConstituency(constituencyArr);
    };

    contract && getConstituencyFromContract();
  }, [state]);

  //get center operation
  useEffect(() => {
    const { contract } = state;

    const getCenterFromContract = async () => {
      let centersArray = [];

      const totalCenter = await contract.constituencyCenterContract?.getCenterLength();

      for (let i = 0; i < totalCenter?.toNumber(); i++) {
        const data = await contract.constituencyCenterContract?.centers(i);
        // console.log(data.centerID.toNumber());
        centersArray.push(data);
      }
      setAllCenter(centersArray);
      setCenters(centersArray);
    };
    contract && getCenterFromContract();
  }, [state, addCenterStatus]);

  //add center operation
  const addNewCenter = async (constituencyName, centerName) => {
    if (constituencyName !== "Constituency Name" && centerName.length > 0) {
      // console.log(constituencyName, centerName);

      const { contract } = state;

      //write
      const res = await contract.constituencyCenterContract?.addCenter(constituencyName, centerName);
      await res.wait();

      if (res.hash) {
        toast.success("Center Add Successful!");
        setAddCenterStatus(true);

        setTimeout(() => {
          setAddCenterStatus(false);
        }, 1000);
      } else {
        toast.error("Transaction Failed....!!!");
      }
    }
  };

  //constituency wise center
  useEffect(() => {
    setCenters([]);

    if (option === "All Constituency") {
      setCenters(allCenter);
    } else {
      const filterNumOfCenter = allCenter?.filter((center) => center.constituencyName === option);
      setCenters(filterNumOfCenter);
    }
  }, [option, allCenter]);

  //for closing add modal
  const closeAddModal = () => {
    setAddCenterStatus(false);
  };

  // remove operation
  const deleteCenterHandler = async (centerID) => {
    //console.log(centerName);
    const { contract } = state;
    // console.log(centerID);

    const res = await contract.constituencyCenterContract?.removeCenter(centerID);
    await res.wait();

    if (res.hash) {
      toast.success("Delete Successful!");
      setAddCenterStatus(true);

      setTimeout(() => {
        setAddCenterStatus(false);
      }, 1000);
    } else {
      toast.error("Transaction Failed....!!!");
    }
  };

  //edit center
  const editCenter = async (newConstituencyName, newCenterName, centerID) => {
    // console.log(newConstituencyName);
    // console.log(newCenterName);
    // console.log(centerID);

    const { contract } = state;
    // console.log(centerID);

    const res = await contract.constituencyCenterContract?.removeCenter(centerID);
    await res.wait();

    if (res.hash) {
      //add data with new constituency name
      const result = await contract.constituencyCenterContract?.modifyCenter(centerID, newConstituencyName, newCenterName);
      await result.wait();

      if (result.hash) {
        toast.success("Center Update Successful!");
        setAddCenterStatus(true);

        setTimeout(() => {
          setAddCenterStatus(false);
        }, 1000);
      } else {
        toast.error("Transaction Failed....!!!");
      }
    } else {
      toast.error("Transaction Failed....!!!");
    }
  };
  //change center status
  const changeStatus = async (id) => {
    // console.log(id);
    const currentStatus = centers?.filter((center) => center.centerID.toNumber() === id);
    // console.log(!currentStatus[0].status);

    const { contract } = state;

    const res = await contract.constituencyCenterContract?.changeCenterStatus(id, !currentStatus[0].status);
    await res.wait();

    if (res.hash) {
      toast.success("Center Status Update Successful!");
      setAddCenterStatus(true);

      //change session data
      if (JSON.parse(localStorage.getItem("center")) === id) {
        localStorage.setItem("status", JSON.stringify(!currentStatus[0].status));
      }

      setTimeout(() => {
        setAddCenterStatus(false);
      }, 1000);
    } else {
      toast.error("Transaction Failed....!!!");
    }
  };

  //for closing delete modal
  const closeDeleteModal = () => {
    setSelectedCenter(null);
  };

  //for closing edit modal
  const closeEditModal = () => {
    setEditData({});
  };

  return (
    <div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="flex items-center justify-between p-4">
          <div>
            <h2>Total Center: {centers?.length}</h2>
          </div>
          <div className="flex">
            <div className="relative">
              <label
                type="button"
                className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-3.5 mr-2 mb-2"
                onClick={() => setAddCenterStatus(true)}
                htmlFor="add-center-modal"
              >
                Add New Center
              </label>
            </div>
            <div className="relative">
              <div className="form-control w-full">
                <select id="dropDown" required className="select select-bordered w-full mb-1" onChange={(e) => setOption(e.target.value)}>
                  <option selected value={"All Constituency"}>
                    All Constituency
                  </option>
                  {constituency?.length > 0 ? (
                    constituency.map((d, index) => (
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
        </div>
        <table id="peopleTable" className="w-full text-sm text-gray-500 text-center">
          <thead className="text-sm text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                SN.
              </th>
              <th scope="col" className="px-6 py-3">
                Center Name
              </th>
              <th scope="col" className="px-6 py-3">
                Constituency Name
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Center Status
              </th>
              <th scope="col" className="px-6 py-3"></th>
              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {centers?.map((center, i) => (
              <tr className="border-b hover:bg-gray-50" key={i}>
                <td className="px-6 py-4">
                  <div className="text-base font-semibold">{i + 1}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-base font-semibold">{center.centerName}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-base font-semibold">{center.constituencyName}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-base text-center">
                    <input type="checkbox" className="toggle" checked={center?.status} onChange={() => changeStatus(center.centerID.toNumber())} />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <label
                    onClick={() => setEditData(center)}
                    htmlFor="edit-center-modal"
                    type="button"
                    className="font-medium text-green-600  hover:underline hover:cursor-pointer"
                  >
                    Edit
                  </label>
                </td>
                <td className="px-6 py-4">
                  <label
                    onClick={() => setSelectedCenter(center)}
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
      {/* modal for add new center */}
      {addCenterStatus && <AddCenter closeModal={closeAddModal} successModal={addNewCenter} data={constituency}></AddCenter>}
      {/* modal for delete center */}
      {selectedCenter && (
        <ConfirmationModal
          title={"Are you sure to delete this center?"}
          message={`Click DELETE to delete "${selectedCenter?.centerName}". This process can't be undone.`}
          closeModal={closeDeleteModal}
          modalData={selectedCenter?.centerID.toNumber()}
          successModal={deleteCenterHandler}
        ></ConfirmationModal>
      )}
      {/* modal for edit center */}
      {editData && <EditCenter closeModal={closeEditModal} data={editData} successModal={editCenter} constituency={constituency}></EditCenter>}
    </div>
  );
};

export default AllCenters;
