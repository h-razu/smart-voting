import React from "react";
import toast from "react-hot-toast";
import makeStorageClient from "../../../web3Storage/makeStorageClient";

const AddParty = ({ closeModal, modalData, successModal, setLoading }) => {
  return (
    <>
      <input type="checkbox" id="add-party-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative">
          <label htmlFor="add-party-modal" className="btn btn-sm btn-circle absolute right-2 top-2" onClick={closeModal}>
            ✕
          </label>
          <h3 className="text-lg font-bold">Add Party</h3>
          <div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Enter Party Name:</span>
              </label>
              <input type="text" className="input input-bordered w-full mb-1" id="party-name" required />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Party Symbol (image):</span>
              </label>
              <input type="file" className="file-input file-input-bordered w-full mb-1" />
            </div>
            <label
              className="btn btn-block my-3"
              htmlFor="add-party-modal"
              onClick={async () => {
                setLoading(true);

                const name = document.getElementById("party-name").value;

                //check for unique name
                const isNameAllocated = modalData.filter((party) => party.partyName.toUpperCase() === name.toUpperCase());

                if (name.length > 0 && isNameAllocated.length === 0) {
                  //get image
                  const fileInput = document.querySelector('input[type="file"]');
                  // console.log(fileInput.files);

                  //upload IPFS using web3storage gateway
                  if (fileInput.files.length > 0) {
                    const fileName = fileInput.files[0].name;
                    console.log(fileName.length);

                    const client = makeStorageClient();
                    const cid = await client.put(fileInput.files);
                    console.log(cid);

                    if (cid) {
                      //check
                      const isAlreadyAllocate = modalData.filter((party) => party.cid === cid);

                      // console.log(isAlreadyAllocate);

                      if (isAlreadyAllocate.length > 0) {
                        toast.error("Symbol Already Allocated");
                        setLoading(false);
                      } else {
                        //create symbol URL
                        const symbolURl = `https://${cid}.ipfs.dweb.link/${fileName}`;

                        successModal(name, cid, symbolURl);
                        setLoading(false);
                      }
                    }
                  } else {
                    toast.error("Please Insert Data Correctly...");
                    setLoading(false);
                  }
                } else {
                  toast.error("Please Insert Data Correctly or Name Already Allocated!!!");
                  setLoading(false);
                }
              }}
            >
              SUBMIT
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddParty;
