import React, { useState } from 'react';

const BoxWithDragAndDrop = () => {
    const [pieces, setPieces] = useState([
        { id: 1, shape: 'square', color: 'red' },
        { id: 2, shape: 'circle', color: 'green' },
        { id: 3, shape: 'triangle', color: 'blue' },
        { id: 4, shape: 'square', color: 'purple' },
        { id: 5, shape: 'circle', color: 'yellow' },
        { id: 6, shape: 'triangle', color: 'pink' },
        { id: 7, shape: 'square', color: 'brown' },
        { id: 8, shape: 'circle', color: 'gray' },
        { id: 9, shape: 'triangle', color: 'orange' },
      ]);
    
      const [droppedPieces, setDroppedPieces] = useState([]);
    
      const onDragStart = (event, id) => {
        event.dataTransfer.setData('id', id);
      };
    
      const onDrop = (event) => {
        event.preventDefault();
        const id = event.dataTransfer.getData('id');
        const piece = pieces.find((piece) => piece.id === Number(id));
        const x = event.clientX - event.target.getBoundingClientRect().left;
        const y = event.clientY - event.target.getBoundingClientRect().top;
        setDroppedPieces((droppedPieces) => [
          ...droppedPieces,
          { ...piece, x, y },
        ]);
        setPieces((pieces) => pieces.filter((piece) => piece.id !== Number(id)));
      };
    
      const onDragOver = (event) => {
        event.preventDefault();
      };
    
      const onDragEnd = (event, id) => {
        const piece = droppedPieces.find((piece) => piece.id === Number(id));
        const x = event.clientX - event.target.getBoundingClientRect().left;
        const y = event.clientY - event.target.getBoundingClientRect().top;
        if (x < 0 || x > event.target.clientWidth || y < 0 || y > event.target.clientHeight) {
          setDroppedPieces((droppedPieces) =>
            droppedPieces.filter((piece) => piece.id !== Number(id))
          );
          setPieces((pieces) => [...pieces, piece]);
        } else {
          setDroppedPieces((droppedPieces) =>
            droppedPieces.map((piece) =>
              piece.id === Number(id) ? { ...piece, x, y } : piece
            )
          );
        }
      };

  return (
    <div>
      <div
        style={{
          width: '300px',
          height: '300px',
          border: '1px solid black',
          marginBottom: '10px',
          position: 'relative',
        }}
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        {droppedPieces.map((piece) => (
          <div
          key={piece.id}
          style={{
            position: 'absolute',
            left: piece.x,
            top: piece.y,
            width: '50px',
            height: '50px',
            backgroundColor: piece.color,
            borderRadius: piece.shape === 'circle' ? '50%' : 0,
            transform: piece.shape === 'triangle' ? 'rotate(45deg)' : undefined,
            cursor: 'move',
          }}
          draggable={true}
          onDragStart={(event) => onDragStart(event, piece.id)}
          onDragEnd={(event) => onDragEnd(event, piece.id)}
        />
        ))}
      </div>
      <div>
        {pieces.map((piece) => (
          <div
            key={piece.id}
            style={{
                width: '50px',
                height: '50px',
                backgroundColor: piece.color,
                borderRadius: piece.shape === 'circle' ? '50%' : 0,
                transform: piece.shape === 'triangle' ? 'rotate(45deg)' : undefined,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'move',
              }}
            draggable={true}
            onDragStart={(event) => onDragStart(event, piece.id)}
            // onDragEnd={(event) => onDragEnd(event, piece.id)}
          />

        ))}
      </div>
    </div>
  );
};

export default BoxWithDragAndDrop;
