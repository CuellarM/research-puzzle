import React, {useRef, useEffect} from 'react';
import { useDrag, useDrop } from 'react-dnd';

const WORDS = ['apple', 'banana', 'cherry'];

const Word = ({ word, index, moveWord }) => {
    const [left, setLeft] = React.useState(0);
    const [top, setTop] = React.useState(0);
  const [{ isDragging }, drag] = useDrag({
    type:'word',
    item: { type: 'word', index, left: left, top: top },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;

  function handleMouseMove(event) {
    const { clientX, clientY } = event;
    setTop(clientY);
    setLeft(clientX);
  }

  return (
    <div ref={drag} style={{ opacity }} onMouseMove={handleMouseMove}>
      <span>{word}</span>
    </div>
  );
};

// const Box = () => {
//   const [droppedWords, setDroppedWords] = React.useState([]);
//   const drop = useRef(null);

//   const [{ canDrop, isOver }, dropTarget] = useDrop({
//     accept: 'word',
//   drop: (item, monitor) => {
//     const delta = monitor.getDifferenceFromInitialOffset();
//     const dragLeft = item.left + delta.x;
//     const dragTop = item.top + delta.y;

//     const dropRef = drop.current.getBoundingClientRect();
//     const dropLeft = Math.round(dragLeft - dropRef.left);
//     const dropTop = Math.round(dragTop - dropRef.top);

//     setDroppedWords((droppedWords) => [...droppedWords, { index: item.index, left: dropLeft, top: dropTop }]);
//   },
//   collect: (monitor) => ({
//     canDrop: monitor.canDrop(),
//     isOver: monitor.isOver(),
//   }),
//   });

//   const backgroundColor = canDrop
//     ? isOver
//       ? 'lightgreen'
//       : 'lightblue'
//     : 'white';

//   return (
//     <div ref={dropTarget} style={{ backgroundColor, width: '200px', height: '200px', position: 'relative' }}>
//       <h2>Drop Here</h2>
//       {droppedWords.map(({ index, left, top }) => (
//         <div key={index} style={{ position: 'absolute', left, top }}>
//           <span>{WORDS[index]}</span>
//           <button onClick={() => {
//             setDroppedWords((droppedWords) => droppedWords.filter(i => i.index !== index))
//           }}>Remove</button>
//         </div>
//       ))}
//     </div>
//   );
// };

const Box = () => {
    const [droppedWords, setDroppedWords] = React.useState([]);
    const drop = useRef(null);
  
    const [{ canDrop, isOver }, dropTarget] = useDrop({
      accept: 'word',
      drop: (item, monitor) => {
        console.log("the itme", item)
        const delta = monitor.getDifferenceFromInitialOffset();
        console.log("The left", delta);
        const dragLeft = item.left + delta.x;
        const dragTop = item.top + delta.y;
  
        if (!drop.current) {
          return;
        }
  
        const dropRef = drop.current.getBoundingClientRect();
        const dropLeft = Math.round(dragLeft - dropRef.left);
        const dropTop = Math.round(dragTop - dropRef.top);
  
        setDroppedWords((droppedWords) => [...droppedWords, { index: item.index, left: dropLeft, top: dropTop }]);
      },
      collect: (monitor) => ({
        canDrop: monitor.canDrop(),
        isOver: monitor.isOver(),
      }),
    });
  
    useEffect(() => {
      if (!drop.current) {
        return;
      }
  
      const dropRef = drop.current.getBoundingClientRect();
      console.log(dropRef.width, dropRef.height);
    }, [drop]);
  
    const backgroundColor = canDrop
      ? isOver
        ? 'lightgreen'
        : 'lightblue'
      : 'white';
  
    return (
      <div ref={dropTarget} style={{ backgroundColor, width: '200px', height: '200px', position: 'relative' }}>
        <h2>Drop Here</h2>
        {droppedWords.map(({ index, left, top }) => (
          <div key={index} style={{ position: 'absolute', left, top }}>
            <span>{WORDS[index]}</span>
            <button onClick={() => {
              setDroppedWords((droppedWords) => droppedWords.filter(i => i.index !== index))
            }}>Remove</button>
          </div>
        ))}
        <div ref={drop}></div>
      </div>
    );
  };

const WordTest = () => {
  const [words, setWords] = React.useState(WORDS);

  const moveWord = (dragIndex, dropIndex) => {
    const newWords = [...words];
    const draggedWord = newWords[dragIndex];

    newWords.splice(dragIndex, 1);
    newWords.splice(dropIndex, 0, draggedWord);

    setWords(newWords);
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ marginRight: '20px' }}>
        <h2>Words</h2>
        {words.map((word, index) => (
          <Word key={word} word={word} index={index} moveWord={moveWord} />
        ))}
      </div>
      <Box />
    </div>
  );
};

export default WordTest;
