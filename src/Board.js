import React, { useState } from 'react';

const Board = () => {
    const [pieces, setPieces] = useState([
        { id: 1, shape: 'square', color: 'red' },
        { id: 2, shape: 'circle', color: 'green' },
        { id: 3, shape: 'triangle', color: 'blue' },
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

//   const onDragEnd = (event, id) => {
//     const piece = droppedPieces.find((piece) => piece.id === Number(id));
//     const x = event.clientX - event.target.getBoundingClientRect().left;
//     const y = event.clientY - event.target.getBoundingClientRect().top;
//     if (x < 0 || x > event.target.clientWidth || y < 0 || y > event.target.clientHeight) {
//       setDroppedPieces((droppedPieces) =>
//         droppedPieces.filter((piece) => piece.id !== Number(id))
//       );
//       setPieces((pieces) => [...pieces, piece]);
//     }
//   };

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

export default Board;
