/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { ProgressBar } from  'react-loader-spinner'

import { playerSocket } from "../../service/ConnectSocket";

import Tabs from '../../TabLocal';

const DashboardMain = ({roomName}) => {
    const [isWaiting, setWaiting] = useState(false);
    const [isMainPlayground, setMainPlayground] = useState(true);

    useEffect(() => {
        playerSocket.on('newGameSprite', (newSpriteObject) => {
            console.log(newSpriteObject?.players);
          });
  
          playerSocket.on('playergroundObjects', (playGroundObjects) => {
            console.log("the playerObjects", playGroundObjects);
          })
        }, [playerSocket]);

    return (
        <div>
    {isWaiting && !isMainPlayground && 
            <div style={{alignItems: "center"}}>
            <ProgressBar
                height="80"
                width="100px"
                ariaLabel="progress-bar-loading"
                wrapperStyle={{}}
                wrapperClass="progress-bar-wrapper"
                borderColor = '#F4442E'
                barColor = '#51E5FF'
            />
          <p>Loading Playground...</p>
              </div>
          }
          <h4>Room name: {roomName}</h4>
           {
            isMainPlayground && (
                <Tabs showSelect={false}/>
            )
           }
        </div>
    )
}

export default DashboardMain;