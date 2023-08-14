import React, {useState, useEffect} from "react";
import { Tabs, Tab, Box } from "@mui/material";
import { playerSocket } from "./service/ConnectSocket";
import GameView from "./GameView";
// import TabContent from "./TabContent";

const TabPage = () => {
  const [value, setValue] = useState(0);
  const [playerValues, setPlayerValues] = useState([]);

  useEffect(() => {
    // Listen for playerValues events from other players
    playerSocket.on('playerValues', data => {
      setPlayerValues(data);
    });
  }, [playerSocket]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const renderTabContent = () => {
    if (playerValues.length === 0) {
      // Render empty GameView component
      return <GameView />;
    } else {
      // Render GameView components based on playerValues

      return playerValues?.map((element) => {
        const playerId = element?.[0];
        return <GameView key={playerId} playerId={playerId} playerObjects={element?.[1]} />
      });
    }
  };

  return (
    <div className="tab-container">
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }} className="tab-container">
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="primary"
          indicatorColor="primary"
          centered
          className="tab-container"
        >
          <Tab label="Player 1" value={0} />
          <Tab label="Player 2" value={1} />
          <Tab label="Player 3" value={2} />
        </Tabs>
        {renderTabContent()}
      </Box>
    </div>
  );
};

export default TabPage;