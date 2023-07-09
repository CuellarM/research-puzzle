/* eslint-disable react/prop-types */

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';

const DraggableItem = ({ id, offsetX = 0, offsetY = 0, children }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const style = {
    transform: CSS.Translate.toString({
      x: transform.x + offsetX,
      y: transform.y + offsetY,
    }),
    userSelect: 'none',
    position: 'absolute',
    zIndex: 100,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
};

export default DraggableItem;