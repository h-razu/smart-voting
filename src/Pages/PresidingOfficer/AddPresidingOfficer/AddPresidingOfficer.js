import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const AddPresidingOfficer = ({ closeModal, successModal, presidingOfficerData, centerData }) => {
  const [option, setOption] = useState(null);
  const [centers, setCenters] = useState([]);

  const uniqueConstituency = [...new Set(centerData.map((item) => item.constituencyName))];
  // console.log(uniqueConstituency);

  useEffect(() => {
    const cen = centerData.filter((center) => center.constituencyName === option);
    setCenters(cen);
    // console.log(cen);
  }, [option, centerData]);

  return (
    <>
      <input type="checkbox" id="add-officer-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative">
          <label htmlFor="add-officer-modal" className="btn btn-sm btn-circle absolute right-2 top-2" onClick={closeModal}>
            ✕
          </label>
          <h3 className="text-lg font-bold">Add New Presiding Officer</h3>
          <div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Enter Presiding Officer Name:</span>
              </label>
              <input type="text" className="input input-bordered w-full mb-1" id="officer-name" />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Enter Presiding Officer ID:</span>
              </label>
              <input type="text" className="input input-bordered w-full mb-1" id="officer-id" />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Enter Presiding Officer Password:</span>
              </label>
              <input type="text" className="input input-bordered w-full mb-1" id="officer-pass" />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Choose Constituency:</span>
              </label>
              <select
                name="center"
                id="constituency-name"
                required
                className="select select-bordered w-full mb-1"
                onChange={(e) => setOption(e.target.value)}
              >
                <option disabled selected>
                  Constituency Name
                </option>
                {uniqueConstituency?.length > 0 ? (
                  uniqueConstituency.map((d, index) => (
                    <option key={index} value={d}>
                      {d}
                    </option>
                  ))
                ) : (
                  <option></option>
                )}
              </select>
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Choose Center:</span>
              </label>
              <select name="center" id="center-name" required className="select select-bordered w-full mb-1">
                <option disabled selected>
                  Center Name
                </option>
                {centers?.length > 0 ? (
                  centers.map((d, index) => (
                    <option key={index} value={d.centerID.toString()}>
                      {d.centerName}
                    </option>
                  ))
                ) : (
                  <option></option>
                )}
              </select>
            </div>
            <label
              className="btn btn-block my-3"
              onClick={() => {
                const name = document.getElementById("officer-name").value;
                const id = document.getElementById("officer-id").value;
                const pass = document.getElementById("officer-pass").value;
                const centerID = document.getElementById("center-name").value;

                if (name.length > 0 && id.length > 0 && pass.length > 0 && centerID > 0) {
                  const isExistPresidingOfficerID = presidingOfficerData.filter((d) => d.presidingOfficerID.toString() === id);
                  // console.log(isExist.length);

                  const isAlreadyAllocate = presidingOfficerData.filter((d) => d.centerID.toString() === centerID);
                  // console.log(isAlreadyAllocate);

                  if (isExistPresidingOfficerID.length !== 0 && presidingOfficerData.length !== 0) {
                    toast.error("Presiding Officer id already used");
                  } else if (isAlreadyAllocate.length !== 0) {
                    toast.error("Center already allocated");
                  } else {
                    document.getElementById("officer-name").value = "";
                    document.getElementById("officer-id").value = "";
                    document.getElementById("officer-pass").value = "";
                    document.getElementById("center-name").selectedIndex = 0;
                    document.getElementById("constituency-name").selectedIndex = 0;

                    successModal(name, id, pass, centerID);
                  }
                } else {
                  toast.error("Please enter data!!!");
                }
              }}
              htmlFor="add-officer-modal"
            >
              SUBMIT
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddPresidingOfficer;
