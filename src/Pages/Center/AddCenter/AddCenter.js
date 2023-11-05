import React from 'react';
import { toast } from 'react-hot-toast';

const AddCenter = ({ closeModal, successModal, data }) => {
    // console.log(data);
    return (
        <>
            <input type="checkbox" id="add-center-modal" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box relative">
                    <label htmlFor="add-center-modal" className="btn btn-sm btn-circle absolute right-2 top-2" onClick={closeModal}>✕</label>
                    <h3 className="text-lg font-bold">Add New Center</h3>
                    <div>
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">Choose Constituency:</span>
                            </label>
                            <select name='center' id='constituency-name' required className="select select-bordered w-full mb-1">
                                <option disabled selected>Constituency Name</option>
                                {
                                    data?.length > 0 ? data.map((d, index) =>
                                        <option
                                            key={index}
                                            value={d.constituencyName}
                                        >{d.constituencyName}</option>) : <option></option>
                                }
                            </select>
                        </div>
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">Enter Center Name:</span>
                            </label>
                            <input type="text" className="input input-bordered w-full mb-1" id='center-name' required />
                        </div>
                        <label className='btn btn-block my-3' onClick={() => {
                            //constituency name
                            const constituencyName = document.getElementById("constituency-name").value;
                            const centerName = document.getElementById("center-name").value;

                            if (constituencyName !== "Constituency Name" && centerName.length > 0) {
                                document.getElementById("constituency-name").selectedIndex = 0
                                document.getElementById("center-name").value = "";

                                successModal(constituencyName, centerName);
                            }
                            else {
                                toast.error("Please Input Data Correctly!!!")
                            }

                        }} htmlFor="add-cen-modal">
                            SUBMIT
                        </label>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddCenter;