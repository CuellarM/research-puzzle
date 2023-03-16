import React, { useState } from "react";
import "./styles.css";

const puzzlePieces = [
  {
    id: 1,
    name: "Square",
    image: "https://via.placeholder.com/150x150.png?text=Square",
  },
  {
    id: 2,
    name: "Circle",
    image: "https://via.placeholder.com/150x150.png?text=Circle",
  },
  {
    id: 3,
    name: "Triangle",
    image: "https://via.placeholder.com/150x150.png?text=Triangle",
  },
];

const PuzzleBox = ({ onDrop, puzzlePiece }) => {
  const handleDrop = (e) => {
    e.preventDefault();
    const puzzlePieceId = e.dataTransfer.getData("puzzlePieceId");
    onDrop(puzzlePieceId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="puzzle-box" onDrop={handleDrop} onDragOver={handleDragOver}>
      {puzzlePiece ? (
        <img src={puzzlePiece.image} alt={puzzlePiece.name} />
      ) : (
        "Drop puzzle piece here"
      )}
    </div>
  );
};

const PuzzlePiece = ({ puzzlePiece }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData("puzzlePieceId", puzzlePiece.id);
  };

  return (
    <div className="puzzle-piece" draggable onDragStart={handleDragStart}>
      <img src={puzzlePiece.image} alt={puzzlePiece.name} />
    </div>
  );
};

export default function Puzzle() {
  const [puzzlePiecesInBox, setPuzzlePiecesInBox] = useState([]);
  const [puzzleSolved, setPuzzleSolved] = useState(false);

  const handleDrop = (puzzlePieceId) => {
    const draggedPuzzlePiece = puzzlePieces.find(
      (puzzlePiece) => puzzlePiece.id === parseInt(puzzlePieceId, 10)
    );
    setPuzzlePiecesInBox([...puzzlePiecesInBox, draggedPuzzlePiece]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const checkPuzzleSolved = () => {
    const puzzlePiecesInBoxIds = puzzlePiecesInBox.map(
      (puzzlePiece) => puzzlePiece.id
    );
    const expectedPuzzlePiecesIds = puzzlePieces.map(
      (puzzlePiece) => puzzlePiece.id
    );

    if (
      JSON.stringify(puzzlePiecesInBoxIds) ===
      JSON.stringify(expectedPuzzlePiecesIds)
    ) {
      setPuzzleSolved(true);
    }
  };
  
  return (
    <div className="App">
      <h1>Puzzle Game</h1>
      {puzzleSolved ? (
        <div>Congratulations! You solved the puzzle!</div>
      ) : (
        <>
          {/* <div className="puzzle-container">
            <div className="puzzle-box big-box" onDrop={handleDrop} onDragOver={handleDragOver}>
              {puzzlePiecesInBox[0] ? <img src={puzzlePiecesInBox[0].image} alt={puzzlePiecesInBox[0].name} /> : "Drop puzzle piece here"}
            </div>
            <div className="puzzle-box" onDrop={handleDrop} onDragOver={handleDragOver}>
              {puzzlePiecesInBox[1] ? <img src={puzzlePiecesInBox[1].image} alt={puzzlePiecesInBox[1].name} /> : "Drop puzzle piece here"}
            </div>
            <div className="puzzle-box" onDrop={handleDrop} onDragOver={handleDragOver}>
              {puzzlePiecesInBox[2] ? <img src={puzzlePiecesInBox[2].image} alt={puzzlePiecesInBox[2].name} /> : "Drop puzzle piece here"}
            </div>
          </div> */}
          {/* <div className="puzzle-container">
  <PuzzleBox onDrop={handleDrop} puzzlePiece={puzzlePiecesInBox[0]} />
  <PuzzleBox onDrop={handleDrop} puzzlePiece={puzzlePiecesInBox[1]} />
  <PuzzleBox onDrop={handleDrop} puzzlePiece={puzzlePiecesInBox[2]} />
</div> */}
          <div className="puzzle-pieces-container">
            {puzzlePieces.map((puzzlePiece) => (
              <PuzzlePiece key={puzzlePiece.id} puzzlePiece={puzzlePiece} />
            ))}
          </div>
          <button onClick={checkPuzzleSolved}>Check Puzzle</button>
        </>
      )}
    </div>
  );
}  