
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import MainGame from './MainGame';
import StartPage from './StartPage';
import DashBoard from './pages/dashboard/DashBoard';
import './styles.css';
import TestGame from './test/TestGame';

const App = () => {

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/test" element={<MainGame newGameSprite={[]} playersInRoom={''} playerName={''} roomId={'roomId'}/>} />
          <Route path="/" element={<StartPage />} />
          <Route path="/mainTest" element={<TestGame gameObjects={[]} playersInRoom={[]} playerName={'bhjjh'} roomId={''}/>} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
