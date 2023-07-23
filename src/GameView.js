/* eslint-disable react/prop-types */
import React, {useState, useEffect} from "react";
import "./GameView.css";

const GameView = ({ playerObjects }) => {
  const [playerValues, setPlayerValues] = useState([]);

  useEffect(() => {
    setPlayerValues(playerObjects)
  }, [playerObjects])
  
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