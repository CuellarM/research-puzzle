import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import GameView from "./GameView";
import { playerSocket } from "./service/ConnectSocket";
import "./TabLocal.css"

const Tabs = ({ playerName }) => {

  const [tabContent, setTabContent] = useState([]);
  const [playerValues, setPlayerValues] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [isContentAvailable, setIsContentAvailable] = useState(false);
  const [isPlayerValuesAvailable, setIsPlayerValuesAvailable] = useState(false);

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
  useEffect(() => {
    // Listen for playerValues events from other players
    playerSocket.on('playerValues', data => {
      getActivePlayerTab(data);
      setPlayerValues(data);
      setIsPlayerValuesAvailable(true);
    });
  }, [playerSocket]);

  return (
    <div>
{!isPlayerValuesAvailable && <div> <h4> Player tabs would show here when other players start playing. </h4> </div>}
      {isPlayerValuesAvailable &&       
      <div className="tabs">
        {playerValues?.map((item) => {
          const tabTitle = Object.keys(item).filter(key => key !== playerName)[0];
          return (
            <div
              key={tabTitle}
              className={`tab ${activeTab === tabTitle ? 'active' : ''}`}
              onClick={() => handleTabClick(tabTitle)}
            >
              {tabTitle}
            </div>
          );
        })}
      </div>
      }
      {!isContentAvailable && <div className='content'> <GameView /></div>}
      {isContentAvailable &&       
      <div className="content">
            <GameView playerId={activeTab}  playerObjects={tabContent}/>
      </div>
      }
    </div>
  );
};

export default Tabs;

Tabs.propTypes = {
  playerName: PropTypes.string
}
