/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';

const DroppableContainer = ({ id, children, onDrop }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    onDrop,
  });

  const style = {
    position: 'relative',
    border: isOver ? '2px dashed blue' : '2px dashed transparent',
    padding: '16px',
    marginBottom: '16px',
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
};

export default DroppableContainer;
