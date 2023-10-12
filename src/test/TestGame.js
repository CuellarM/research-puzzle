/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react';

import { playerSocket } from '../service/ConnectSocket';
import './TestGame.css';

import AlertModal from '../components/alert/AlertModal';
import SelectPlayer from '../components/customSelect/SelectPlayer';
import { shapeSvg, shapeSvg1, shapeSvg2, shapeSvg3 } from '../images';
import OtherPlayers from './OtherPlayers';
import TestShape from './TestShape';
import TestTabs from './tabs/TestTabs';
const testObjects = [
  {
    id: 'p2-01-A1',
    isVisible: true,
    shapeUri: 'shapeA1-029',
    owner: 'bhjjh',
    isOnBoard: true,
    x: 0,
    y: 0
  },
  {
    id: 'p2-02-A1',
    isVisible: true,
    shapeUri: 'shapeA1-030',
    owner: 'bhjjh',
    isOnBoard: true,
    x: 0,
    y: 0
  },
  {
    id: 'p2-01-A4',
    isVisible: true,
    shapeUri: 'shapeA4-031',
    owner: 'bhjjh',
    isOnBoard: true,
    x: 0,
    y: 0
  },
  {
    id: 'p2-01-A3',
    isVisible: true,
    shapeUri: 'shapeA3-032',
    owner: 'bhjjh',
    isOnBoard: true,
    x: 0,
    y: 0
  }
];
  

let shapelist = [];
shapelist.push(shapeSvg);
shapelist.push(shapeSvg1);
shapelist.push(shapeSvg2);
shapelist.push(shapeSvg3);



