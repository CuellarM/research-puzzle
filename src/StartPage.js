import React, { useEffect, useState } from "react";
import { playerSocket } from "./service/ConnectSocket";
import MainGame from "./MainGame";

const StartPage = () =>  {
    const [showOverlay, setShowOverlay] = useState(true);
    const [playerName, setPlayerName] = useState("");
    const [roomId, setRoomId] = useState(null);
    const [newGameSprite, setNewGameSprite] = useState(null);
    const [playersInRoom, setPlayersInRoom] = useState([]);
    const [showMainGame, setShowMainGame] = useState(false);

    useEffect(() => {
        playerSocket.on('newGameSprite', (newSpriteObject) => {
          setNewGameSprite(newSpriteObject?.playerSprites[0]);
          setPlayersInRoom(newSpriteObject?.players);
        });
      }, [playerSocket])

    
      useEffect(() => {
        if(newGameSprite !== null){
            setShowMainGame(true);
        }
        console.log('show main agme', showMainGame);
      }, [newGameSprite])

    const handleJoinRoom = () => {
        playerSocket.emit('registerPlayer', playerName)
        playerSocket.emit('joinRoom', roomId);
      };

    const handleStartGame = () => {
        handleJoinRoom();
        setShowOverlay(false);
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
          <button
            onClick={handleStartGame}     
            //{handleStartGame}
            disabled={!playerName&&!roomId}
          >
            Start Game
          </button>
            </div>
          )}
          {
            showMainGame && <MainGame newGameSprite={newGameSprite} playersInRoom={playersInRoom} playerName={playerName} roomId={roomId}/>
          }
          </div>
    )
}

export default StartPage;