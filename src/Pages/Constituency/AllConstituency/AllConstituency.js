import React, { useContext, useEffect, useState } from "react";
import AddConstituency from "../AddConstituency/AddConstituency";
import { toast } from "react-hot-toast";
import { authProvider } from "../../../Context/AuthContext/AuthContext";
import useTitle from "../../../Context/useTitle/useTitle";

const AllConstituency = () => {
  useTitle("Manage Constituency");

  const { state } = useContext(authProvider);

  const [AddConstituencyStatus, setAddConstituencyStatus] = useState(false);
  const [constituency, setConstituency] = useState([]);
  const [constituencyAddStatus, setConstituencyAddStatus] = useState(false);

  const closeModal = () => {
    setAddConstituencyStatus(false);
  };

  //get all constituency from contract
  useEffect(() => {
    const { contract } = state;

    const getConstituencyFromContract = async () => {
      let constituencyArr = [];

      const totalConstituency = await contract.constituencyCenterContract?.getConstituencyLength();

      for (let i = 0; i < totalConstituency?.toNumber(); i++) {
        const data = await contract.constituencyCenterContract?.constituencies(i);
        // console.log(data);

        constituencyArr.push(data);
      }
      setConstituency(constituencyArr);
      //console.log(constituency)
    };

    contract && getConstituencyFromContract();
  }, [state, constituencyAddStatus]);

  //add a constituency
  const addNewConstituency = async (data) => {
    // console.log(data.toUpperCase())
    const constituencyInUpper = constituency?.map((con) => con.constituencyName.toUpperCase());
    // console.log(constituencyInUpper);

    // console.log(constituencyInUpper.includes(data.toUpperCase()));
    // console.log(data);

    if (!constituencyInUpper.includes(data.toUpperCase())) {
      if (data.length > 0) {
        const { contract } = state;

        //write
        const res = await contract.constituencyCenterContract?.addConstituency(data);
        await res.wait();

        if (res.hash) {
          toast.success("Constituency Add Successful!");
          setConstituencyAddStatus(true);

          setTimeout(() => {
            setConstituencyAddStatus(false);
          }, 1000);
        } else {
          toast.error("Transaction Failed...!!!");
        }
      }
      // console.log(data);
    } else {
      toast.error("Constituency Already Exist");
    }
  };

  return (
    <div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="flex items-center justify-between p-4">
          <div>
            <h2>Total Constituency: {constituency?.length}</h2>
          </div>
          <div className="relative">
            <label
              type="button"
              className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
              onClick={() => setAddConstituencyStatus(true)}
              htmlFor="add-constituency-modal"
            >
              Add New Constituency
            </label>
          </div>
        </div>
        <table id="peopleTable" className="w-full text-sm text-center text-gray-500">
          <thead className="text-sm text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                SN.
              </th>
              <th scope="col" className="px-6 py-3">
                Constituency Name
              </th>
            </tr>
          </thead>
          <tbody>
            {constituency?.map((cons, i) => (
              <tr className="border-b hover:bg-gray-50" key={i}>
                <td className="px-6 py-4">
                  <div className="text-base font-semibold">{i + 1}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-base font-semibold">{cons.constituencyName}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {AddConstituencyStatus && <AddConstituency closeModal={closeModal} successModal={addNewConstituency}></AddConstituency>}
    </div>
  );
};

export default AllConstituency;
