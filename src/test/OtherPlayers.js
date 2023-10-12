/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from 'react';
import shapeA1 from '../puzzle-svgs/shape-A1.svg';
import shapeA2 from '../puzzle-svgs/shape-A2.svg';
import shapeA3 from '../puzzle-svgs/shape-A3.svg';
import shapeA4 from '../puzzle-svgs/shape-A4.svg';
import shapeB1 from '../puzzle-svgs/shape-B1.svg';
import shapeB2 from '../puzzle-svgs/shape-B2.svg';
import shapeB3 from '../puzzle-svgs/shape-B3.svg';
import shapeB4 from '../puzzle-svgs/shape-B4.svg';
import shapeB5 from '../puzzle-svgs/shape-B5.svg';
import shapeB6 from '../puzzle-svgs/shape-B6.svg';

import '../GameView.css';

const OtherPlayers = ({ shape, gameViewRef }) => {
  const [playerShapes, setPlayerShape] = useState({});

  useEffect(() => {
    setPlayerShape(shape);
  }, [shape]);
  

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
  };

  const getSyncedPosition = useCallback(
    (pos) => {
      const rect = gameViewRef.current.getBoundingClientRect();
      const xPct = pos?.x / pos?.width;
      const yPct = pos?.y / pos?.height;

      const size = rect.width * 0.5;

    
      return {
        x: xPct,
        y: yPct
      };
    },
    [gameViewRef]
  );

  const getBeforeHyphen = str => {
    const regex = /^([^-]+)/;
    const match = str.match(regex);
    return match[1];
  };

  if(JSON.stringify(shape) === '{}' || shape?.shapeUri === 'gameBox-main'){
    return;
  }

  if(!Object.prototype.hasOwnProperty.call(shape, 'shapeUri')){
    return;
  }

  const shapePath = SVGS[getBeforeHyphen(shape?.shapeUri)];

  const syncedPosition = getSyncedPosition(shape);
  const scale = 520/ 200;
  const width = 170 * (scale /3);
  const height = 170 * (scale/3);

  const initialSize = {
    width: 200 * (scale /3),
    height: 200 * (scale/3)
  };

  const getDimensions = () => {
    let height = initialSize?.height;
    let width = initialSize?.width;

    switch(getBeforeHyphen(shape?.shapeUri)){
    case 'shapeA2':
      height = initialSize?.height + 165;
      width = initialSize?.width + 80;
      break;
    case 'shapeA1':
      height = initialSize?.height + 50;
      width = initialSize?.width + 50;
      break;
    case 'shapeA3':
      height = initialSize?.height + 81;
      width = initialSize?.width - 91;
      break;
    case 'shapeA4':
      height = initialSize?.height + 5;
      width = initialSize?.width - 10;
      break;
    default:
      height = initialSize?.height;
      width = initialSize?.width;
    }

    return {
      height: height,
      width: width
    };
  };

  return (
    <div key={shape?.shapeUri}>
      <img src={shapePath} id={shape?.shapeUri} className="shape-piece" width={getDimensions()?.width} height={getDimensions()?.height} />
      <p className="shape-text" style={{color: 'black', fontWeight: 'bold'}}>{shape?.shapeUri}</p>
    </div>
  );
};

export default OtherPlayers;