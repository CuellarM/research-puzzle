import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';

// Define the item types for drag and drop
const ItemTypes = {
  TRIANGLE: 'triangle',
};

// Define the draggable triangle component
const Triangle = ({ index, onDrop }) => {
  const [{ isDragging }, dragRef] = useDrag({
    item: { type: ItemTypes.TRIANGLE, index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={dragRef}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        width: '50px',
        height: '50px',
        backgroundColor: 'yellow',
        margin: '10px',
      }}
    >
      Triangle {index + 1}
    </div>
  );
};

// Define the drop zone component
const DropZone = ({ onDrop }) => {
  const [{ isOver }, dropRef] = useDrop({
    accept: ItemTypes.TRIANGLE,
    drop: (item) => onDrop(item.index),
    collect: monitor => ({
      isOver: monitor.isOver(),
    }),
  });

  const backgroundColor = isOver ? 'lightgreen' : 'white';

  return (
    <div
      ref={dropRef}
      style={{
        width: '200px',
        height: '200px',
        border: '1px dashed gray',
        backgroundColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      Drop Zone
    </div>
  );
};

// Main App component
const Try = () => {
  const [triangles, setTriangles] = useState([0, 1, 2]);
  const [droppedTriangles, setDroppedTriangles] = useState([]);

  const handleDrop = (index) => {
    const triangle = triangles[index];
    const updatedTriangles = triangles.filter((_, i) => i !== index);
    setTriangles(updatedTriangles);
    setDroppedTriangles(prevState => [...prevState, triangle]);
  };

  return (
    <div>
      <h1>Drag and Drop Triangles</h1>
      <div style={{ display: 'flex' }}>
        <div>
          <h2>Triangles:</h2>
          {triangles.map((triangle, index) => (
            <Triangle
              key={index}
              index={index}
              onDrop={handleDrop}
            />
          ))}
        </div>
        <div>
          <h2>Dropped Triangles:</h2>
          {droppedTriangles.map((triangle, index) => (
            <div
              key={index}
              style={{
                width: '50px',
                height: '50px',
                backgroundColor: 'yellow',
                margin: '10px',
              }}
            >
              Triangle {triangle + 1}
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2>Drop Zone:</h2>
        <DropZone onDrop={handleDrop} />
      </div>
    </div>
  );
};

export default Try;
