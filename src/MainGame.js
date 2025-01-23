/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react';
import { Tooltip } from 'react-tooltip';
import './AnotherTest.css';
import Tabs from './TabLocal';
import GameWorld from './components/GameWorld/GameWorld';
import ShapeComponent from './components/ShapeComponent/ShapeComponent';
import AlertModal from './components/alert/AlertModal';
import HintModal from './components/hint/Hint';
import { PLAYER_PLAYS_CACHE } from './constants/Constants';
import { shapeSvg, shapeSvg1, shapeSvg2, shapeSvg3 } from './images';
import { playerSocket } from './service/ConnectSocket';

const MainGame = ({gameObjects, playersInRoom, playerName, roomId, level}) => {

  const [playerId, setPlayerId] = useState('');
  const [otherPlayerValues, setOtherPlayerValues] = useState([]);
  const [removeName, setRemoveName] = useState('');
  const [droppedShapes, setDroppedShapes] = useState([]);
  const [requestedObject, setRequestedObject] = useState([]);
  const [movedShape, setMovedShape] = useState({});
  const [newGameSprite, setGameObjects] = useState(gameObjects);
  const [localStorageItems, setLocalStorageItems] = useState([]);
  const [playedValues, setPlayedValues] = useState([]);

  const [isModalOpen, setModalOpen] = useState(false);
  const [isHintModalOpen, setHintModalOpen] = useState(false);
  const [requestObject, setRequestObject] = useState({});
  const [objectJustReceived, setObjectJustReceived] = useState({});
  const playedRef = useRef([]);

  // useEffect(() => {
  //   setGameObjects(gameObjects);
  // }, [gameObjects])

  //room + name => key
  const localStorageKey = playerName + roomId + level;
  localStorageKey?.toLowerCase();
  // localStorage.getItem(localStorageKey)

  const targetDropRef = useRef(null);

  useEffect(() => {
    emitSpritePositionToOtherPlayers(movedShape, false);
    if(!isEmpty(movedShape)){
      updateOrAddObjectOther(movedShape);
    }
  }, [movedShape]);


  function isEmpty(obj) {
    for (var x in obj) { return false; }
    return true;
  }

  const updateOrAddObject = (newObject) => {
    const index = localStorageItems?.findIndex(item => item?.id === newObject?.id);

    if (index !== -1) {
      // If the object already exists, replace it
      localStorageItems[index] = newObject;
      setLocalStorageItems(localStorageItems);
    } else {
      // If the object doesn't exist, add it
      localStorageItems.push(newObject);
      setLocalStorageItems(localStorageItems);
      // localStorageItems.push(newObject);
    }

    // localStorage.setItem(localStorageKey, JSON.stringify(localStorageItems));
  };

  const updateOrAddObjectOther = (newObject) => {
    const localStorageItems = playedRef.current;
    if(localStorageItems.length < 1){
      playedRef.current.push(newObject);
      playerSocket.emit('UPDATE_SPRITES_ACROSS_ROOM', roomId, playerName, playedRef.current);
      return;
    }
    const existingIndex = playedRef.current.findIndex(obj => obj.id === newObject.id);

    if(existingIndex !== -1) {
      // Object exists - update it
      const updatedValues = [...playedRef.current];
      updatedValues[existingIndex] = newObject;
      playedRef.current = updatedValues;

    } else {
      // Object doesn't exist - add it
      playedRef.current.push(newObject);
    }
    playerSocket.emit('UPDATE_SPRITES_ACROSS_ROOM', roomId, playerName, playedRef.current);

    // localStorage.setItem(localStorageKey, JSON.stringify(localStorageItems));
  };

  const removeObjectAndUpdateRoom = (newObject) => {
    const localStorageItems = playedRef.current;
    const existingIndex = playedRef.current.findIndex(obj => obj.id === newObject.id);

    if(existingIndex !== -1) {
      // Object exists - remove it
      const updatedValues = [...playedRef.current];
      updatedValues.splice(existingIndex, 1);
      playedRef.current = updatedValues;
      playerSocket.emit('UPDATE_SPRITES_ACROSS_ROOM', roomId, playerName, playedRef.current);
    }

    // localStorage.setItem(localStorageKey, JSON.stringify(localStorageItems));
  };

  const addObjectOrReplace = (newObject) => {
    setGameObjects((prevArray) => {
      const newArray = [...prevArray];
      const index = newArray.findIndex((obj) => obj.id === newObject.id);

      if (index !== -1) {
        // If the object exists, replace it
        newArray[index] = newObject;
      } else {
        // If the object doesn't exist, push it into the array
        newArray.push(newObject);
      }

      localStorage.setItem(localStorageKey, JSON.stringify(newArray));
      return newArray;
    });
  };





  // this removes the shape and passes it on to the requesting player
  const handleRemoveShape = (shapeName, requestingPlayer, gameSprites) => {
    const shapeElement = document.getElementById(shapeName);
    if (!shapeElement && !shapeElement?.classList?.contains('inbox')) {
      console.error(`Shape element with ID '${shapeName}' not found.`);
      return;
    }

    const parentElement = shapeElement.parentNode;
    // if (!parentElement || parentElement.id !== "gameBox") {
    //   console.error(`Shape element is not a direct child of 'gameBox'.`);
    //   return;
    // }


    if(parentElement.contains(shapeElement)){
      parentElement.removeChild(shapeElement);
    } else {
      console.log('Element does not exist to be removed');
    }

    updateOrAddObject({
      shapeUri: shapeName,
      isVisible: false
    });

    const playerObject = gameSprites.find((obj) => obj?.shapeUri === shapeName);

    if(playerObject){
      const object = playerObject;
      // updateOrAddObjectOther(updateObjectOwner(playerObject, requestingPlayer));
      playerSocket.emit('sendToRequestingPlayer', requestingPlayer, playerObject);
      emitSpritePositionToOtherPlayers(playerObject, true);
    }

    // setGameObjects(gameObjects);

  };


  const handleRemoveShapeV2 = (shapeName, requestingPlayer, gameSprites) => {

    updateOrAddObject({
      shapeUri: shapeName,
      isVisible: false
    });

    const playerObject = gameSprites.find((obj) => obj?.shapeUri === shapeName);

    if(playerObject){
      playerObject['isVisible'] = false;
      addObjectOrReplace(updateObjectOwner(playerObject, requestingPlayer));
      // updateOrAddObjectOther(updateObjectownerOwner(playerObject, requestingPlayer));
      playerSocket.emit('sendToRequestingPlayer', requestingPlayer, playerObject);
      // emitSpritePositionToOtherPlayers(playerObject, true);
      removeObjectAndUpdateRoom(playerObject);
    }

    // setGameObjects(gameObjects);

  };

  const updateObjectOwner = (playerObject, playerId) => {
    playerObject['owner'] = playerId;
    playerObject['x'] = 0;
    playerObject['y'] = 0;
    playerObject['isOnBoard'] = true;
    playerObject['isVisible'] = true;
    return playerObject;
  };

  //Request to get sprite from another player
  const handleSpriteRequestToPlayer = (sendingPlayer, spriteName) => {
    playerSocket.emit('spriteRequest', playerName, spriteName, sendingPlayer);
  };

  // Listening if anyone has requested from you
  useEffect(() => {
    playerSocket.on('spriteRequest', (requestingPlayer, spriteName) => {
      setModalOpen(true);
      setRequestObject({
        spriteName: spriteName,
        playerName: requestingPlayer,
        gameSprites: newGameSprite
      });
      //SpriteRequestAlert(spriteName, requestingPlayer, newGameSprite, handleRemoveShape);
    });
  }, [playerSocket]);


  const handleRequestedSprites = (spriteObject) => {
    addObjectOrReplace(spriteObject);
    // setRequestedObject(prevObjects => {
    //   if(objectJustReceived?.shapeUri === spriteObject?.shapeUri){
    //     return;
    //   } else{
    //     setObjectJustReceived({shapeUri: prevObjects?.shapeUri})
    //   }

    //   // Check if the object already exists in the array
    //   let objectExists = null;

    //   if( typeof prevObjects === 'undefined'){
    //     objectExists = prevObjects?.some(obj => obj === spriteObject);
    //   }

    //   // If the object already exists, return the previous array
    //   if (objectExists) {
    //     return prevObjects;
    //   }

    //   // If the object doesn't exist, add it to the array
    //   setGameObjects([...newGameSprite, spriteObject])
    //   // return [...prevObjects, spriteObject];
    // });
  };


  // Sprites that you have requested for and received
  useEffect(() => {
    playerSocket.on('exchangedSprites', (spriteObject) => {
      handleRequestedSprites(spriteObject);
    });
  }, [playerSocket]);


  useEffect(() => {
    playerSocket.on(`${playerName}-${PLAYER_PLAYS_CACHE}-${roomId}`);
  });

  const emitSpritePositionToOtherPlayers = (droppedShape, isRemove) => {
    playerSocket.emit('playerValues', roomId, playerName, droppedShape, isRemove);
  };


  useEffect(() => {
    setPlayerId(playerName);
  }, [playerName]);


  const distance = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  const arePointsConnected = (point1, point2, threshold = 5) =>{
    const [x1, y1] = point1;
    const [x2, y2] = point2;

    console.log(distance(x1, y1, x2, y2));
    return distance(x1, y1, x2, y2) <= threshold;
  };

  const hasFormedLargerTriangle = (shapes) => {
    // Calculate the center of mass of the vertices
    const centerOfMass = shapes.reduce(
      (acc, shape) => {
        const { vertices } = shape;
        const shapeCenterOfMass = vertices.reduce(
          (shapeAcc, vertex) => ({
            x: shapeAcc.x + vertex[0] / vertices.length,
            y: shapeAcc.y + vertex[1] / vertices.length,
          }),
          { x: 0, y: 0 }
        );
        return {
          x: acc.x + shapeCenterOfMass.x / shapes.length,
          y: acc.y + shapeCenterOfMass.y / shapes.length,
        };
      },
      { x: 0, y: 0 }
    );



    // Check if all vertices are close to the center of mass
    const maxDistance = 200; // Maximum allowed distance from the center of mass

    var led = shapes.every((shape) =>
      shape.vertices.every(
        (vertex) => {
          Math.abs(vertex[0] - centerOfMass.x) <= maxDistance && Math.abs(vertex[1] - centerOfMass.y) <= maxDistance;
        }
        // Math.abs(vertex.x - centerOfMass.x) <= maxDistance && Math.abs(vertex.y - centerOfMass.y) <= maxDistance
      )
    );

    return led;
  };


  const snapThreshold = 15;

  const [selectedShape, setSelectedShape] = useState(null);
  const collisionThreshold = 5; // Adjust this value as needed

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedShape) return;

      const { style } = selectedShape;
      const currentLeft = parseFloat(style.left);
      const currentTop = parseFloat(style.top);
      let newLeft = currentLeft;
      let newTop = currentTop;

      switch (e.key) {
      case 'ArrowUp':
        newTop -= 5;
        break;
      case 'ArrowDown':
        newTop += 5;
        break;
      case 'ArrowLeft':
        newLeft -= 5;
        break;
      case 'ArrowRight':
        newLeft += 5;
        break;
      default:
        break;
      }

      const newVertices = calculateVertices(selectedShape, newLeft, newTop);
      const selectedShapeIndex = droppedShapes.findIndex((shape) => shape.id === selectedShape.id);

      const isColliding = droppedShapes.some((otherShape, index) => {
        if (index === selectedShapeIndex) return false;

        return newVertices.some((vertex1) => {
          return otherShape.vertices.some((vertex2) => {
            const dx = Math.abs(vertex1.x - vertex2.x);
            const dy = Math.abs(vertex1.y - vertex2.y);

            return (dx < collisionThreshold && dy < collisionThreshold);
          });
        });
      });

      if (!isColliding) {
        style.left = `${newLeft}px`;
        style.top = `${newTop}px`;

        const updatedShape = { ...droppedShapes[selectedShapeIndex], position: { x: newLeft, y: newTop }, vertices: newVertices };
        emitSpritePositionToOtherPlayers(updatedShape, false);
        const updatedDroppedShapes = [
          ...droppedShapes.slice(0, selectedShapeIndex),
          updatedShape,
          ...droppedShapes.slice(selectedShapeIndex + 1),
        ];
        setDroppedShapes(updatedDroppedShapes);
        playerSocket.emit('updatedPlayerValues', roomId, playerName, updatedShape);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedShape]);



  const handleShapeClick = (e) => {
    setSelectedShape(e.target);
  };

  useEffect(() => {
    const gameBox = document.getElementById('gameBox');
    const shapesContainer = document.getElementById('shapesContainer');

    gameBox.addEventListener('dragover', handleDragOver);
    gameBox.addEventListener('drop', handleDrop);

    return () => {
      gameBox.removeEventListener('dragover', handleDragOver);
      gameBox.removeEventListener('drop', handleDrop);
    };
  }, [droppedShapes]);

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const getTriangleEdges = (triangle) => {
    const rect = triangle.getBoundingClientRect();
    const halfWidth = rect.width / 2;

    return {
      top: { x: rect.left + halfWidth, y: rect.top },
      left: { x: rect.left, y: rect.top + rect.height },
      right: { x: rect.left + rect.width, y: rect.top + rect.height },
    };
  };

  const calculateVertices = (shape, x, y) => {
    // Assuming the triangle's base is parallel to the x-axis and its top vertex points upward
    const baseWidth = 100; // Replace with the actual width of the triangle's base
    const height = 86.6; // Replace with the actual height of the triangle

    const vertices = [
      [x, y],
      [x - baseWidth / 2, y + height],
      [x + baseWidth / 2, y + height],
    ];

    return vertices;
  };


  const handleDrop = (e) => {
    e.preventDefault();
    const shapeId = e.dataTransfer.getData('text');
    const shape = document.getElementById(shapeId);
    const box = e.target.closest('#gameBox');

    if (!shape || !box) return;

    const x = e.clientX - box.getBoundingClientRect().left - shape.offsetWidth / 2;
    const y = e.clientY - box.getBoundingClientRect().top - shape.offsetHeight / 2;

    shape.style.position = 'absolute';
    shape.style.left = `${x}px`;
    shape.style.top = `${y}px`;

    if (!shape.classList.contains('inBox')) {
      shape.parentNode.removeChild(shape);
      if (shape.parentNode !== box) {
        box.appendChild(shape);
      }
      shape.classList.add('inBox');

      const vertices = calculateVertices(shape, e.clientX - box.getBoundingClientRect().left, e.clientY - box.getBoundingClientRect().top);

      const droppedShapeObject = {
        id: shape?.id,
        name: shape?.title,
        position: shape?.style?.position,
        left: shape?.style?.left,
        top: shape?.style?.top,
        borderColor: shape?.style?.borderColor,
        borderWidth: shape?.style?.borderWidth,
        transform: shape?.style?.transform,
        vertices,
      };

      const newDroppedShapes = [
        ...droppedShapes,
        droppedShapeObject
      ];


      setDroppedShapes(newDroppedShapes);
      setRemoveName(shape?.title);

      emitSpritePositionToOtherPlayers(droppedShapeObject, false);
    }

    const inBoxShapes = Array.from(box.getElementsByClassName('shape inBox'));

    inBoxShapes.forEach((otherShape) => {
      if (otherShape.id !== shapeId) {
        const shapeEdges = getTriangleEdges(shape);
        const otherShapeEdges = getTriangleEdges(otherShape);

        for (const edge in shapeEdges) {
          for (const otherEdge in otherShapeEdges) {
            const dx = Math.abs(shapeEdges[edge].x - otherShapeEdges[otherEdge].x);
            const dy = Math.abs(shapeEdges[edge].y - otherShapeEdges[otherEdge].y);

            if (dx < snapThreshold && dy < snapThreshold) {
              shape.style.left = `${otherShape.offsetLeft - (shapeEdges[edge].x - otherShapeEdges[otherEdge].x)}px`;
              shape.style.top = `${otherShape.offsetTop - (shapeEdges[edge].y - otherShapeEdges[otherEdge].y)}px`;
            }
          }
        }
      }
    });
  };

  let shapelist = [];
  shapelist.push(shapeSvg);
  shapelist.push(shapeSvg1);
  shapelist.push(shapeSvg2);
  shapelist.push(shapeSvg3);

  const removeTestFunction = (playerObject, requestingPlayer) => {
    addObjectOrReplace(updateObjectOwner(playerObject, requestingPlayer));
  };

  const updateState = (object) => {
    addObjectOrReplace(object);
  };

  // const objTest = {
  //   id: 'p2-01-A3',
  //   isVisible: true,
  //   shapeUri: 'shapeA3-032',
  //   owner: 'bhjjh',
  //   isOnBoard: true,
  //   x: 0,
  //   y: 0
  // }

  return (
    <div className="body container">
      <div className="left">
        {/* for local testing */}
        {/* <Tabs playerName={playerName} movedPlayer={movedShape}/> */}
        <Tabs playerName={playerName}/>
      </div>

      <div className="right">
        <div>
          <div id="gameBox" ref={targetDropRef}>
            <GameWorld id={'gameBox-main'}>
              {
                newGameSprite?.map((shape, index) => {
                  const isOwner = shape?.owner === playerId;
                  if(shape?.isVisible && isOwner && !shape?.isOnBoard){
                    return (<ShapeComponent
                      key={index}
                      shape={shape}
                      handleShapeClick={handleShapeClick}
                      handleDragStart={(e, data) => handleDragStart(e,data)}
                      theRef={targetDropRef}
                      shapeUri={shape?.shapeUri}
                      setMovedShape={setMovedShape}
                      addOrUpdate={updateOrAddObject}
                      updateState={updateState}
                    />
                    );
                  }
                })
              }
            </GameWorld>
          </div>
          <div style={{display: 'flex'}}>
            {
              newGameSprite?.map((shape, index) => {
                const isOwner = shape?.owner === playerId;
                if(shape?.isOnBoard && isOwner && shape?.isVisible){
                  return (
                    <div className="onBoardShape" key={index}>
                      <ShapeComponent
                        key={index}
                        shape={shape}
                        handleShapeClick={handleShapeClick}
                        handleDragStart={(e, data) => handleDragStart(e,data)}
                        theRef={targetDropRef}
                        shapeUri={shape?.shapeUri}
                        setMovedShape={setMovedShape}
                        addOrUpdate={updateOrAddObject}
                        updateState={updateState}
                      />
                    </div>
                  );
                }
              })
            }
          </div>
          <Tooltip
            id="my-tooltip"
          />
          <AlertModal isOpen={isModalOpen} setModalOpen={setModalOpen} requestObject={requestObject} handleRemoveShape={handleRemoveShapeV2}/>
          <HintModal isOpen={isHintModalOpen} setModalOpen={setHintModalOpen} gameLevel={level}/>
        </div>
      </div>
      <div style={{margin: '10px', marginRight: '20px'}}>
        <button onClick={() => setHintModalOpen(true)}>Hint</button>
      </div>
      <div style={{marginTop: '10px'}}>
        <a className="player-details" style={{justifySelf: 'flex-end'}}> ℹ️</a>
        <Tooltip anchorSelect=".player-details" place="top">
          <p>Playing name: {playerName}</p>
          <p>Room Id: {roomId}</p>
        </Tooltip>
      </div>
    </div>
  );
};

export default MainGame;
