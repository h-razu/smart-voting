import React, { useContext, useEffect, useState } from "react";
import useTitle from "../../../Context/useTitle/useTitle";
import { authProvider } from "../../../Context/AuthContext/AuthContext";
import ConfirmationModal from "../../Shared/ConfirmationModal/ConfirmationModal";
import LoadingSpinner from "../../Shared/LoadingSpinner/LoadingSpinner";
import AddParty from "../AddParty/AddParty";
import toast from "react-hot-toast";

const AllParty = () => {
  useTitle("Manage Party");

  const { state } = useContext(authProvider);

  const [addParty, setAddParty] = useState(false);
  const [parties, setParties] = useState([]);
  const [selectedParty, setSelectedParty] = useState(null);
  const [loading, setLoading] = useState(false);

  //get stored parties data
  useEffect(() => {
    const { contract } = state;

    const getCurrentParties = async () => {
      let partiesArr = [];

      const totalParties = await contract.politicalPartyContract?.getLength();

      for (let i = 0; i < totalParties; i++) {
        const data = await contract.politicalPartyContract?.parties(i);
        // console.log(data);
        partiesArr.push(data);
      }

      setParties(partiesArr);
    };
    contract && getCurrentParties();
  }, [state, addParty]);

  if (loading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  //delete party action
  const closeDeleteModal = () => {
    setSelectedParty(null);
  };

  const deletePartyHandler = async (id) => {
    const { contract } = state;
    //write
    const res = await contract.politicalPartyContract?.deleteParty(id);
    await res.wait();

    if (res.hash) {
      toast.success("Party Delete Successful!");
      setAddParty(true);

      setTimeout(() => {
        setAddParty(false);
      }, 1000);
    } else {
      toast.error("Transaction Failed....!!!");
    }
  };

  //party add action
  const closeAddModal = () => {
    setAddParty(false);
  };

  const addPartyHandler = async (name, cid, symbolURl) => {
    console.log(name);
    console.log(cid);
    console.log(symbolURl);

    const { contract } = state;

    //write
    const res = await contract.politicalPartyContract?.setParty(name, symbolURl, cid);
    await res.wait();

    if (res.hash) {
      toast.success("Party Add Successful!");
      setAddParty(true);

      setTimeout(() => {
        setAddParty(false);
      }, 1000);
    } else {
      toast.error("Transaction Failed....!!!");
    }
  };

  return (
    <div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="flex items-center justify-between py-4">
          <div>
            <h2 className="ps-4"> Total Party: {parties?.length}</h2>
          </div>
          <label className="sr-only">Search</label>
          <div className="relative">
            <label
              type="button"
              className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
              onClick={() => setAddParty(true)}
              htmlFor="add-party-modal"
            >
              Add New Party
            </label>
          </div>
        </div>
        <table id="peopleTable" className="w-full text-sm text-left text-gray-500">
          <thead className="text-sm text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                SN.
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Party Symbol
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Participated Seat
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {parties?.map((party, i) => (
              <tr className="border-b hover:bg-gray-50" key={i}>
                <td className="px-6 py-4">
                  <div className="text-base font-semibold">{i + 1}</div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="text-base font-semibold">{party.partyName}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="avatar">
                    <div className="mask w-14 h-14">
                      <img src={party.partySymbol} alt="Avatar Tailwind CSS Component" />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="text-base font-semibold">{party.participateSeat.toNumber()}</div>
                </td>
                <td className="px-6 py-4">
                  <label
                    onClick={() => setSelectedParty(party)}
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
      {
        // delete party
        selectedParty && (
          <ConfirmationModal
            title={"Are you sure to delete this Party?"}
            message={`Click DELETE to delete "${selectedParty?.partyName}". This process can't be undone.`}
            closeModal={closeDeleteModal}
            modalData={selectedParty?.partyID.toNumber()}
            successModal={deletePartyHandler}
          ></ConfirmationModal>
        )
      }
      {
        // add party
        addParty && <AddParty closeModal={closeAddModal} modalData={parties} successModal={addPartyHandler} setLoading={setLoading}></AddParty>
      }
    </div>
  );
};

export default AllParty;
