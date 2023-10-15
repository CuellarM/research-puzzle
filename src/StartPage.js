/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { ProgressBar } from 'react-loader-spinner';
import MainGame from './MainGame';
import { playerSocket } from './service/ConnectSocket';

const StartPage = () => {
  const [showOverlay, setShowOverlay] = useState(true);
  const [playerName, setPlayerName] = useState('');
  const [roomId, setRoomId] = useState(null);
  const [newGameSprite, setNewGameSprite] = useState(null);
  const [playersInRoom, setPlayersInRoom] = useState([]);
  const [showMainGame, setShowMainGame] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState('');

  const testObjects = [
    {
      id: 'p2-01-A1',
      isVisible: true,
      shapeUri: 'shapeA1-029',
      owner: 'bhjjh',
      isOnBoard: true,
      x: 0,
      y: 0
    },
    {
      id: 'p2-02-A1',
      isVisible: true,
      shapeUri: 'shapeA1-030',
      owner: 'bhjjh',
      isOnBoard: true,
      x: 0,
      y: 0
    },
    {
      id: 'p2-01-A4',
      isVisible: true,
      shapeUri: 'shapeA4-031',
      owner: 'bhjjh',
      isOnBoard: true,
      x: 0,
      y: 0
    },
    {
      id: 'p2-01-A3',
      isVisible: true,
      shapeUri: 'shapeA3-032',
      owner: 'bhjjh',
      isOnBoard: true,
      x: 0,
      y: 0
    }
  ];

  const playerNameTest = 'bhjjh';

  const levels = [
    {'name':'Level 1', 'value':'LEVEL_1'}, 
    {'name':'Level 2', 'value':'LEVEL_2'}
  ];
  useEffect(() => {
    playerSocket.on('newGameSprite', (newSpriteObject) => {
      setAllGameSprites(newSpriteObject?.playerSprites[0]);
      setPlayersInRoom(newSpriteObject?.players);
    });
  }, [playerSocket]);




  function compareAndMergeArrays(arrayA, arrayB) {
    const idsInArrayA = arrayA.map(objA => objA.shapeUri);
    const uniqueObjectsB = arrayB.filter(objB => !idsInArrayA.includes(objB.shapeUri));

    const mergedArray = [...arrayA, ...uniqueObjectsB];

    return mergedArray;
  }

  const setAllGameSprites = (sprites) => {
    const localStorageKey = localStorage.getItem('playerCacheName');
    const playerCachedSprites = JSON.parse(localStorage.getItem(localStorageKey));
    if(playerCachedSprites != null || !playerCachedSprites?.length < 1){
      const cachedObjects = compareAndMergeArrays(playerCachedSprites, sprites);
      setNewGameSprite(cachedObjects);
    }else{
      setNewGameSprite(sprites);
    }
  };

    
  useEffect(() => {
    if(newGameSprite !== null){
      setTimeout(() => {
        setShowOverlay(false);
        setShowMainGame(true);
      }, 5000);

    }
  }, [newGameSprite]);

  const handleJoinRoom = () => {
    localStorage.setItem('playerCacheName', playerName+roomId+selectedLevel);
    playerSocket.emit('registerPlayer', playerName);
    playerSocket.emit('joinRoom', roomId, false, selectedLevel);
  };

  const handleStartGame = () => {
    handleJoinRoom();
    setShowLoading(true);
  };

  const handlePlayerNameChange = (event) => {
    setPlayerName(event.target.value);
  };

  return(
    <div>
      {showOverlay && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
          }}
        >
          <input
            type="text"
            value={playerName}
            onChange={handlePlayerNameChange}
            placeholder="Player name"
          />
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Game room"
          />
          <select id="key-select" value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)}>
            <option value="">-- Select a game level--</option>
            {levels?.map(key => (
              <option key={key?.value} value={key?.value}>{key?.name}</option>
            ))}
          </select>
          <button
            onClick={handleStartGame}     
            //{handleStartGame}
            disabled={(!playerName&&!roomId) || showLoading}
          >
            Start Game
          </button>
        </div>
      )}
      {showLoading && !showMainGame && 
            <div>
              <ProgressBar
                height="80"
                width="100px"
                ariaLabel="progress-bar-loading"
                wrapperStyle={{}}
                wrapperClass="progress-bar-wrapper"
                borderColor = '#F4442E'
                barColor = '#51E5FF'
              />
              <p>Loading all game assets...</p>
            </div>
      }
      {
        showMainGame && 
        <MainGame 
          gameObjects={newGameSprite} 
          playersInRoom={playersInRoom} 
          playerName={playerName} 
          roomId={roomId} 
          level={selectedLevel}
        />
      }
      {/* <MainGame gameObjects={testObjects} playersInRoom={playersInRoom} playerName={playerNameTest} roomId={'roomea'}/> */}
    </div>
  );
};

export default StartPage;