import React, { useEffect } from "react";
import "./AnotherTest.css";

const AnotherTest = () => {
//   const initialShapes = [
//     {
//       id: "red",
//       shape: "square",
//       color: "red",
//       width: 80,
//       height: 80,
//     },
//     {
//       id: "green",
//       shape: "circle",
//       color: "green",
//       width: 80,
//       height: 80,
//     },
//     {
//       id: "blue",
//       shape: "triangle",
//       color: "blue",
//       width: 80,
//       height: 80,
//     },
//   ];

const snapThreshold = 15;

  const initialShapes = [
    {
      id: "blue",
      shape: "triangle",
      borderColor: "transparent transparent #0074D9 transparent",
      borderWidth: "0 50px 86.6px 50px",
      transform: "translateY(43.3px)",
    },
    {
      id: "red",
      shape: "triangle",
      borderColor: "transparent transparent #FF4136 transparent",
      borderWidth: "0 50px 86.6px 50px",
      transform: "translateY(43.3px) rotate(120deg)",
    },
    {
      id: "green",
      shape: "triangle",
      borderColor: "transparent transparent #2ECC40 transparent",
      borderWidth: "0 50px 86.6px 50px",
      transform: "translateY(43.3px) rotate(240deg)",
    },
    {
      id: "purple",
      shape: "triangle",
      borderColor: "#B10DC9 transparent transparent transparent",
      borderWidth: "86.6px 50px 0 50px",
      transform: "",
    },
  ];
  

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
    }

    const inBoxShapes = Array.from(box.getElementsByClassName("shape inBox"));

    inBoxShapes.forEach((otherShape) => {
      if (otherShape.id !== shapeId) {
        const shapeRect = shape.getBoundingClientRect();
        const otherShapeRect = otherShape.getBoundingClientRect();

        const dx = Math.abs(shapeRect.left - otherShapeRect.left);
        const dy = Math.abs(shapeRect.top - otherShapeRect.top);

        if (dx < snapThreshold) {
          shape.style.left = `${otherShape.offsetLeft}px`;
        }

        if (dy < snapThreshold) {
          shape.style.top = `${otherShape.offsetTop}px`;
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
          ></div>
        ))}
      </div>
    </div>
  );
};

export default AnotherTest;
