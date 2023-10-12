/* eslint-disable react/prop-types */
import React, { useState } from 'react';

export default function TestBox() {
  const [shapes, setShapes] = useState([]);
  const [initialShapes, setInitialShapes] = useState([
    {
      id: 'red',
      shape: 'square',
      color: 'red',
      width: '80px',
      height: '80px'
    },
    {
      id: 'green',
      shape: 'circle',
      color: 'green',
      width: '80px',
      height: '80px'
    },
    {
      id: 'blue',
      shape: 'triangle',
      color: 'blue',
      width: '80px',
      height: '80px'
    }
  ]);
  
  function handleDragStart(e, id) {
    e.dataTransfer.setData('text/plain', id);
  }
  
  function handleDragOver(e) {
    e.preventDefault();
  }
  
  function handleDrop(e) {
    e.preventDefault();
    const shapeId = e.dataTransfer.getData('text');
    const shape = document.getElementById(shapeId);
    const box = e.target;
    const shapeClone = shape.cloneNode(false);
    const shapeWidth = shape.offsetWidth;
    const shapeHeight = shape.offsetHeight;
    const boxWidth = box.offsetWidth;
    const boxHeight = box.offsetHeight;
    const boxX = box.getBoundingClientRect().x;
    const boxY = box.getBoundingClientRect().y;
    const offsetX = e.clientX - boxX;
    const offsetY = e.clientY - boxY;
    const shapeX = offsetX - shapeWidth / 2;
    const shapeY = offsetY - shapeHeight / 2;
    shapeClone.style.position = 'absolute';
    if (shapeX + shapeWidth > boxWidth) {
      shapeClone.style.left = `${boxWidth - shapeWidth}px`;
    } else if (shapeX < 0) {
      shapeClone.style.left = '0px';
    } else {
      shapeClone.style.left = `${shapeX}px`;
    }
    if (shapeY + shapeHeight > boxHeight) {
      shapeClone.style.top = `${boxHeight - shapeHeight}px`;
    } else if (shapeY < 0) {
      shapeClone.style.top = '0px';
    } else {
      shapeClone.style.top = `${shapeY}px`;
    }
    box.appendChild(shapeClone);
    const newShapes = initialShapes.filter((s) => s.id !== shapeId);
    setInitialShapes(newShapes);
    setShapes(prevShapes => [
      ...prevShapes,
      {
        id: shapeId,
        element: shapeClone,
        left: shapeClone.offsetLeft,
        top: shapeClone.offsetTop,
        startX: e.clientX,
        startY: e.clientY,
        type: shapeId,
        color: shapeId,
      }
    ]);
  }

  function handleDrag(e, shapeId) {
    const shapeIndex = shapes.findIndex((shape) => shape.id === shapeId);
    const shape = shapes[shapeIndex];
    const box = e.currentTarget;
    const offsetX = e.clientX - shape.initialX;
    const offsetY = e.clientY - shape.initialY;
    const shapeX = offsetX - shape.width / 2;
    const shapeY = offsetY - shape.height / 2;
      
    shape.x = shapeX;
    shape.y = shapeY;
      
    if (shapeX + shape.width > box.offsetWidth) {
      shape.x = box.offsetWidth - shape.width;
    } else if (shapeX < 0) {
      shape.x = 0;
    }
      
    if (shapeY + shape.height > box.offsetHeight) {
      shape.y = box.offsetHeight - shape.height;
    } else if (shapeY < 0) {
      shape.y = 0;
    }
      
    setShapes([
      ...shapes.slice(0, shapeIndex),
      shape,
      ...shapes.slice(shapeIndex + 1),
    ]);
  }

  function handleDragEnd (event, shapeId){
    const shapeIndex = shapes.findIndex((shape) => shape.id === shapeId);
    const draggedShape = initialShapes[shapeIndex];
    const updatedShapes = [...initialShapes];
    updatedShapes.splice(shapeIndex, 1);
      
    setInitialShapes(updatedShapes);
    setShapes((prevShapes) => [...prevShapes, draggedShape]);
  }

  const Circle = ({ color }) => (
    <div
      style={{
        backgroundColor: color,
        width: '80px',
        height: '80px',
        // borderRadius: "50%",
      }}
    />
  );
      
  const Square = ({ color }) => (
    <svg width="50" height="50">
      <rect width="50" height="50" fill={color} />
    </svg>
  );
      

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        height: '100vh',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '500px',
          height: '500px',
          background: 'grey',
        }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {shapes.map((shape, index) => {
          const ShapeComponent = shape.shape === 'circle' ? Circle : Square;
          return(
            <div
              key={index}
              style={{
                position: 'absolute',
                left: `${shape.left}px`,
                top: `${shape.top}px`,
                width: 'fit-content',
                height: 'fit-content',
              }}
              id={shape.id}
              draggable={true}
              onDragStart={(event) => handleDragStart(event, shape.id)}
              onDrag={(event) => handleDrag(event, shape.id)}
              onMouseOver={() => console.log('attah')}
            >
              {/* {shape.type === "green" && <Circle color={shape.color}  />}
                {shape.type === "square" && <Square color={shape.color} />} */}
              <ShapeComponent color={shape.color} />
              {/* {shape.target} */}
            </div>
          );
        })}
      </div>
      
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          marginTop: '50px',
        }}
      >
        {initialShapes.map((shape) => (
          <div
            key={shape.id}
            style={{
              width: `${shape.width}`,
              height: `${shape.height}`,
              backgroundColor: shape.color,
              borderRadius: shape.shape === 'circle' ? '50%' : 0,
              transform: shape.shape === 'triangle' ? 'rotate(45deg)' : undefined,
            }}
            id={shape.id}
            draggable={true}
            onDragStart={(event) => handleDragStart(event, shape.id)}
            onDragEnd={(event) => handleDragEnd(event, shape.id)}
          ></div>
        ))}
      </div>
    </div>
  );
}  