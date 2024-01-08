import React from 'react';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <div className={`confirm-delete-modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        <p>Are you sure you want to delete?</p>
        <div className="button-container">
          <button onClick={onConfirm}>Yes, Delete</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;