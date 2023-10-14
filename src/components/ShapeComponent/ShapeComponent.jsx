/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useRef, useState } from 'react';
import Draggable from 'react-draggable';
import shapeA1 from '../../puzzle-svgs/shape-A1.svg';
import shapeA2 from '../../puzzle-svgs/shape-A2.svg';
import shapeA3 from '../../puzzle-svgs/shape-A3.svg';
import shapeA4 from '../../puzzle-svgs/shape-A4.svg';
import shapeB1 from '../../puzzle-svgs/shape-B1.svg';
import shapeB2 from '../../puzzle-svgs/shape-B2.svg';
import shapeB3 from '../../puzzle-svgs/shape-B3.svg';
import shapeB4 from '../../puzzle-svgs/shape-B4.svg';
import shapeB5 from '../../puzzle-svgs/shape-B5.svg';
import shapeB6 from '../../puzzle-svgs/shape-B6.svg';
import RotatableShape from '../RotatableShape/RotatableShape';
import './ShapeComponent.css';


function ShapeComponent ({ shape, handleShapeClick, handleDragsStart,theRef, shapeUri, setMovedShape, addOrUpdate, updateState }){
  const [activeDrags, setActiveDrag] = useState(0);
  const [deltaPosition, setDeltaPosition] = useState({x:0, y:0});
  const [initialPos, setInitialPos] = useState({x: 0, y: 0});
  const [initialSize, setInitialSize] = useState({
    width: 200,
    height: 200
  });

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
  };

  const getBeforeHyphen = str => {
    const regex = /^([^-]+)/;
    const match = str.match(regex);
    return match[1];
  };

  const shapePath = SVGS[getBeforeHyphen(shapeUri)];

  const draggableRef = useRef();
  const divRef = useRef();
  const currDraggableRef = useRef();


  const onStart = () => {
    setInitialPos({
      x: draggableRef.current.state.x,  
      y: draggableRef.current.state.y
    });
    setActiveDrag(activeDrags + 1);
  };

  const onStop = () => {
    setActiveDrag(activeDrags - 1);
  };

  const revertDrag = () => {
    draggableRef.current.setState(initialPos);
  };

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
  };

  const setForLocalStorage = (id, angle, shapeUri, x, y, owner, shapeId) => {
    const obj = {
      id: shapeId,
      x: x,  
      y: y,
      angle,
      shapeUri,
      isRemoved: false,
      isVisible: true,
      owner: owner
    };

    addOrUpdate(obj);
  };

  const handleDraggableDrop = (e, data) => {
    setActiveDrag(activeDrags - 1);
    // const {x,y} = e;

    const {clientX, clientY} = e;

    const x = clientX;
    const y = clientY;

    if(isOverDropZone(x,y)){
      handleDrop(e);
      const rect = theRef.current.getBoundingClientRect();
      const shapeRect = divRef.current.getBoundingClientRect();
      const scale = rect.width / initialSize.width;
      const size = rect.width * 0.5;
      setInitialSize({
        width: initialSize.width * (scale /3),
        height: initialSize.height * (scale/3)
      });

      const mainBoxOffset = {
        x: theRef.current.clientLeft, 
        y: theRef.current.clientTop
      };

      const parentDiv = imgAngle?.eValue?.target.closest('div');
      const imgElement = parentDiv?.querySelector('.shape-piece');

      const theDraggedShape = currDraggableRef.current;
      const shapeInDrag = document.getElementById(e?.target?.id);

      const theShapeDiv = data?.node;
      const style = theShapeDiv?.style;
      const translate = style?.transform;

      // Split into components
      const parts = translate?.slice(10, -1)?.split(', ');

      // Extract x and y
      const x = parseInt(parts?.[0]); // -62 
      const y = parseInt(parts?.[1]); // -389

      shape['isOnBoard'] = false;
      shape['x'] = x;
      shape['y'] = y;
      updateState(shape);
      
      setMovedShape({
        id: shape?.id,
        shapeId: e?.target?.id || imgElement?.id,
        x: x,
        y: y,
        owner: shape?.owner,
        shapeMeta: e?.target?.id || imgElement?.id,
        shapeUri: shapeUri,
        angle: imgAngle?.angle || 0,
        width: rect?.width,
        height: rect?.height
      });

      const theId = e?.target?.id || imgElement?.id;
      const theAngle = imgAngle?.angle || 0;
      setForLocalStorage(theId, theAngle, e?.target?.id || imgElement?.id, x, y, shape?.owner, shape?.id);

    } else{
      revertDrag();
    }
  };


  // Check if over valid drop zone
  const isOverDropZone = (x, y) => {
    const el = document.elementsFromPoint(x, y);
    let isDropZone = false;
      
    el?.forEach(value => {
      if(value.id === 'gameBox'){
        isDropZone = true;
      }
    });
    return isDropZone;
  };


  const handleDrop = (e) => {
    e.preventDefault();

    const shapeId = e.target.id;
    const shape = document.getElementById(shapeId);
    const box = document.getElementById('gameBox-main');

    const actualShape = document.getElementsByClassName(shapeId);

    if (!shape || !box) return;

    const theShapeDragged = currDraggableRef.current;
    if (!theShapeDragged?.classList?.contains('inBox')) {
      // const theDraggedShape = currDraggableRef.current.firstChild;
      // const shapeDiv = document.createElement('div');

      // shapeDiv.appendChild(theDraggedShape)
      // box.appendChild(shapeDiv);
      // shapeDiv.id = shapeId;
      // shapeDiv.ref = currDraggableRef;
      // // shapeDiv.style.position = "absolute";
      // const img = shapeDiv.querySelector('img');

      // const shapeEl = shapeDiv?.firstChild;

      // shapeEl.style.position = "absolute";

      // img?.classList?.add('inbox');

      // if (currDraggableRef.current.parentNode.contains(currDraggableRef.current)) {
      //   // Remove the child node if it's a child of the parent
      //   console.log('contaaaaaains in shape component', currDraggableRef.current);
      //   currDraggableRef.current.parentNode.removeChild(currDraggableRef.current);
      // } else {
      //   console.error("Error: The node to be removed is not a child of this node.");
      // }

      // if(currDraggableRef.current.parentNode.contains(currDraggableRef.current)){
      //   currDraggableRef.current.parentNode.removeChild(currDraggableRef.current); 
      // } else {
      //   console.log('Cannot remove objhect from node')
      // }
        
      // theShapeDragged?.classList.add("inBox");
    }
  };

  const getDimensions = () => {

    let height = initialSize?.height;
    let width = initialSize?.width;
    let color = 'black';

    switch(getBeforeHyphen(shapeUri)){
    case 'shapeA2':
      height = initialSize?.height + 220;
      width = initialSize?.width + 160;
      break;
    case 'shapeA1':
      height = initialSize?.height + 150;
      width = initialSize?.width + 150;
      break;
    case 'shapeA3':
      height = initialSize?.height + 81;
      width = initialSize?.width - 91;
      break;
    case 'shapeA4':
      height = initialSize?.height + 90;
      width = initialSize?.width - 10;
      break;
    case 'shapeB1':
      height = initialSize?.height + 106;
      width = initialSize?.width + 54;
      color = 'darkorange';
      break;
    case 'shapeB2':
      height = initialSize?.height + 165;
      width = initialSize?.width + 100;
      color = 'darkorange';
      break;
    case 'shapeB3':
      height = initialSize?.height + 165;
      width = initialSize?.width + 100;
      color = 'darkorange';
      break;
    case 'shapeB4':
      height = initialSize?.height + 100;
      width = initialSize?.width + 44;
      color = 'darkorange';
      break;
    case 'shapeB5':
      height = initialSize?.height + 100;
      width = initialSize?.width + 54;
      color = 'darkorange';
      break;
    case 'shapeB6':
      height = initialSize?.height + 100;
      width = initialSize?.width + 44;
      color = 'darkorange';
      break;
    default:
      height = initialSize?.height;
      width = initialSize?.width;
      color = 'black';
    }

    return {
      height: height,
      width: width,
      color: color
    };
  };
  
  return (
    <div id={shapeUri} ref={currDraggableRef}>
      <Draggable id={shapeUri} onDrag={handleDrag} {...dragHandlers} onStop={handleDraggableDrop} ref={draggableRef} defaultPosition={{x: shape?.x || 0, y: shape?.y || 0}}>
        <div className={`handle ${shapeUri} svg-containerImg`} ref={divRef} style={{position: 'absolute'}}>
          {!shape?.isOnBoard && (
            <RotatableShape setImageAngle={setImgAngle}>
              <img src={shapePath} style={{
                pointerEvents: activeDrags === 1 ? 'auto' : 'none',
                // zIndex: activeDrags === 1 ? 10 : 1,
              }} id={`${shapeUri}`} className="shape-piece" width={shape?.isOnBoard ? '120px' : getDimensions()?.width} height={shape?.isOnBoard ? '120px' : getDimensions()?.height}/>
              <p className="shape-text" style={{color: getDimensions()?.color, fontWeight: 'bold', marginTop: '50px', zIndex: 20}}>{shape?.shapeUri}</p>
            </RotatableShape>
          )}
          {shape?.isOnBoard && (
            <div style={{position: 'absolute'}}>
              <img src={shapePath} id={`${shapeUri}`} className="shape-piece" width={shape?.isOnBoard ? '120px' : getDimensions()?.width} height={shape?.isOnBoard ? '120px' : getDimensions()?.height}/>
            </div>
          )}
        </div>
      </Draggable>
    </div>
  );
}

export default ShapeComponent;
