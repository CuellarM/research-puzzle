/* eslint-disable react/prop-types */
import React from 'react';
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const AlertModal = ({isOpen, setModalOpen, requestObject, handleRemoveShape}) => {
  const { spriteName, playerName, gameSprites } = requestObject;
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const acceptShapeRequest = () => {
    handleRemoveShape(spriteName, playerName, gameSprites);
    setModalOpen(false);
  };

  return(
    <div>
      <Modal
        isOpen={isOpen}
        //   onAfterOpen={afterOpenModal}
        onRequestClose={handleCloseModal}
        style={customStyles}
        contentLabel="Request for Shape"
      >
        <div>{`Do you want to exchange you piece  ${spriteName} with player - ${playerName}`}</div>
        <div style={{marginTop: '20px', alignItems: 'center', justifyItems: 'space-between', display: 'flex'}}>
          <button style={{color: 'white', backgroundColor: 'green', marginInline: '20px'}} onClick={() => acceptShapeRequest()}>Accept</button>
          <button style={{color: 'white', backgroundColor: 'red'}} onClick={() => handleCloseModal()}>Decline</button>
        </div>
      </Modal>
    </div>
  );
};

export default AlertModal;