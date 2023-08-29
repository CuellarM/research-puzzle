/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, {useState, useEffect, useCallback} from "react";
import shapeA1 from "./puzzle-svgs/shape-A1.svg";
import shapeA2 from "./puzzle-svgs/shape-A2.svg";
import shapeA3 from "./puzzle-svgs/shape-A3.svg";
import shapeA4 from "./puzzle-svgs/shape-A4.svg";
import shapeB1 from "./puzzle-svgs/shape-B1.svg";
import shapeB2 from "./puzzle-svgs/shape-B2.svg";
import shapeB3 from "./puzzle-svgs/shape-B3.svg";
import shapeB4 from "./puzzle-svgs/shape-B4.svg";
import shapeB5 from "./puzzle-svgs/shape-B5.svg";
import shapeB6 from "./puzzle-svgs/shape-B6.svg";

import "./GameView.css";
import { Tooltip } from "react-tooltip";

const GameView = ({ playerObjects, gameViewRef }) => {
  const [playerValues, setPlayerValues] = useState([]);

  useEffect(() => {
    setPlayerValues(playerObjects)
  }, [playerObjects])
  

  const SVGS = {
    'shapeA1': shapeA1,
    'shapeA2': shapeA2,
    'shapeA3': shapeA3,
    'shapeA4': shapeA4,
    'shapeB1': shapeB1,
    'shapeB2': shapeB2,
    'shapeB3': shapeB3,
    'shapeB4': shapeB4,
    'shapeB5': shapeB5,
    'shapeB6': shapeB6
  }

const getSyncedPosition = useCallback(
  (pos) => {
    const rect = gameViewRef.current.getBoundingClientRect();
    const xPct = pos?.x / pos?.width;
    const yPct = pos?.y / pos?.height;

    const size = rect.width * 0.5;

    
    return {
      x: xPct,
      y: yPct
    }
  },
  [gameViewRef]
);

function renderDroppedShapes() {
  return playerValues?.map((shape) => {
    if(JSON.stringify(shape) === '{}'){
      return;
    }

    if(!Object.prototype.hasOwnProperty.call(shape, 'shapeUri')){
      return;
    }

    const shapePath = SVGS[shape?.shapeUri];

    const syncedPosition = getSyncedPosition(shape);

    return (
      <div key={shape?.shapeUri} style={{position: 'absolute', transform: `translate(${shape?.x}px, ${shape?.y}px) rotate(${shape?.angle}deg)`}}>
        <img src={shapePath} id={shape?.shapeUri} className="shape-piece" width="48%" height="48%" />
        <p className="shape-text" style={{color: "black", fontWeight: "bold"}}>{shape?.shapeUri}</p>
        {/* <a className="shape-text"         
        key={shape?.shapeUri}
        data-tooltip-id="my-tooltip"
        data-tooltip-content={shape?.shapeUri}>🤔</a> */}
      </div>
    );
  });
}


  return (
      <div>
        {renderDroppedShapes()}
        <Tooltip
          id="my-tooltip"
        />
      </div>
  );
};

export default GameView;