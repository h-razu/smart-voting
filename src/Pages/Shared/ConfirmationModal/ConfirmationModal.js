import React from 'react';

const ConfirmationModal = ({ title, message, closeModal, successModal, modalData }) => {
    return (
        <div>
            <input type="checkbox" id="confirmation-modal" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">{title}</h3>
                    <p className="py-4">{message}</p>
                    <div className="modal-action">
                        <button onClick={closeModal} type="button" className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Cancel</button>

                        <button type="button" className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
                            <label onClick={() => successModal(modalData)} htmlFor="confirmation-modal"
                                style={{ cursor: "pointer" }}>
                                DELETE
                            </label>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;