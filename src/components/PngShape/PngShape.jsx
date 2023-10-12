/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useRef, useState } from 'react';
import image from '../../puzzle-svgs/shape-1.png';
import './ShapeComponent.css';

function PngShape({shape}) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const containerRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };
    
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDragStart = (e, shapeId) => {
    e.dataTransfer.setData('text/plain', shapeId);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  const handleDrop = (e) => {
    console.log('the drop', e);
    e.preventDefault();
    const shapeId = e.dataTransfer.getData('shapeId');
    const container = containerRef.current;
  
    // Ensure we have the shapeId and the container element
    if (shapeId && container) {
      const offsetX = e.clientX - container.offsetWidth / 2;
      const offsetY = e.clientY - container.offsetHeight / 2;
      container.style.left = `${offsetX}px`;
      container.style.top = `${offsetY}px`;
    }

    setIsDraggingOver(false);
  };
  
  return (
    <div className='piece'>
      <img src={image} className="shape-piece" width="50%" height="50%" id={shape?.id} draggable/>
    </div>
  );
}

export default PngShape;
