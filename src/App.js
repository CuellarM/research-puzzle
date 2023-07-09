
import React, { useEffect, useRef, useState } from "react";
import AnotherTest from "./MainGame";
import Board from "./Board";
import BoxWith from "./Box";
import BoxMe from "./Box";
import BoxWithDragAndDrop from "./Draggable";
import Piece from "./Pieces";
import Puzzle from "./Puzzle";
import "./styles.css";
import TestBox from "./TestBox";
import WordTest from "./Word";
import GameView from "./GameView";
import TabPage from "./TabPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DropBox from "./dropBox/DropBox";
import Try from "./test/Try";
import StartPage from "./StartPage";

const App = () => {
  // const AnotherPage =() => {
  //   return  (
  //   <AnotherTest setPlayerId={handlePlayerName} setOtherPlayerValues={setOtherPlayerValues}/>);
  // }

  const tabTitles = [
    { id: 'tab1', title: 'Tab 1', content: 'Content for Tab 1' },
    { id: 'tab2', title: 'Tab 2', content: 'Content for Tab 2' },
    { id: 'tab3', title: 'Tab 3', content: 'Content for Tab 3' },
  ];

  return (
    <div className="App">
          <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        {/* <Route path="/tabs/*" element={<TabPage />} /> */}
      </Routes>
    </Router>
            {/* <Router>
        <Routes>
          <Route path="/" exact element={AnotherPage} />
          <Route path="/tabs" element={TabPage} />
        </Routes>
      </Router>
     
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
        }}
      >
        {console.log("player name", playerId)}
        <TabPage />
        <GameView droppedShapes={otherPlayerValues} playerName={playerId} /> */}
        {/* <GameView droppedShapes={[]} /> */}
      {/* </div> */}
      {/* <WordTest /> */}
      {/* <BoxWithDragAndDrop /> */}
      {/* </div> */}

    </div>
  );
  }

  export default App;
