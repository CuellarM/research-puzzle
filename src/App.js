
import React from "react";
import "./styles.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StartPage from "./StartPage";
import MainGame from "./MainGame";

const App = () => {

  return (
    <div className="App">
          <Router>
      <Routes>
        <Route path="/test" element={<MainGame newGameSprite={[]} playersInRoom={''} playerName={''} roomId={'roomId'}/>} />
        <Route path="/" element={<StartPage />} />
      </Routes>
    </Router>
    </div>
  );
  }

  export default App;
