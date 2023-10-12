/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';

const SelectPlayer = ({ playerObject, handleRequest, playerName }) => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if(playerObject != undefined){
      setPlayers(playerObject);
    }
  }, [playerObject]);

  const [selectedKey, setSelectedKey] = useState('');
  const [selectedObject, setSelectedObject] = useState('');

  const handleKeyChange = (event) => {
    const key = event.target.value;
    setSelectedKey(key);
    setSelectedObject('');
  };

  const handleObjectChange = (event) => {
    const objectId = event.target.value;
    setSelectedObject(objectId);
  };

  const handleButtonRequest = () => {
    // Perform the request or any desired action with the selected key and object
    handleRequest(selectedKey, selectedObject);

    //disable select button
    setSelectedObject('');
    setSelectedObject('');
  };

  const keys = players
    ?.filter(item => Object?.keys(item)?.[0] !== playerName)
    ?.map(item => Object?.keys(item)?.[0]);

  //const objects = selectedKey ? players?.find(item => Object?.keys(item)?.[0] === selectedKey)[selectedKey] : [];
  const objects = selectedKey ? players
    ?.filter(item => selectedKey in item) // Filter objects that have the desired key
    .map(item => item[selectedKey]) : [];

  return (
    <div>
      <div>
        <label htmlFor="key-select">Select Player:</label>
        <select id="key-select" value={selectedKey} onChange={handleKeyChange}>
          <option value="">-- Select a player --</option>
          {keys?.map(key => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>

        <label htmlFor="value-select">Select Piece:</label>
        <select id="value-select" value={selectedObject} onChange={handleObjectChange}>
          <option value="">-- Select a piece --</option>
          {objects?.[0]?.map(obj => {
            if(obj?.shapeUri){
              return <option key={obj?.id} value={obj?.shapeUri}>{obj?.shapeUri}</option>;
            }
          })}
        </select>
      </div>

      <div>
        <button onClick={handleButtonRequest} disabled={!selectedKey || !selectedObject}>
          Request
        </button>
      </div>
    </div>
  );
};

export default SelectPlayer;
