/* eslint-disable import/named */
import React, { useState } from 'react';
import Colours from './components/Colours';
import Grid from './components/Grid';
import './App.css';
import 'ws';

const cell = {
  colour: '#000000',
};

const App = () => {
  const host = window.location.origin.replace(/^http/, 'ws');
  const client = new WebSocket(host);

  const [grid, setGrid] = useState(new Array(64).fill().map(() => cell));
  const [currentColour, setCurrentColour] = useState(
    `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`,
  );
  const [boxes, setBoxes] = useState(['']);
  const [selectedBox, setSelectedBox] = useState(null);

  client.onopen = () => {
    // eslint-disable-next-line no-console
    console.log('WebSocket Client Connected');
    const msg = {
      type: 'client connect',
    };
    client.send(JSON.stringify(msg));
  };

  client.onmessage = (message) => {
    const data = JSON.parse(message.data);

    switch (data.type) {
      case 'box connect':
        setBoxes(boxes.push(data.name));
        break;

      case 'boxes':
        setBoxes(data.names.split(','));
        break;

      case 'box disconnect':
        setBoxes(boxes.filter((box) => box !== data.text));
        break;

      default:
        break;
    }
  };

  const submitPattern = (event) => {
    event.preventDefault();
    if (selectedBox !== null) {
      const msg = {
        type: 'pattern',
        pattern: grid.map((i) => i.colour).join(','),
      };
      client.send(JSON.stringify(msg));
    }
  };

  const clearGrid = () => {
    setGrid(new Array(64).fill().map(() => cell));
  };

  return (
    <div className="App">
      <div className="container">
        <div className="center">
          <h1>Draw Something!</h1>
        </div>
        <div className="center">
          <select value={selectedBox} onChange={setSelectedBox}>
            {boxes.map((box) => <option key={box} value={box}>{box}</option>)}
          </select>
        </div>
        <Colours currentColour={currentColour} setCurrentColour={setCurrentColour} />
        <Grid cells={grid} setCells={setGrid} currentColour={currentColour} />
        <button type="button" style={{ margin: '10px' }} onClick={submitPattern}>Upload</button>
        <button type="button" style={{ margin: '10px' }} onClick={clearGrid}>Clear</button>
      </div>
    </div>
  );
};

export default App;