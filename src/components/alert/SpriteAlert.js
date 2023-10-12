export const SpriteRequestAlert = async (spriteName, playerName, gameSprites, handleRemoveShape) => {
  const result = await window.confirm(`Do you want to exchange you piece  ${spriteName} with player - ${playerName}`);

  if(result){
    console.log('okay');
    handleRemoveShape(spriteName, playerName, gameSprites);
  } else{
    console.log('declned');
  }
};

export const SpriteDenyAlert = (spriteName, playerName) => {
  const result = window.confirm(`Player - ${playerName} denied your request for piece - ${spriteName}.`);

  if(result){
    console.log('okay');
  } else{
    console.log('declned');
  }
};