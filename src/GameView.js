import React, {useState, useEffect} from "react";
import "./GameView.css";
import { playerSocket } from "./service/ConnectSocket";


const GameView = ({ key, playerId, playerObjects }) => {
  const handleShapeClick = () => {}; // No-op function for click event

  console.log("the shapes in the game", playerObjects)

  const [myPlayerId, setMyPlayerId] = useState(null);
  const [playerValues, setPlayerValues] = useState([]);

  console.log("the player objects", playerObjects);

  useEffect(() => {
    setPlayerValues(playerObjects)
  }, [playerObjects])

  // useEffect(() => {
  //   console.log("the player values", playerValues);
  // }, [playerValues])

  // useEffect(() => {
  //   console.log("listening")
  //   // Listen for playerValues events from other players
  //   playerSocket.on('playerValues', (playerId, values) => {
  //     console.log("th payer ID", playerId)
  //     if (playerId !== myPlayerId) {
  //       setPlayerValues((prevValues) => ({
  //         ...prevValues,
  //         [playerId]: values,
  //       }));
  //     }
  //   });
  // },[playerSocket]);

  // useEffect(() => {
  //   playerSocket.on('playerValues', (playerId, values) => {
  //     console.log("received in game", playerId, values)
  //     setPlayerValues(values);
  //   });

  //     // Listen for shapeUpdated events
  // playerSocket.on("updatedPlayerValues", (playerId, updatedShape) => {
  //   console.log("received updated in game", playerId, updatedShape)
  //   setPlayerValues((prevDroppedShapes) => {
  //     const shapeIndex = prevDroppedShapes.findIndex((shape) => shape.id === updatedShape.id);
  //     if (shapeIndex === -1) {
  //       return prevDroppedShapes;
  //     }
  //     return [
  //       ...prevDroppedShapes.slice(0, shapeIndex),
  //       updatedShape,
  //       ...prevDroppedShapes.slice(shapeIndex + 1),
  //     ];
  //   });

  //   console.log("new player valaues", playerValues)
  // });


  // }, [playerSocket, playerName])

  

  const shapes = [
    {id: "purple", position: "absolute", left: "103.625px", top: "42.75px", borderWidth: "43.3px 25px 0px", borderColor: "rgb(177, 13, 201) transparent transparent", vertices: [[464.5, 214], [414.5, 300.6], [514.5, 300.6]]},
    {id: "green", position: "absolute", left: "31.625px", top: "46.25px", borderWidth: "0px 25px 43.3px", borderColor: "transparent transparent rgb(46, 204, 64)", vertices: [[313.5, 228], [263.5, 314.6], [363.5, 314.6]]},
    {id: "red", position: "absolute", left: "82.125px", top: "92.5px", borderWidth: "0px 25px 43.3px", borderColor: "transparent transparent rgb(255, 65, 54)", vertices: [[414.5, 413], [364.5, 499.6], [464.5, 499.6]]},
    {id: "blue", position: "absolute", left: "24.375px", top: "105.5px", borderWidth: "0px 25px 43.3px", borderColor: "transparent transparent rgb(0, 116, 217)", vertices: [[251.5, 175], [201.5, 261.6], [301.5, 261.6]]},
  ];
  
function renderDroppedShapes() {
  return playerValues?.map((shape) => {
    return (
      <div
        key={shape.id}
        className={`shape ${shape.shape}`}
        style={{
          borderColor: shape.borderColor,
          borderWidth: shape.borderWidth,
          width: 0,
          height: 0,
          borderStyle: "solid",
          position: "absolute",
          justifyContent: "center",
          alignItems: "center",
          left: shape.position?.x ? `${shape.position.x + 50}px` : shape.left,
          top: shape.position?.y ? `${shape.position.y + 50}px` : shape.top,
          transform: shape.transfrom
        }}
        id={shape.id}
      >
       <span className="shape-text">{shape.name}</span>
      </div>
    );
  });
}


  return (
    <div className="game-view-container">
      <div id="remoteGameBox" className="box">
        {renderDroppedShapes()}
      </div>
    </div>
  );
};

export default GameView;