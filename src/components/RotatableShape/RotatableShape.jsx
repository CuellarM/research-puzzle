/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useRef, useState } from 'react';
import './RotatableShape.css';

const RotatableShape = ({setImageAngle, children }) => {
  const [rotateMode, setRotateMode] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);

  const shapeRef = useRef(null);
  const buttonRef = useRef(null);

  const handleButtonClick = () => {
    setRotateMode(!rotateMode);
  };

  const handleMouseMove = (e) => {
    if (rotateMode) {
      const shapeRect = shapeRef.current.getBoundingClientRect();
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const shapeCenterX = shapeRect.left + shapeRect.width / 2;
      const shapeCenterY = shapeRect.top + shapeRect.height / 2;
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const deltaX = mouseX - shapeCenterX;
      const deltaY = mouseY - shapeCenterY;

      // Calculate the angle in degrees using Math.atan2 and convert it to degrees
      const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;

      setRotationAngle(angle);

      setImageAngle({
        angle: rotationAngle,
        eValue: e
      });
    }
  };

  const handleMouseUp = () => {
    setRotateMode(false);
  };

  return (
    <div
      style={{
        position: 'relative',
        width: 'fit-content',
        height: 'fit-content',
        cursor: rotateMode ? 'grabbing' : 'grab',
        transform: `rotate(${rotationAngle}deg)`,
        zIndex: 20
      }}
      ref={shapeRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div         
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}>
        <a
          ref={buttonRef}
          style={{
            position: 'absolute',
            top: '55%',
            left: '50%',
            transform: 'translate(-50%, -50%)', // Center the button
          }}
          onClick={handleButtonClick}
        >
        🔄
        </a>
        {children}
      </div>
    </div>
  );
};

export default RotatableShape;
