import React, { useEffect, useMemo, useState } from "react";
import { playerSocket } from "../../service/ConnectSocket";
import DashboardMain from "./DashboardMain";

const DashBoard = () =>  {
    const [showOverlay, setShowOverlay] = useState(true);
    const [roomId, setRoomId] = useState(null);
    const [newGameSprite, setNewGameSprite] = useState(null);
    const [playersInRoom, setPlayersInRoom] = useState([]);
    const [showMainGame, setShowMainGame] = useState(false);

    const PLAYER_NAME = "admin";

    useEffect(() => {
        playerSocket.on('newGameSprite', (newSpriteObject) => {
          setPlayersInRoom(newSpriteObject?.players);
        });

        playerSocket.on('playergroundObjects', (playGroundObjects) => {
          console.log("the playerObjects", playGroundObjects);
        })
      }, [playerSocket])

      const getPlayground = (roomId) => {
        playerSocket.emit('getPlayground', roomId);
      }

      // const playGroundObjects = useMemo(() => {
      //   if(roomId){
      //       getPlayground(roomId);
      //   }
      // },[roomId]);

    
      useEffect(() => {
        if(newGameSprite !== null){
          setTimeout(() => {
            setShowOverlay(false);
            setShowMainGame(true);
          }, 5000)

        }
      }, [newGameSprite])

    const handleJoinRoom = () => {
        playerSocket.emit('registerAdmin', roomId);
        playerSocket.emit('joinRoom', roomId, true);
      };

    const handleStartGame = () => {
        setShowMainGame(true);
        setShowOverlay(false);
        handleJoinRoom();
        // setShowLoading(true);
      };

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
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Game room"
          />
          <button
            onClick={() => handleStartGame()}     
            //{handleStartGame}
            disabled={(!roomId)}
          >
            Load Playground
          </button>
            </div>
          )}
          {
            showMainGame && <DashboardMain roomName={roomId}/>
          }
          </div>
    )
}

export default DashBoard;