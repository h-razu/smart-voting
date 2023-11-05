import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AddAsVoter = ({ closeModal, successModal, modalData, constituencyData, centerData }) => {
  const [option, setOption] = useState(null);
  const [centers, setCenters] = useState([]);

  //get center operation
  useEffect(() => {
    document.getElementById("center-name").selectedIndex = 0;

    setCenters([]);
    let centerArr = [];

    centerData.forEach((element) => {
      if (element.constituencyName === option) {
        centerArr.push(element);
      }
    });

    setCenters(centerArr);
  }, [option, centerData]);

  return (
    <>
      <input type="checkbox" id="add-voter-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative">
          <label htmlFor="add-voter-modal" className="btn btn-sm btn-circle absolute right-2 top-2" onClick={closeModal}>
            ✕
          </label>
          <h3 className="text-lg font-bold">Add Voter</h3>
          <div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">NID No.</span>
              </label>
              <input type="text" defaultValue={modalData.nid} readOnly className="input input-bordered w-full mb-1" />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input type="text" defaultValue={modalData.name} readOnly className="input input-bordered w-full mb-1" />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Father Name</span>
              </label>
              <input type="text" defaultValue={modalData.father} readOnly className="input input-bordered w-full mb-1" />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Constituency Name</span>
              </label>
              <select
                name="constituency"
                id="constituency-name"
                required
                className="select select-bordered w-full mb-1"
                onChange={(e) => setOption(e.target.value)}
              >
                <option disabled selected>
                  Constituency Name
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
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Center Name</span>
              </label>
              <select name="center" id="center-name" required className="select select-bordered w-full mb-1">
                <option disabled selected>
                  Center Name
                </option>
                {centers?.length > 0
                  ? centers.map((center, index) => (
                      <option key={index} value={center.centerName}>
                        {center.centerName}
                      </option>
                    ))
                  : null}
              </select>
            </div>
            <label
              className="btn btn-block my-3"
              onClick={() => {
                //constituency name
                const constituencyName = document.getElementById("constituency-name").value;
                const centerName = document.getElementById("center-name").value;

                if (constituencyName !== "Constituency Name" && centerName !== "Center Name") {
                  document.getElementById("constituency-name").selectedIndex = 0;
                  document.getElementById("center-name").selectedIndex = 0;

                  let _centerID;
                  centers.forEach((element) => {
                    if (element.centerName === centerName) {
                      _centerID = element.centerID;

                      successModal(modalData, _centerID);
                    }
                  });
                } else {
                  toast.error("Please Choose Constituency and Center!!!");
                }
              }}
              htmlFor="add-vote-modal"
            >
              SUBMIT
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddAsVoter;
