import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./AnotherTest.css";
import { playerSocket } from "./service/ConnectSocket";
import TabPage from "./TabPage";
import SelectLabels from "./components/select/Select";
import Tabs from "./TabLocal";

const AnotherTest = () => {
  const history = useNavigate();

  const tabTitles = [
    { id: 'tab1', title: 'Tab 1', content: 'Content for Tab 1' },
    { id: 'tab2', title: 'Tab 2', content: 'Content for Tab 2' },
    { id: 'tab3', title: 'Tab 3', content: 'Content for Tab 3' },
  ];

  const [playerId, setPlayerId] = useState("");
  const [otherPlayerValues, setOtherPlayerValues] = useState([]);

  const players = ["Obed", "Rio", "Gerte"]

  // const handlePlayerName = (e) => {
  //   setPlayerId(e)
  // }

  useEffect(() => {
    console.log("in the app va;urs", otherPlayerValues);
  }, [otherPlayerValues])

  const handleButtonClick = () => {
    history("/tabs");
  };
    const [droppedShapes, setDroppedShapes] = useState([]);
    // Add a new state variable to control the overlay visibility
    const [showOverlay, setShowOverlay] = useState(true);
    const [playerName, setPlayerName] = useState("");

    const [roomId, setRoomId] = useState(null);

    useEffect(() => {
      console.log("eeeeeeeeeeeeeey")
    playerSocket.emit('playerValues', roomId, playerName, droppedShapes) 
    // => {
    //   console.log("player values", playerName, droppedShapes);
    // });

    }, [droppedShapes])

    // useEffect(() => {
    //   // Join the "lobby" room when the app loads
    //   console.log("room", roomId)
    //   if(roomId == null){
    //     playerSocket.emit('joinRoom', 'lobby');
    //   }
      
  
    //   // Listen for the "playerValues" event
    //   playerSocket.on('playerValues', (playerId, values) => {
    //     console.log(`received values from player ${playerId}:`, values);
    //   });
  
    //   return () => {
    //     // Leave the room when the app unmounts
    //     playerSocket.emit('leaveRoom', roomId);
    //   };
    // }, [roomId]);
  
    const handleJoinRoom = () => {
      // const newRoomId = prompt('Enter room ID:');
      // playerSocket.emit('leaveRoom', roomId);
      playerSocket.emit('registerPlayer', playerName)
      playerSocket.emit('joinRoom', roomId);
      // setRoomId(newRoomId);
    };

    const handlePlayerNameChange = (event) => {
      setPlayerName(event.target.value);
    }

    useEffect(() => {
      setPlayerId(playerName);
    }, [playerName])

    useEffect(() => {
      playerSocket.on('playerValues', (playerId, values) => {
        console.log("received", playerId, values)
        setOtherPlayerValues(values);
      });
    }, [playerSocket, playerName])

    console.log('the dropped', droppedShapes)

    // Add a new function to handle the "Start Game" button click
    const handleStartGame = () => {
      handleJoinRoom();
      setShowOverlay(false);
    };


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
            console.log('the vertex', vertex[0])
            console.log('the vertmas ex', centerOfMass)
            console.log('the abs', Math.abs(vertex[0] - centerOfMass.x))
            console.log('both', maxDistance && Math.abs(vertex[1] - centerOfMass.y))
            console.log("check boolean", Math.abs(vertex[0] - centerOfMass.x) <= maxDistance && Math.abs(vertex[1] - centerOfMass.y) <= maxDistance)
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
        borderWidth: "0 50px 86.6px 50px",
        transform: "translateY(43.3px) rotate(120deg) translateY(-43.3px)",
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
      box.appendChild(shape);
      shape.classList.add("inBox");

      console.log("the shape", shape)
      const vertices = calculateVertices(shape, e.clientX - box.getBoundingClientRect().left, e.clientY - box.getBoundingClientRect().top);
      const newDroppedShapes = [
        ...droppedShapes,
        {
          id: shape.id,
          name: shape.name,
          position: shape.style.position,
          left: shape.style.left,
          top: shape.style.top,
          borderColor: shape.style.borderColor,
          borderWidth: shape.style.borderWidth,
          transform: shape.style.transform,
          vertices,
        },
      ];
      
  
      setDroppedShapes(newDroppedShapes);
      console.log("vert", droppedShapes, shape.id)
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

  return (
    <div className="container">
      {showOverlay && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
      <input
        type="text"
        value={playerName}
        onChange={handlePlayerNameChange}
        placeholder="Player name"
      />
       <input
        type="text"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        placeholder="Game room"
      />
      <button
        onClick={handleStartGame}     
        //{handleStartGame}
        disabled={!playerName&&!roomId}
      >
        Start Game
      </button>
        </div>
      )}
      <div className="left">
      <Tabs tabTitles={tabTitles} />
        {/* <TabPage /> */}

        <div>
          <h2>Request shapes from players</h2>
          <SelectLabels players={players} />
          <Button variant="contained">Request</Button>
        </div>
      </div>
      <div className="divider"></div>
      <div className="right">
      <div className="keep-right">
        <div id="gameBox" className="main-game-box"></div>
        <div id="shape" className="shape">
      {initialShapes.map((shape) => (
        <div
          key={shape.id}
          className="pieceShape"
          style={{
            borderColor: shape.borderColor,
            backgroundColor: shape.color,
            borderWidth: shape.borderWidth,
            justifyContent: "center",
            alignItems: "center",
            width: 0,
            height: 0,
            borderStyle: "solid",
            position: "relative",
          }}
          id={shape.id}
          draggable={true}
          onDragStart={(e) => handleDragStart(e, shape.id)}
          onClick={handleShapeClick}
        ><span className="shape-text">{shape.name}</span></div>
      ))}
      </div>
        {/* <PlayShapes /> */}
      </div>
      </div>
    </div>
  );
};

export default AnotherTest;
