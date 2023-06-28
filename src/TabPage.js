import React, {useState, useEffect} from "react";
import { Tabs, Tab, Box } from "@mui/material";
import { Routes, Route, Link, Outlet } from "react-router-dom";
import { playerSocket } from "./service/ConnectSocket";
import GameView from "./GameView";
// import TabContent from "./TabContent";

const TabPage = () => {
  const [value, setValue] = useState(0);
  const [playerValues, setPlayerValues] = useState([]);

  useEffect(() => {
    console.log("the player values", playerValues);
  }, [playerValues]);

  useEffect(() => {
    console.log("listening");
    // Listen for playerValues events from other players
    playerSocket.on('playerValues', data => {
      console.log("get all players", data);
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
      console.log("the player values in tab page", playerValues)

      return playerValues?.map((element) => {
        const playerId = element?.[0]; 
        console.log("the elements", element)
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


// const TabPage = () => {
//   const [value, setValue] = useState(0);
//   const [playerValues, setPlayerValues] = useState([]);

//   useEffect(() => {
//     console.log("the player values", playerValues);
//   }, [playerValues]);

//   useEffect(() => {
//     console.log("listening");
//     // Listen for playerValues events from other players
//     playerSocket.on('playerValues', data => {
//       console.log("get all players", data);
//       setPlayerValues(data);
//     });
//   }, [playerSocket]);

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   const renderTabContent = () => {
//     if (playerValues.length === 0) {
//       // Render tabs with index names
//       return (
//         <>
//           <Tab label="Player 1" value={0} />
//           <Tab label="Player 2" value={1} />
//           <Tab label="Player 3" value={2} />
//         </>
//       );
//     } else {
//       // Render GameView components based on playerValues
//       return playerValues.map((player, index) => (
//         <GameView key={player.playerId} playerId={player.playerId} playerObjects={player[player.playerId]} />
//       ));
//     }
//   };

//   return (
//     <div className="tab-container">
//       <Box sx={{ borderBottom: 1, borderColor: 'divider' }} className="tab-container">
//         <Tabs
//           value={value}
//           onChange={handleChange}
//           textColor="primary"
//           indicatorColor="primary"
//           centered
//           className="tab-container"
//         >
//           {renderTabContent()}
//         </Tabs>
//       </Box>
//     </div>
//   );
// };

// export default TabPage;

// const TabContent = (props) => {
//     const { children, value, index, ...other } = props;
    
  
//     return (
//       <div
//         role="tabpanel"
//         hidden={value !== index}
//         {...other}
//       >
//         {value === index && <Box>{children}</Box>}
//       </div>
//     );
//   };
  
//   const TabPage = () => {
//     const [value, setValue] = useState(0);
//     const [playerValues, setPlayerValues] = useState([]);

//     useEffect(() => {
//       console.log("the player values", playerValues);
//     }, [playerValues])
  
//     useEffect(() => {
//       console.log("listening")
//       // Listen for playerValues events from other players
//       playerSocket.on('playerValues', data => {
//         console.log("get all players", data)
//           setPlayerValues(data);
//       });
//     },[playerSocket]);
  
//     const handleChange = (event, newValue) => {
//       setValue(newValue);
//     };
  
//     const renderTabContent = () => {
//       switch (value) {
//         case 0:
//           return <GameView />;
//         case 1:
//           return <GameView />;
//         case 2:
//           return <GameView />;
//         default:
//           return null;
//       }
//     };
  
//     return (
//       <div className="tab-container">
//         <Box sx={{ borderBottom: 1, borderColor: 'divider' }} className="tab-container">
//           <Tabs
//             value={value}
//             onChange={handleChange}
//             textColor="primary"
//             indicatorColor="primary"
//             centered
//             className="tab-container"
//           >
//             <Tab label="Player 1" value={0} />
//             <Tab label="Player 2" value={1} />
//             <Tab label="Player 3" value={2} />
//           </Tabs>
//           {renderTabContent()}
//         </Box>
//       </div>
//     );
//   };
  
//   export default TabPage;


  
