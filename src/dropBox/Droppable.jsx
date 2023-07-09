/* eslint-disable react/prop-types */

import React from 'react';
import {useDroppable} from '@dnd-kit/core';

function Droppable(props) {
  const {isOver, setNodeRef} = useDroppable({
    id: 'game-droppable',
  });
  const style = {
    opacity: isOver ? 1 : 0.5,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {props.items.map((item,idx) => (
        <div key={`${item}-${idx}`}>
          {item}
        </div>
      ))}
    </div>
  );
}

export default Droppable;
  