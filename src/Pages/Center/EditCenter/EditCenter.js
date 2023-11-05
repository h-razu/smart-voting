import React from "react";
import { toast } from "react-hot-toast";

const EditCenter = ({ closeModal, successModal, data, constituency }) => {
  return (
    <>
      <input type="checkbox" id="edit-center-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative">
          <label htmlFor="edit-center-modal" className="btn btn-sm btn-circle absolute right-2 top-2" onClick={closeModal}>
            ✕
          </label>
          <h3 className="text-lg font-bold">Edit Center</h3>
          <div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Choose Constituency:</span>
              </label>
              <select name="center" id="constituency-name" required className="select select-bordered w-full mb-1">
                <option disabled selected>
                  {data.constituencyName}
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
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Choose Center:</span>
              </label>
              <select name="center" id="center-name" required className="select select-bordered w-full mb-1">
                <option selected>{data.centerName}</option>
              </select>
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Enter Center New Name:</span>
              </label>
              <input type="text" className="input input-bordered w-full mb-1" id="center-new-name" />
            </div>
            <label
              className="btn btn-block my-3"
              onClick={() => {
                //constituency name
                const constituencyNewName = document.getElementById("constituency-name").value;
                const centerNewName = document.getElementById("center-new-name").value;

                if (constituencyNewName !== "Constituency Name" && (constituencyNewName !== data.constituencyName || centerNewName.length !== 0)) {
                  document.getElementById("constituency-name").selectedIndex = 0;
                  document.getElementById("center-new-name").value = "";

                  if (centerNewName.length > 0) {
                    successModal(constituencyNewName, centerNewName, data.centerID.toNumber());
                  } else {
                    successModal(constituencyNewName, data.centerName, data.centerID.toNumber());
                  }
                } else {
                  toast.error("Please Update Data!!!");
                }
              }}
              htmlFor="edit-center-modal"
            >
              SUBMIT
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditCenter;
