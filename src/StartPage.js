import React, { useEffect, useState } from "react";
import { ProgressBar } from  'react-loader-spinner'
import { playerSocket } from "./service/ConnectSocket";
import MainGame from "./MainGame";

const StartPage = () =>  {
    const [showOverlay, setShowOverlay] = useState(true);
    const [playerName, setPlayerName] = useState("");
    const [roomId, setRoomId] = useState(null);
    const [newGameSprite, setNewGameSprite] = useState(null);
    const [playersInRoom, setPlayersInRoom] = useState([]);
    const [showMainGame, setShowMainGame] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState("");

    const levels = [
      {"name":"Level 1",  "value":"LEVEL_1"}, 
      {"name":"Level 2",  "value":"LEVEL_2"}
    ]
    useEffect(() => {
        playerSocket.on('newGameSprite', (newSpriteObject) => {
          console.log('the new sprites', newSpriteObject)
          setAllGameSprites(newSpriteObject?.playerSprites[0]);
          setPlayersInRoom(newSpriteObject?.players);
        });
      }, [playerSocket])




  function compareAndMergeArrays(arrayA, arrayB) {
    const idsInArrayA = arrayA.map(objA => objA.shapeUri);
    const uniqueObjectsB = arrayB.filter(objB => !idsInArrayA.includes(objB.shapeUri));

    const mergedArray = [...arrayA, ...uniqueObjectsB];

    return mergedArray;
  }

      const setAllGameSprites = (sprites) => {
        const localStorageKey = localStorage.getItem("playerCacheName");
          const playerCachedSprites = JSON.parse(localStorage.getItem(localStorageKey));
          if(playerCachedSprites != null || !playerCachedSprites?.length < 1){
            const cachedObjects = compareAndMergeArrays(playerCachedSprites, sprites);
            setNewGameSprite(cachedObjects);
          }else{
            setNewGameSprite(sprites)
          }
      }

    
      useEffect(() => {
        if(newGameSprite !== null){
          setTimeout(() => {
            setShowOverlay(false);
            setShowMainGame(true);
          }, 5000)

        }
      }, [newGameSprite])

    const handleJoinRoom = () => {
        localStorage.setItem('playerCacheName', playerName+roomId)
        playerSocket.emit('registerPlayer', playerName)
        playerSocket.emit('joinRoom', roomId, false, selectedLevel);
      };

    const handleStartGame = () => {
        handleJoinRoom();
        setShowLoading(true);
      };

      const handlePlayerNameChange = (event) => {
        setPlayerName(event.target.value);
      }

    return(
        <div>
        {showOverlay && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
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
            showMainGame && <MainGame gameObjects={newGameSprite} playersInRoom={playersInRoom} playerName={playerName} roomId={roomId}/>
          }
          </div>
    )
}

export default StartPage;