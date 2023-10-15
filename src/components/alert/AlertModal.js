/* eslint-disable react/prop-types */
import React from 'react';
import Modal from 'react-modal';
import shapeA1 from '../../puzzle-svgs/shape-A1.svg';
import shapeA2 from '../../puzzle-svgs/shape-A2.svg';
import shapeA3 from '../../puzzle-svgs/shape-A3.svg';
import shapeA4 from '../../puzzle-svgs/shape-A4.svg';
import shapeB1 from '../../puzzle-svgs/shape-B1.svg';
import shapeB2 from '../../puzzle-svgs/shape-B2.svg';
import shapeB3 from '../../puzzle-svgs/shape-B3.svg';
import shapeB4 from '../../puzzle-svgs/shape-B4.svg';
import shapeB5 from '../../puzzle-svgs/shape-B5.svg';
import shapeB6 from '../../puzzle-svgs/shape-B6.svg';

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
  
  const SVGS = {
    'shapeA1': shapeA1,
    'shapeA2': shapeA2,
    'shapeA3': shapeA3,
    'shapeA4': shapeA4,
    'shapeB1': shapeB1,
    'shapeB2': shapeB2,
    'shapeB3': shapeB3,
    'shapeB4': shapeB4,
    'shapeB5': shapeB5,
    'shapeB6': shapeB6
  };

  const getBeforeHyphen = str => {
    const regex = /^([^-]+)/;
    const match = str.match(regex);
    return match[1];
  };

  const shapePath = spriteName ? SVGS[getBeforeHyphen(spriteName)] : '';

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onRequestClose={handleCloseModal}
        style={customStyles}
        contentLabel="Request for Shape"
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <div>{`Do you want to exchange your piece ${spriteName} with player - ${playerName}`}</div>
          <img src={shapePath} width={120} height={120} style={{ alignSelf: 'center', marginTop: '10px' }} />
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
            <button style={{ color: 'white', backgroundColor: 'green', margin: '0 10px' }} onClick={() => acceptShapeRequest()}>Accept</button>
            <button style={{ color: 'white', backgroundColor: 'red' }} onClick={() => handleCloseModal()}>Decline</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AlertModal;