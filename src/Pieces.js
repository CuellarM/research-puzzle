import { useRef } from "react";
import "./styles.css";

const places = [
  { color: "yellow", position: [300, 100], radius: Math.random() * 100 },
  { color: "orange", position: [300, 200], radius: Math.random() * 100 },
  { color: "red", position: [100, 100], radius: Math.random() * 100 },
  { color: "green", position: [200, 100], radius: Math.random() * 100 },
  { color: "blue", position: [100, 200], radius: Math.random() * 100 },
  { color: "purple", position: [200, 200], radius: Math.random() * 100 }
];

const pieces = [...places].map((piece) => ({
  color: piece.color,
  position: [Math.random() * 300, Math.random() * 300 + 300],
  radius: piece.radius
}));

export default function Piece() {
  const selected = useRef();

  const handleMouseDown = (event, index) => {
    selected.current = { index, element: event.target };
    document.addEventListener("mousemove", handleMouseMove);
  };

  const handleMouseMove = (event) => {
    const { element, index } = selected.current;

    const positionX = event.pageX - element.offsetWidth / 2;
    const positionY = event.pageY - element.offsetHeight / 2;

    const targetX = places[index].position[0];
    const targetY = places[index].position[1];

    const differenceX = Math.abs(positionX - targetX);
    const differenceY = Math.abs(positionY - targetY);

    if (differenceX < 16 && differenceY < 16) {
      const transform = `translate3d(${targetX - element.offsetWidth / 4}px, ${
        targetY - element.offsetHeight / 4
      }px, 0)`;
      const transition = `transform 100ms linear`;
      element.style.transform = transform;
      element.style.transition = transition;
      element.style.opacity = 0.5;
      endDrag();
    } else {
      const transform = `translate3d(${positionX}px, ${positionY}px, 0)`;
      element.style.transform = transform;
    }
  };

  const handleMouseUp = () => {
    endDrag();
  };

  const endDrag = () => {
    selected.current = null;
    document.removeEventListener("mousemove", handleMouseMove);
  };

  return (
    <div className="App">
      {/* <div>
      <Board />
      </div> */}
      
      {/* {places.map((piece, index) => (
        <div
          key={index}
          style={{
            backgroundColor: piece.color,
            borderRadius: piece.radius + "%",
            width: "32px",
            height: "32px",
            position: "absolute",
            transform: `translate3d(${piece.position[0]}px, ${piece.position[1]}px, 0)`
          }}
        >
          {index}
        </div>
      ))} */}
      <div>
        {pieces.map((piece, index) => (
        <div
          key={index}
          onMouseDown={(event) => handleMouseDown(event, index)}
          onMouseUp={handleMouseUp}
          style={{
            backgroundColor: piece.color,
            borderRadius: piece.radius + "%",
            width: "64px",
            height: "64px",
            position: "absolute",
            transform: `translate3d(${piece.position[0]}px, ${piece.position[1]}px, 0)`
          }}
        >
          {index}
        </div>
      ))}
      </div>
    </div>
  );
}
