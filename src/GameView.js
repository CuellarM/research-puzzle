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
    console.log('re-rendering', playerObjects)
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

const getBeforeHyphen = str => {
  const regex = /^([^-]+)/;
  const match = str.match(regex);
  return match[1];
}

function renderDroppedShapes() {
  console.log('the player values', playerValues)
  return playerValues?.map((shape) => {
    console.log('there is a shape', shape)
    if(JSON.stringify(shape) === '{}' || shape?.shapeUri === 'gameBox-main'){
      return;
    }

    if(!Object.prototype.hasOwnProperty.call(shape, 'shapeUri')){
      return;
    }

    const shapePath = SVGS[getBeforeHyphen(shape?.shapeUri)];

    const syncedPosition = getSyncedPosition(shape);
    const scale = 620/ 200;
    const width =  200 * (scale /3);
    const height = 200 * (scale/3);

    const initialSize = {
      width: 200 * (scale /3),
      height: 200 * (scale/3)
    }

    const getDimensions = () => {
      let height = initialSize?.height;
      let width = initialSize?.width;

      switch(getBeforeHyphen(shape?.shapeUri)){
        case 'shapeA2':
          height = initialSize?.height + 220;
          width = initialSize?.width + 160;
          break;
        case 'shapeA1':
          height = initialSize?.height + 150;
          width = initialSize?.width + 150;
          break;
        case 'shapeA3':
          height = initialSize?.height + 81;
          width = initialSize?.width - 91;
          break;
        case 'shapeA4':
          height = initialSize?.height + 90;
          width = initialSize?.width - 10;
          break;
        default:
          height = initialSize?.height;
          width = initialSize?.width;
      }

      return {
        height: height,
        width: width
      }
    }

    return (
      <div key={shape?.shapeUri} style={{position: 'absolute', transform: `translate(${shape?.x}px, ${shape?.y}px) rotate(${shape?.angle}deg)`}}>
        {console.log('the shape events', shape?.shapeUri)}
        <img src={shapePath} id={shape?.shapeUri} className="shape-piece" width={getDimensions()?.width} height={getDimensions()?.height} />
        <p className="shape-text" style={{color: "black", fontWeight: "bold"}}>{shape?.shapeUri}</p>
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