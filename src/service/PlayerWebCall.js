// import React, { useState, useEffect } from 'react';
// import { playerSocket } from './ConnectSocket';


// const App = () => {
//   const [myPlayerId, setMyPlayerId] = useState(null);
//   const [playerValues, setPlayerValues] = useState({});

//   useEffect(() => {
//     // Listen for playerValues events from other players
//     playerSocket.on('playerValues', (playerId, values) => {
//       if (playerId !== myPlayerId) {
//         setPlayerValues((prevValues) => ({
//           ...prevValues,
//           [playerId]: values,
//         }));
//       }
//     });

//     // Register new player and receive player ID
//     playerSocket.emit('registerPlayer', (playerId) => {
//       setMyPlayerId(playerId);
//     });

//     return () => {
//         playerSocket.disconnect();
//     };
//   }, [myPlayerId]);

//   const updateValues = (newValues) => {
//     playerSocket.emit('playerValues', myPlayerId, newValues);
//     setPlayerValues((prevValues) => ({
//       ...prevValues,
//       [myPlayerId]: newValues,
//     }));
//   };

//   return (
//     <div>
//       <h1>Multiplayer Game</h1>
//       {myPlayerId && (
//         <Player
//           playerId={myPlayerId}
//           values={playerValues[myPlayerId]}
//           onValuesChange={updateValues}
//         />
//       )}
//       {Object.entries(playerValues).map(([playerId, values]) => {
//         if (playerId !== myPlayerId) {
//           return (
//             <Player
//               key={playerId}
//               playerId={playerId}
//               values={values}
//               onValuesChange={() => {}}
//             />
//           );
//         }
//       })}
//     </div>
//   );
// };

// const Player = ({ playerId, values, onValuesChange }) => {
//   const [newValues, setNewValues] = useState(values);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewValues((prevValues) => ({
//       ...prevValues,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onValuesChange(newValues);
//   };

//   return (
//     <div>
//       <h2>Player {playerId}</h2>
//       <form onSubmit={handleSubmit}>
//         <label>
//           Value 1:
//           <input
//             type="number"
//             name="value1"
//             value={newValues.value1}
//             onChange={handleInputChange}
//           />
//         </label>
//         <br />
//         <label>
//           Value 2:
//           <input
//             type="number"
//             name="value2"
//             value={newValues.value2}
//             onChange={handleInputChange}
//           />
//         </label>
//         <br />
//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// };

// export default App;
