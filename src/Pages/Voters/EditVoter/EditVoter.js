import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const EditVoter = ({ closeModal, successModal, data, centerData }) => {
  const [option, setOption] = useState(null);
  const [centers, setCenters] = useState([]);

  const uniqueConstituency = [...new Set(centerData.map((item) => item.constituencyName))];

  useEffect(() => {
    document.getElementById("center-name").selectedIndex = 0;
  }, [option]);

  //get center operation
  useEffect(() => {
    const cen = centerData.filter((center) => center.constituencyName === option);
    setCenters(cen);
    // console.log(cen);
  }, [option, centerData]);

  return (
    <>
      <input type="checkbox" id="edit-voter-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative">
          <label htmlFor="edit-voter-modal" className="btn btn-sm btn-circle absolute right-2 top-2" onClick={closeModal}>
            ✕
          </label>
          <h3 className="text-lg font-bold">Edit Voter</h3>
          <div>
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
                <span className="label-text">Center Name</span>
              </label>
              <select name="center" id="center-name" required className="select select-bordered w-full mb-1">
                <option disabled selected>
                  Center Name
                </option>
                {centers?.length > 0
                  ? centers.map((center, index) => (
                      <option key={index} value={center.centerID}>
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
                const centerID = document.getElementById("center-name").value;
                // console.log(centerID);

                if (constituencyName !== "Constituency Name" && centerID !== "Center Name") {
                  if (data.centerID.toNumber() === centerID) {
                    toast.error("Noting change!!!");
                  } else {
                    document.getElementById("constituency-name").selectedIndex = 0;
                    document.getElementById("center-name").selectedIndex = 0;

                    successModal(data, centerID);
                  }
                } else {
                  toast.error("Please Update Data!!!");
                }
              }}
              htmlFor="edit-voter-modal"
            >
              SUBMIT
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditVoter;
