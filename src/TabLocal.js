/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import GameView from "./GameView";
import { playerSocket } from "./service/ConnectSocket";
import "./TabLocal.css"

const Tabs = ({ tabTitles }) => {
  const [activeTab, setActiveTab] = useState(tabTitles?.[0]?.id);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  useEffect(() => {
    console.log("listening");
    // Listen for playerValues events from other players
    playerSocket.on('playerValues', data => {
      console.log("get all players", data);
    });
  }, [playerSocket]);

  return (
    <div>
      <div className="tabs">
        {tabTitles?.map((tab) => (
          <div
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.title}
          </div>
        ))}
      </div>
      <div className="content">
        {tabTitles?.map((tab) => (
          <div
            key={tab.id}
            className={`tab-content ${activeTab === tab.id ? 'active' : ''}`}
          >
            {/* {tab.content} */}
            <GameView />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
