// import React, {useState} from 'react';
// import {DndContext} from '@dnd-kit/core';
// import Draggable from './Draggable';
// import Droppable from './Droppable';

// function DropBox() {
//   const pieces = ['dhfh', 'hfshfsj']
//   const [dragItems, setDragItems] = useState([]);
//   const [parent, setParent] = useState(null);
//   const draggable = (
//       <Draggable id="draggable">
//       Go ahead, drag me.
//       </Draggable>
//   )

//   return (
//     <DndContext onDragEnd={handleDragEnd} >
//       {/* {!parent ? {allD} : null} */}
//       <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
//       {pieces.map((itemId) => (
//         <Draggable key={itemId} id={itemId}>
//           {itemId}
//         </Draggable>
//       ))}
//     </div>
//         <div
//           style={{
//             width: 400,
//             height: 400,
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             border: '2px dashed #ddd',
//             borderRadius: 8,
//             margin: '20px auto',
//           }}
//         >
//           <Droppable items={dragItems} />
//         </div>
//     </DndContext>
//   );

//   function handleDragEnd(event) {
//     // setParent(over ? over.id : null);
//     // setDragItems((items) => {
//     //   const newItems = items.filter((item) => item !== active.id);
//     //   return newItems;
//     // });

//     console.log('the event', event)

//     const newItem = event.active.data.current?.title;
//     console.log("the item", newItem)
//     if (!newItem) return;
//     const temp = [...dragItems];
//     temp.push(newItem);
//     setDragItems(temp);
//     console.log('done')
//   }
// }

// export default DropBox;

import React, { useState } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import DraggableItem from './DraggableItem';
import DroppableContainer from './DroppableContainer';

const Dropbox = () => {
  const [items, setItems] = useState([
    { id: 'item1', name: 'Item 1' },
    { id: 'item2', name: 'Item 2' },
    { id: 'item3', name: 'Item 3' },
  ]);

  const handleDrop = (event) => {
    const { id } = event.over;
    const droppedItem = items.find((item) => item.id === event.active.id);
  
    if (droppedItem) {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === droppedItem.id ? { ...item, dropZone: id, offsetX: 0, offsetY: 0 } : item
        )
      );
    }
  };

  const handleKeyPress = (event, index) => {
    if (event.key === 'ArrowLeft' && index > 0) {
      setItems((prevItems) => {
        const updatedItems = [...prevItems];
        [updatedItems[index], updatedItems[index - 1]] = [
          updatedItems[index - 1],
          updatedItems[index],
        ];
        return updatedItems;
      });
    } else if (event.key === 'ArrowRight' && index < items.length - 1) {
      setItems((prevItems) => {
        const updatedItems = [...prevItems];
        [updatedItems[index], updatedItems[index + 1]] = [
          updatedItems[index + 1],
          updatedItems[index],
        ];
        return updatedItems;
      });
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <DndContext>
        <div style={{ position: 'absolute', top: '20px' }}>
          {items.map((item, index) => (
            <DraggableItem id={item.id} key={item.id}>
              <div
                tabIndex={0}
                onKeyDown={(event) => handleKeyPress(event, index)}
                style={{ cursor: 'move' }}
              >
                {item.name}
              </div>
            </DraggableItem>
          ))}
        </div>
        <DroppableContainer id="dropzone" onDrop={handleDrop}>
          <div style={{ height: '200px', width: '400px', border: '2px dashed gray' }}>
            Dropzone
          </div>
        </DroppableContainer>
        <DragOverlay>
          {({ active }) => {
            if (active && active.id === 'draggable-item') {
              return <DraggableItem id="draggable-item">{active.node}</DraggableItem>;
            }
            return null;
          }}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default Dropbox;