function TestGame({gameObjects, playersInRoom, playerName, roomId}) {

  /* Start of state and variables */
  const [objects, setBoardObjects] = useState(testObjects);
  const [newGameSprite, setGameObjects] = useState(testObjects);
  const [playerId, setPlayerId] = useState(playerName);
  const [isAlertModalOpen, setAlertModalOpen] = useState(false);
  const [requestObject, setRequestObject] = useState({});
  const [movedShape, setMovedShape] = useState({});
  const [otherPlayerValues, setOtherPlayerValues] = useState([]);
  const [shapeRefs, setShapeRefs] = useState([]);
  const [playgroundObjects, setPlaygroundObjects] = useState([]);

  const targetDropRef = useRef(null);
  const gameViewRef = useRef();
  const bottomContainerRef = useRef();

  let testSide = [];

  /* End of state and variables */

  const updateObjectsArray = (idToRemove, updatedObject) => {
    setBoardObjects(prev => prev.map(obj => {
      if(obj.shape === updatedObject) {
        return {...obj, isOnBoard: !obj.isOnBoard};  
      }
      return obj;
    }));
  };



  /* Start of useEffects */
  // this tracks the request from another player for a sprite
  useEffect(() => {
    playerSocket.on('spriteRequest', (requestingPlayer, spriteName) => {
      setAlertModalOpen(true);
      setRequestObject({
        spriteName: spriteName,
        playerName: requestingPlayer,
        gameSprites: newGameSprite
      });
    });
  }, [playerSocket]);

  // if a shape is moved, push that event to other players
  useEffect(() => {
    emitSpritePositionToOtherPlayers(movedShape, false);
    testSide.push(movedShape);
    setOtherPlayerValues(testSide);
  }, [movedShape]);

  useEffect(() => {
    setShapeRefs(objects?.map(() => React.createRef()));
  }, [objects]);

  /* End of useEffects */


  /* start of functions */
  // this removes the shape and passes it on to the requesting player
  const handleRemoveShape = (shapeName, requestingPlayer) => {
    const playerObject = objects.find((obj) => obj?.shapeUri === shapeName);

    if(playerObject){
      setBoardObjects(prev => prev.map(obj => {
        if(obj?.shapeUri === shapeName) {
          return {...obj, owner: requestingPlayer, isOnBoard: !obj.isOnBoard};
        }
        return obj; 
      }));
      playerSocket.emit('sendToRequestingPlayer', requestingPlayer, playerObject);
      emitSpritePositionToOtherPlayers(playerObject, true);
    }
  };

  const moveItem = (item, index) => {
    // Create a copy of the source array
    const newSourceArray = [...objects];
      
    // Remove the item from the source array
    const removedObject = newSourceArray.splice(index, 1);
      
    // Update source array state
    setBoardObjects(newSourceArray);
      
    // Extract the removed item
    const newlyRemoved = removedObject[0];
      
    // Add the removed item to the target array
    const playgroundPieces = [...playgroundObjects, newlyRemoved];
      
    // Update target array state
    setPlaygroundObjects(playgroundPieces);
  };

  // emit the removal to other players
  // this ensure that it is removed from their watching screen
  const emitSpritePositionToOtherPlayers = (droppedShape, isRemove) => {
    playerSocket.emit('playerValues', roomId, playerName, droppedShape, isRemove);
  };

  const validateOtherPlayerShape = (shape) => {
    if(JSON.stringify(shape) === '{}' || shape?.shapeUri === 'gameBox-main'){
      return false;
    }
      
    if(!Object.prototype.hasOwnProperty.call(shape, 'shapeUri')){
      return false;
    }
    return true;
  };

  /* end of functions */

  return (
    <div>
      <div className="tabsContainer">
        <TestTabs playerName={playerName} setOtherPlayerValues={setOtherPlayerValues}/>
      </div>
      <div className="container">

        <div className="playground" ref={gameViewRef} style={{position: 'relative'}}>
          {
            otherPlayerValues?.filter(shape => validateOtherPlayerShape(shape)).map((shape, index) => {
              return (
                <div key={index} 
                  // style={{transform: `translate(${shape?.deltaX}px, ${shape?.deltaY}px) rotate(${shape?.angle}deg)`}}
                  style={{
                    position: 'absolute',
                    top: shape?.deltaY,
                    left: shape?.deltaY,
                    transition: 'transform 0.2s',
                  }}
                >
                  <OtherPlayers shape={shape} gameViewRef={gameViewRef} />
                </div>
              );
            })
          }
        </div>

        <div className="playground" id="gameBox" ref={targetDropRef}> 
          {playgroundObjects.filter(shape => (shape?.isVisible && (shape?.owner === playerId))).map((shape, index) => {
            return (
              <div key={index} ref={shapeRefs[index]}>
                <TestShape 
                  key={index} 
                  shape={shape} 
                  handleShapeClick={() => console.log('hsfhsh')} 
                  handleDragStart={(e, data) => console.log(e,data)}
                  shapeRef = {shapeRefs[index]}  
                  theRef={targetDropRef} 
                  shapeUri={shape?.shapeUri}
                  setMovedShape={setMovedShape}
                  addOrUpdate={() => console.log('upodate')}
                  setBoardObjects={setBoardObjects}
                  bottomContainerRef={bottomContainerRef}
                  addToPlayground = {moveItem}
                />
              </div>
            );

          })}
        </div>
      </div>
      <div className="bottomContainer">
        <div className='bottomSelectContainer'>
          <h2>Request shapes from team players</h2>
          <SelectPlayer playerObject={[]} handleRequest={{}} playerName={''}/>
          <div>
          </div>
        </div>
        <div className='bottomThumbnailContainer' ref={bottomContainerRef}>
          {objects.filter(shape => (shape?.isVisible && (shape?.owner === playerId))).map((shape, index) => {
            return (
              <div className='onBoardShape' key={index} ref={shapeRefs[index]}>
                <TestShape 
                  index={index} 
                  shape={shape} 
                  handleShapeClick={() => console.log('hsfhsh')} 
                  handleDragStart={(e, data) => console.log(e,data)}
                  shapeRef = {shapeRefs[index]}  
                  theRef={targetDropRef} 
                  shapeUri={shape?.shapeUri}
                  setMovedShape={setMovedShape}
                  addOrUpdate={() => console.log('upodate')}
                  setBoardObjects={setBoardObjects}
                  bottomContainerRef={bottomContainerRef}
                  addToPlayground = {moveItem}
                />
              </div>
            );

          })}
        </div>
      </div>
      <div>
        <AlertModal isOpen={isAlertModalOpen} setModalOpen={setAlertModalOpen} requestObject={requestObject} handleRemoveShape={handleRemoveShape}/>
      </div>
    </div>
  );
}

export default TestGame;