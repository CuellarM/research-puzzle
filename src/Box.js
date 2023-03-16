import React, { useState } from 'react';

const BoxWith = () => {
    const [pieces, setPieces] = useState([
        { id: 1, text: 'Piece 1' },
        { id: 2, text: 'Piece 2' },
        { id: 3, text: 'Piece 3' },
      ]);
    
      const [droppedPieces, setDroppedPieces] = useState([]);
      const [draggingPiece, setDraggingPiece] = useState(null);
    
      const onDragStart = (event, id) => {
        event.dataTransfer.setData('id', id);
        const piece = droppedPieces.find((piece) => piece.id === id);
        setDraggingPiece(piece);
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
    
      const onDrag = (event, id) => {
        const piece = droppedPieces.find((piece) => piece.id === id);
        piece.x = event.clientX - event.target.getBoundingClientRect().left;
        piece.y = event.clientY - event.target.getBoundingClientRect().top;
        setDroppedPieces([...droppedPieces]);
      };

      const onDragEnd = () => {
        if (draggingPiece) {
          if (
            draggingPiece.x < 0 ||
            draggingPiece.x > 300 ||
            draggingPiece.y < 0 ||
            draggingPiece.y > 300
          ) {
            setPieces((pieces) => [...pieces, draggingPiece]);
          }
          setDraggingPiece(null);
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
        onDragEnd={onDragEnd}
      >
        {droppedPieces.map((piece) => (
          <div
            key={piece.id}
            style={{
              position: 'absolute',
              left: piece.x,
              top: piece.y,
            }}
            draggable={true}
            onDragStart={(event) => onDragStart(event, piece.id)}
            onDrag={(event) => onDrag(event, piece.id)}
          >
            {piece.text}
          </div>
        ))}
      </div>
      <div>
        {pieces.map((piece) => (
          <div
            key={piece.id}
            draggable={true}
            onDragStart={(event) => onDragStart(event, piece.id)}
          >
            {piece.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoxWith;
