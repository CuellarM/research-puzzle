/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react';
import "./ShapeComponent.css";
import shapeA1 from "../../puzzle-svgs/shape-A1.svg";
import shapeA2 from "../../puzzle-svgs/shape-A2.svg";
import shapeA3 from "../../puzzle-svgs/shape-A3.svg";
import shapeA4 from "../../puzzle-svgs/shape-A4.svg";
import shapeB1 from "../../puzzle-svgs/shape-B1.svg";
import shapeB2 from "../../puzzle-svgs/shape-B2.svg";
import shapeB3 from "../../puzzle-svgs/shape-B3.svg";
import shapeB4 from "../../puzzle-svgs/shape-B4.svg";
import shapeB5 from "../../puzzle-svgs/shape-B5.svg";
import shapeB6 from "../../puzzle-svgs/shape-B6.svg";
import RotatableShape from '../RotatableShape/RotatableShape';
import Draggable from 'react-draggable';

import { Tooltip } from 'react-tooltip'

function ShapeComponent ({ shape, handleShapeClick, handleDragsStart,theRef, shapeUri, setMovedShape, addOrUpdate }){
  const [activeDrags, setActiveDrag] = useState(0);
  const [deltaPosition, setDeltaPosition] = useState({x:0, y:0});
  const [initialPos, setInitialPos] = useState({x: 0, y: 0});

  const SVGS = {
    'shapeA1': shapeA1,
    'shapeA2': shapeA2,
    'shapeA3': shapeA3,
    'shapeA4': shapeA4,
    'shapeB1': shapeB1,
    'shapeB2': shapeB2,
    'shapeB3': shapeB3,
    'shapeB4': shapeB4,
    'shapeB5': shapeB5,
    'shapeB6': shapeB6
  }

  const shapePath = SVGS[shapeUri];

  const draggableRef = useRef();
  const divRef = useRef();


  const onStart = () => {
    setInitialPos({
      x: draggableRef.current.state.x,  
      y: draggableRef.current.state.y
    });
    setActiveDrag(activeDrags + 1);
  }

  const onStop = () => {
    setActiveDrag(activeDrags - 1);
  }

  const revertDrag = () => {
    draggableRef.current.setState(initialPos);
  }

  const handleDrag = (e, ui) => {
    const {x, y} = deltaPosition;
    setDeltaPosition({x: x + ui.deltaX, y: y + ui.deltaY});
  };

  const dragHandlers = {onStart: onStart, onStop: onStop};
    const [imgAngle, setImgAngle] = useState({});
    const containerRef = useRef(null);


    const isOverTarget = (x, y, target) => {
      const targetBounds = target.getBoundingClientRect();
      const {left, right, top, bottom} = targetBounds;
    
      // Check if x,y is within bounds
      if(x >= left && x <= right && y >= top && y <= bottom) {
        return true;
      }
    
      return false;
    }

    const setForLocalStorage = (id, angle, shapeUri) => {
      const obj = {
        id,
        x: draggableRef.current.state.x,  
        y: draggableRef.current.state.y,
        angle,
        shapeUri,
        isRemoved: false,
        isVisible: true
      }

      addOrUpdate(obj);
    }

    const handleDraggableDrop = (e, data) => {
      setActiveDrag(activeDrags - 1);

      const {x,y} = e;

      if(isOverDropZone(x,y)){
        handleDrop(e);
        const rect = theRef.current.getBoundingClientRect();
        const shapeRect = divRef.current.getBoundingClientRect();

        const mainBoxOffset = {
          x: theRef.current.clientLeft, 
          y: theRef.current.clientTop
        };

        const parentDiv = imgAngle?.eValue?.target.closest('div');
        const imgElement = parentDiv?.querySelector('.shape-piece');
        setMovedShape({
          id: e?.target?.id || imgElement?.id,
          x: shapeRect.x - rect.left,
          y: shapeRect.y - rect.top,
          shapeUri: e?.target?.id || imgElement?.id,
          angle: imgAngle?.angle || 0
        })

        const theId = e?.target?.id || imgElement?.id;
        const theAngle = imgAngle?.angle || 0;
        setForLocalStorage(theId, theAngle,  e?.target?.id || imgElement?.id)

      } else{
        revertDrag();
      }
    }


        // Check if over valid drop zone
    const isOverDropZone = (x, y) => {
      const el = document.elementsFromPoint(x, y);
      let isDropZone = false;
      
      el?.forEach(value => {
        if(value.id === "gameBox"){
          isDropZone = true;
        }
      })
      return isDropZone;
    }


    const handleDrop = (e) => {
      e.preventDefault();

      const shapeId = e.target.id;
      const shape = document.getElementById(shapeId);
      const box = document.getElementById("gameBox-main");

      const actualShape = document.getElementsByClassName(shapeId);

      // if (!shape || !box) return;

      // console.log("the shapes",actualShape?.[0]?.classList, document.getElementsByClassName(shapeId))

      if (!actualShape?.[0]?.classList.contains("inBox")) {
        // console.log("in list");
        // console.log("the shape", shape.parentNode)
        // shape.parentNode.removeChild(shape);
        // if (actualShape.parentNode !== box) {
        //   box.appendChild(shape);
        // }
        actualShape?.[0]?.classList.add("inBox");
      }
    }
  
    return (
      <div id={shapeUri} >
      <Draggable id={shapeUri} onDrag={handleDrag} {...dragHandlers} onStop={handleDraggableDrop} ref={draggableRef} defaultPosition={{x: shape?.x || 0, y: shape?.y || 0}}>
        <div className={`handle ${shapeUri} svg-containerImg`} ref={divRef}>
        <RotatableShape setImageAngle={setImgAngle}>
        <img src={shapePath} id={shapeUri} className="shape-piece" width="68%" height="68%"/>
        <a className="shape-text"         
          key={shape?.shapeUri}
          data-tooltip-id="my-tooltip"
          data-tooltip-content={shape?.shapeUri}>🤔</a>
       {/* <span className="shape-text" style={{marginBottom: "100px"}}>{shapeUri}</span> */}
       </RotatableShape>
       </div>
       </Draggable>
     </div>
    );
  }

export default ShapeComponent;
