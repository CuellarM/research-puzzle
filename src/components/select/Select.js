import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function SelectLabels({players, shapeNames}) {
  const [playerId, setPlayerId] = React.useState('');
  const [gamePlayers, setGamePlayers] = React.useState(players)
  console.log("The players isn the room", players);

  const handleChange = (event) => {
    setPlayerId(event.target.value);
  };

  React.useEffect(() => {
    setGamePlayers(players);
  }, [players])

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-helper-label">Player</InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={playerId}
          label="Age"
          onChange={handleChange}
        >
         <MenuItem value="">
            <em>None</em>
        </MenuItem>
            {gamePlayers?.map((index,key) => {
              return(
                <MenuItem key={key} value={index}>{index}</MenuItem>
              )   
            })}
        </Select>
        <FormHelperText>Select player to Request piece</FormHelperText>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <Select
          value={playerId}
          onChange={handleChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>A1</MenuItem>
          <MenuItem value={20}>A2</MenuItem>
          <MenuItem value={30}>A3</MenuItem>
        </Select>
        <FormHelperText>Without label</FormHelperText>
      </FormControl>
    </div>
  );
}