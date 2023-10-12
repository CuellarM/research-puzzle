/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import GameView from "../../GameView";
import { playerSocket } from "../../service/ConnectSocket";
import "./TestTab.css"
import GameWorld from '../../components/GameWorld/GameWorld';
import SelectPlayer from '../../components/customSelect/SelectPlayer';

const TestTabs = ({ playerName, setOtherPlayerValues, movedPlayer, showSelect = true }) => {

  const [tabContent, setTabContent] = useState([]);
  const [playerValues, setPlayerValues] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [isContentAvailable, setIsContentAvailable] = useState(false);
  const [isPlayerValuesAvailable, setIsPlayerValuesAvailable] = useState(false);

  const emptyMessage = 'Player tabs would show here when other players start playing.';

  const gameViewRef = useRef();

  /* use effects */
  useEffect(() => {
    const filteredNames = getTabNames(playerValues);
    setFilteredPlayers(filteredNames);
  }, [playerValues])


  /* Functions */
  const getTabNames = (data) => {
    const otherPlayers = data.map((obj) => {
      const keys = Object.keys(obj);
      return keys[0]; // Assuming each object has only one key
    }).filter((name) => name !== playerName);

    return otherPlayers;
  }

  const getDataOfOtherPlayer = (otherPlayerName) => {
    const foundObject = playerValues.find((obj) => obj[otherPlayerName]);
    const objectArray = foundObject[otherPlayerName];
    setOtherPlayerValues(objectArray);
  }

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    const content = playerValues?.find((item) => Object.keys(item)[0] === tab);
    if (content) {
      setTabContent(content[tab]);
      setIsContentAvailable(true);
    } else {
      setTabContent([]);
      setIsContentAvailable(false);
    }
  };
  
  const getActivePlayerTab = (playerValues) => {
    const val = Object.keys(playerValues?.[0])?.[0];
    setActiveTab(val);
    const content = playerValues?.find((item) => Object.keys(item)[0] === val);
    setTabContent(content[val]);
    setIsContentAvailable(true);
  }

  /* End of functions */
  useEffect(() => {
    // Listen for playerValues events from other players
    playerSocket.on('playerValues', data => {
      getActivePlayerTab(data);
      setPlayerValues(data);
      setIsPlayerValuesAvailable(true);
    });
  }, [playerSocket]);

  const tabs = () => {
    return (
      <div className="tab">
        {
          filteredPlayers?.map((playerName, index) => {
            return (
              <button key={index} className="tablinks" onClick={() => getDataOfOtherPlayer(playerName)}>{playerName}</button>
            )
          })
        }
      </div>
    )
  }

  return (
    <div>
      <div className='tabContainer'>
        {isPlayerValuesAvailable ? tabs() : <div> <h4> Player tabs would show here when other players start playing. </h4> </div>}  
      </div>
    </div>
  );
};

export default TestTabs;

TestTabs.propTypes = {
  playerName: PropTypes.string
}
