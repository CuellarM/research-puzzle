/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import Modal from 'react-modal';
import Complete from './Complete.png';
import './Hint.css';

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

const HintModal = ({isOpen, setModalOpen}) => {
  const handleCloseModal = () => {
    setModalOpen(false);
  };
  const [isRotated, setRotated] = useState(false);

  const handleImageRotate= () => {
    setRotated(!isRotated);
  };

  const rotateClass = isRotated ? 'rotate' : ''; // Define the CSS class conditionally


  return(
    <div>
      <Modal
        isOpen={isOpen}
        //   onAfterOpen={afterOpenModal}
        onRequestClose={handleCloseModal}
        style={customStyles}
        contentLabel="Request for Shape"
      >
        <div style={{padding: '10px'}}>
          <img src={Complete} width={420} height={420} className={`image ${rotateClass}`}/>
          <div style={{marginTop: '20px', alignItems: 'center', justifyContent: 'center', display: 'flex', alignSelf: 'center', padding: '10px'}}>
            <button style={{color: 'white', backgroundColor: 'green', margin: '5px'}} onClick={() => handleImageRotate()}>Rotate</button>
            <button style={{color: 'white', backgroundColor: 'red', margin: '5px'}} onClick={() => handleCloseModal()}>Close</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default HintModal;