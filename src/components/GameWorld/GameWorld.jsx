/* eslint-disable react/prop-types */
import React from 'react';

const GameWorld = ({children, id}) => {
  return(
    <div id={id} className="box" style={{marginTop: '55px'}}>
      {children}
    </div>
  );
};

export default GameWorld;