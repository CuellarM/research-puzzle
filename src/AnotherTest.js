import React, { useEffect, useState } from "react";
import "./AnotherTest.css";

const AnotherTest = () => {
    const [droppedShapes, setDroppedShapes] = useState([]);


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
        // Assuming shapes is an array containing the coordinates of the vertices of each triangle
        // Example: [{ id: "blue", vertices: [[x1, y1], [x2, y2], [x3, y3]] }, ...]
      
        // Check if each pair of triangles have a common vertex
        console.log("has formed", shapes)
        for (let i = 0; i < shapes.length; i++) {
          for (let j = i + 1; j < shapes.length; j++) {
            let commonVertices = 0;
            for (let vertex1 of shapes[i].vertices) {
              for (let vertex2 of shapes[j].vertices) {
                if (arePointsConnected(vertex1, vertex2)) {
                  commonVertices++;
                }
              }
            }
      
            // If two triangles do not share exactly one vertex, they cannot form a larger triangle
            if (commonVertices !== 1) {
              return false;
            }
          }
        }
      
        // If all pairs of triangles share exactly one vertex, they form a larger triangle
        return true;
      }

    const snapThreshold = 15;

  const initialShapes = [
    {
      id: "blue",
      shape: "triangle",
      borderColor: "transparent transparent #0074D9 transparent",
      borderWidth: "0 50px 86.6px 50px",
      transform: "translateY(43.3px)",
      vertices: [],
    },
    {
      id: "red",
      shape: "triangle",
      borderColor: "transparent transparent #FF4136 transparent",
      borderWidth: "0 50px 86.6px 50px",
      transform: "translateY(43.3px) rotate(120deg)",
      vertices: [],
    },
    {
      id: "green",
      shape: "triangle",
      borderColor: "transparent transparent #2ECC40 transparent",
      borderWidth: "0 50px 86.6px 50px",
      transform: "translateY(43.3px) rotate(240deg)",
      vertices: [],
    },
    {
      id: "purple",
      shape: "triangle",
      borderColor: "#B10DC9 transparent transparent transparent",
      borderWidth: "86.6px 50px 0 50px",
      transform: "",
      vertices: [],
    },
  ];
  
  const [selectedShape, setSelectedShape] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedShape) return;
      let { style } = selectedShape;
      let left = parseFloat(style.left);
      let top = parseFloat(style.top);

      switch (e.key) {
        case "ArrowUp":
          style.top = `${top - 5}px`;
          break;
        case "ArrowDown":
          style.top = `${top + 5}px`;
          break;
        case "ArrowLeft":
          style.left = `${left - 5}px`;
          break;
        case "ArrowRight":
          style.left = `${left + 5}px`;
          break;
        default:
          break;
      }

    const shapeIndex = droppedShapes.findIndex((shape) => shape.id === selectedShape.id);
    if (shapeIndex >= 0) {
      const vertices = calculateVertices(selectedShape, left, top);
      const updatedShape = { ...droppedShapes[shapeIndex], position: { x: left, y: top }, vertices };
      const updatedDroppedShapes = [
        ...droppedShapes.slice(0, shapeIndex),
        updatedShape,
        ...droppedShapes.slice(shapeIndex + 1),
      ];
      setDroppedShapes(updatedDroppedShapes);
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
  }, []);

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

      const vertices = calculateVertices(shape, e.clientX - box.getBoundingClientRect().left, e.clientY - box.getBoundingClientRect().top);
      let newDroppedShapes = droppedShapes;
      newDroppedShapes = [
        ...newDroppedShapes,
        {
          id: shape.id,
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
    <div>
      <div id="gameBox" className="box"></div>
      <div id="shapesContainer">
        {initialShapes.map((shape) => (
          <div
            key={shape.id}
            className={`shape ${shape.shape}`}
            style={{
                borderColor: shape.borderColor,
              backgroundColor: shape.color,
              borderWidth: shape.borderWidth,
              transform: shape.transform,
              width: 0,
              height: 0,
              borderStyle: "solid",
              position: "relative",
            //   width: shape.width,
            //   height: shape.height,
            }}
            id={shape.id}
            draggable={true}
            onDragStart={(e) => handleDragStart(e, shape.id)}
            onClick={handleShapeClick}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default AnotherTest;
