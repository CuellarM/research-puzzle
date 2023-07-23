/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AnotherTest.css";
import { playerSocket } from "./service/ConnectSocket";
import Tabs from "./TabLocal";
import SelectPlayer from "./components/customSelect/SelectPlayer";
import { SpriteRequestAlert } from "./components/alert/SpriteAlert";
import { PLAYER_PLAYS_CACHE } from "./constants/Constants";
import { shapeSvg, shapeSvg1 } from "./images";

const MainGame = ({newGameSprite, playersInRoom, playerName, roomId}) => {

  const [playerId, setPlayerId] = useState("");
  const [otherPlayerValues, setOtherPlayerValues] = useState([]);
  const [removeName, setRemoveName] = useState('');
  const [droppedShapes, setDroppedShapes] = useState([]);
  const [requestedObject, setRequestedObject] = useState([]);



  // this removes the shape and passes it on to the requesting player
  const handleRemoveShape = (shapeName, requestingPlayer, gameSprites) => {
      const shapeElement = document.getElementsByName(shapeName)?.[0];
      if (!shapeElement) {
        console.error(`Shape element with ID '${shapeName}' not found.`);
        return;
      }
    
      const parentElement = shapeElement.parentNode;
      if (!parentElement || parentElement.id !== "gameBox") {
        console.error(`Shape element is not a direct child of 'gameBox'.`);
        return;
      }
    
      parentElement.removeChild(shapeElement);

      const playerObject = gameSprites.find((obj) => obj.name === shapeName);
      if(playerObject){
        playerSocket.emit('sendToRequestingPlayer', requestingPlayer, playerObject);
        emitSpritePositionToOtherPlayers(playerObject, true);
      }
      
    };

  //Request to get sprite from another player
  const handleSpriteRequestToPlayer = (sendingPlayer, spriteName) => {
    playerSocket.emit('spriteRequest', playerName, spriteName, sendingPlayer);
  }

  // Listening if anyone has requested from you
  useEffect(() => {
    playerSocket.on('spriteRequest', (requestingPlayer, spriteName) => {
      SpriteRequestAlert(spriteName, requestingPlayer, newGameSprite, handleRemoveShape);
    });
  }, [playerSocket])


  const handleRequestedSprites = (spriteObject) => {
    setRequestedObject(prevObjects => {
      // Check if the object already exists in the array
      const objectExists = prevObjects.some(obj => obj === spriteObject);
    
      // If the object already exists, return the previous array
      if (objectExists) {
        return prevObjects;
      }
    
      // If the object doesn't exist, add it to the array
      return [...prevObjects, spriteObject];
    });
  }


    // Sprites that you have requested for and received
    useEffect(() => {
      playerSocket.on('exchangedSprites', (spriteObject) => {
        console.log('received sprite alert', spriteObject);
        handleRequestedSprites(spriteObject);
      });
    }, [playerSocket])


    useEffect(() => {
      playerSocket.on(`${playerName}-${PLAYER_PLAYS_CACHE}-${roomId}`)
    })

    const emitSpritePositionToOtherPlayers = (droppedShape, isRemove) => {
      playerSocket.emit('playerValues', roomId, playerName, droppedShape, isRemove);
    }


    useEffect(() => {
      setPlayerId(playerName);
    }, [playerName])

    // useEffect(() => {
    //   playerSocket.on('playerValues', (playerId, values) => {
    //     console.log("received", playerId, values)
    //     setOtherPlayerValues(values);
    //   });
    // }, [playerSocket, playerName])

    console.log('the dropped', droppedShapes)
    console.log('the removed sprite', newGameSprite)


    const distance = (x1, y1, x2, y2) => {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      }

    const arePointsConnected = (point1, point2, threshold = 5)  =>{
        const [x1, y1] = point1;
        const [x2, y2] = point2;

        console.log("here");
        console.log(distance(x1, y1, x2, y2))
        return distance(x1, y1, x2, y2) <= threshold;
    }

    const hasFormedLargerTriangle = (shapes) => {
        console.log('shapes length', shapes.length)
        if (shapes.length !== initialShapes.length) {
            console.log('agggg')
          return false;
        }
      
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
            Math.abs(vertex[0] - centerOfMass.x) <= maxDistance && Math.abs(vertex[1] - centerOfMass.y) <= maxDistance
          }
            // Math.abs(vertex.x - centerOfMass.x) <= maxDistance && Math.abs(vertex.y - centerOfMass.y) <= maxDistance
        )
      );

      console.log('centerOfMass', led)
        return led;
      };
      

    const snapThreshold = 15;

    const initialShapes = [
      {
        id: "blue",
        name: "A1",
        shape: "triangle",
        borderColor: "transparent transparent #0074D9 transparent",
        borderWidth: "0 50px 86.6px 50px",
        transform: "translateY(43.3px)",
        vertices: [],
      },
      {
        id: "red",
        name: "A2",
        shape: "triangle",
        borderColor: "transparent transparent #FF4136 transparent",
        borderWidth: "0 90px 106.6px 10px",
        transform: "translateY(43.3px) rotate(180deg) translateY(-43.3px)",
        vertices: [],
      },
      {
        id: "green",
        name: "A3",
        shape: "triangle",
        borderColor: "transparent transparent #2ECC40 transparent",
        borderWidth: "0 50px 86.6px 50px",
        transform: "translateY(43.3px) rotate(240deg) translateY(-43.3px)",
        vertices: [],
      },
      {
        id: "purple",
        name: "A4",
        shape: "triangle",
        borderColor: "#B10DC9 transparent transparent transparent",
        borderWidth: "86.6px 50px 0 50px",
        transform: "",
        vertices: [],
      },
    ];
  
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
        case "ArrowUp":
          newTop -= 5;
          break;
        case "ArrowDown":
          newTop += 5;
          break;
        case "ArrowLeft":
          newLeft -= 5;
          break;
        case "ArrowRight":
          newLeft += 5;
          break;
        default:
          break;
      }
  
      const newVertices = calculateVertices(selectedShape, newLeft, newTop);
      const selectedShapeIndex = droppedShapes.findIndex((shape) => shape.id === selectedShape.id);

      console.log('th shape index', selectedShapeIndex);
  
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
        console.log('The update shape', updatedShape);
        emitSpritePositionToOtherPlayers(updatedShape, false);
        const updatedDroppedShapes = [
          ...droppedShapes.slice(0, selectedShapeIndex),
          updatedShape,
          ...droppedShapes.slice(selectedShapeIndex + 1),
        ];
        setDroppedShapes(updatedDroppedShapes);
        console.log("the update shape now", updatedShape)
        playerSocket.emit('updatedPlayerValues', roomId, playerName, updatedShape) 
      }
    };
  
    window.addEventListener("keydown", handleKeyDown);
  
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedShape]);
  
  

  const handleShapeClick = (e) => {
    setSelectedShape(e.target);
  };

  useEffect(() => {
    const gameBox = document.getElementById("gameBox");
    const shapesContainer = document.getElementById("shapesContainer");
  
    gameBox.addEventListener("dragover", handleDragOver);
    gameBox.addEventListener("drop", handleDrop);
  
    return () => {
      gameBox.removeEventListener("dragover", handleDragOver);
      gameBox.removeEventListener("drop", handleDrop);
    };
  }, [droppedShapes]);

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("text/plain", id);
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
  }

  useEffect(() => {
    // Check if the shapes form a larger triangle
    const hasFormedTriangle = hasFormedLargerTriangle(droppedShapes);
    if (hasFormedTriangle) {
      console.log("The pieces have come together to form a larger triangle!");
    }else {
        console.log("The pieces have not yet formed a larger triangle.");
      }
  }, [droppedShapes]);

  const handleDrop = (e) => {
    console.log("new gane sprite", newGameSprite)
    e.preventDefault();
    const shapeId = e.dataTransfer.getData("text");
    const shape = document.getElementById(shapeId);
    const box = e.target.closest("#gameBox");

    if (!shape || !box) return;

    const x = e.clientX - box.getBoundingClientRect().left - shape.offsetWidth / 2;
    const y = e.clientY - box.getBoundingClientRect().top - shape.offsetHeight / 2;

    shape.style.position = "absolute";
    shape.style.left = `${x}px`;
    shape.style.top = `${y}px`;

    if (!shape.classList.contains("inBox")) {
      shape.parentNode.removeChild(shape);
      if (shape.parentNode !== box) {
        box.appendChild(shape);
      }
      shape.classList.add("inBox");

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
      }

      const newDroppedShapes = [
        ...droppedShapes,
        droppedShapeObject
      ];
      
  
      setDroppedShapes(newDroppedShapes);
      setRemoveName(shape?.title);

      emitSpritePositionToOtherPlayers(droppedShapeObject, false);
    }

    const inBoxShapes = Array.from(box.getElementsByClassName("shape inBox"));

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


  function SvgWrapper({ svg, name, id }) {
    return (
      <div
        className="pieceShape"
        draggable={true}
        onDragStart={(e) => handleDragStart(e, id)}
        onClick={handleShapeClick}
        onDrop={handleDrop}
      >
        <div dangerouslySetInnerHTML={{ __html: svg }} />
        <span className="shape-text">{name}</span>
      </div>
    );
  }
  
  let shapelist = [];
  shapelist.push(shapeSvg);
  shapelist.push(shapeSvg1);

  return (
    <div className="container">
      <div className="left">
      <Tabs playerName={playerName} />
        <div>
          <h2>Request shapes from players</h2>
          <SelectPlayer playerObject={playersInRoom} handleRequest={handleSpriteRequestToPlayer}/>
        </div>
      </div>
      <div className="divider"></div>
      <div className="right">
      <div className="keep-right">
        <div id="gameBox" className="main-game-box"></div>
        <div id="shape" className="shape">
        {/* <SvgWrapper
        key="key"
        svg={svgImage}
        name="key"
        id="key"
      /> */}
      {
        // shapelist?.map((shape, index) => (
        //   <div key={shape?.name} title={shape?.name} id={shape?.name} name={shape?.name} draggable={true} onClick={handleShapeClick} onDragStart={(e) => handleDragStart(e, shape.id)} onDrop={(e) =>handleDrop(e)}> 
        //   <div dangerouslySetInnerHTML={{ __html: shape?.svg }} />
        //     <span className="shape-text">{shape?.name}</span>
        //   </div>
        // ))
      newGameSprite?.map((shape, index) => (
        <div
          key={shape?.name}
          title={shape?.name}
          className="pieceShape"
          name={shape?.name}
          style={{
            borderColor: shape?.borderColor,
            backgroundColor: shape?.color,
            borderWidth: shape?.borderWidth,
            justifyContent: "center",
            alignItems: "center",
            width: 0,
            height: 0,
            borderStyle: "solid",
            position: "relative",
          }}
          id={shape?.name}
          draggable={true}
          onDragStart={(e) => handleDragStart(e, shape.id)}
          onClick={handleShapeClick}
          onDrop={(e) =>handleDrop(e)}
        ><span className="shape-text">{shape?.name}</span>
        </div>
      ))
      }
      {
        requestedObject?.map((shape, index) => (
          <div
            key={shape?.name}
            title={shape?.name}
            className="pieceShape"
            name={shape?.name}
            style={{
              borderColor: shape?.borderColor,
              backgroundColor: shape?.color,
              borderWidth: shape?.borderWidth,
              justifyContent: "center",
              alignItems: "center",
              width: 0,
              height: 0,
              borderStyle: "solid",
              position: "relative",
            }}
            id={shape?.name}
            draggable={true}
            onDragStart={(e) => handleDragStart(e, shape?.id)}
            onClick={handleShapeClick}
            onDrop={(e) =>handleDrop(e)}
          ><span className="shape-text">{shape?.name}</span>
          </div>
        ))
      }
      </div>
        {/* <PlayShapes /> */}
      </div>
      </div>
    </div>
  );
};

export default MainGame;
