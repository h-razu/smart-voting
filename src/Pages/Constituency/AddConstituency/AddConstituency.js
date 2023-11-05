import React from 'react';
import { toast } from 'react-hot-toast';

const AddConstituency = ({ closeModal, successModal }) => {
    return (
        <>
            <input type="checkbox" id="add-constituency-modal" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box relative">
                    <label htmlFor="add-constituency-modal" className="btn btn-sm btn-circle absolute right-2 top-2" onClick={closeModal}>✕</label>
                    <h3 className="text-lg font-bold">Add New Constituency</h3>
                    <div>
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">Enter Constituency Name:</span>
                            </label>
                            <input type="text" className="input input-bordered w-full mb-1" id='constituency-name' />
                        </div>
                        <label className='btn btn-block my-3' onClick={() => {
                            const value = document.getElementById("constituency-name").value;
                            document.getElementById("constituency-name").value = "";
                            if (value.length > 0) {
                                successModal(value);
                            }
                            else {
                                toast.error("Please enter constituency name!!!")
                            }

                        }} htmlFor="add-constituency-modal">
                            SUBMIT
                        </label>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddConstituency;