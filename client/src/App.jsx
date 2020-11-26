/* eslint-disable import/named */
import React from 'react';
import Colours from './components/Colours';
import Grid from './components/Grid';
import './App.css';
import 'ws';

const cell = {
  colour: '#000000',
};

class App extends React.Component {
  constructor() {
    super();
    const host = window.location.origin.replace(/^http/, 'ws');
    this.client = new WebSocket(host);

    this.state = {
      grid: new Array(64).fill().map(() => cell),
      colour: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`,
      boxes: [],
      selectedBox: undefined,
    };

    this.setSelectedBox = (event) => {
      this.setState((prevState) => ({ ...prevState, selectedBox: event.target.value }));
    };

    this.setCurrentColour = (colour) => {
      this.setState((prevState) => ({ ...prevState, colour }));
    };

    this.setGrid = (cells) => {
      this.setState((prevState) => ({ ...prevState, grid: cells }));
    };

    this.clearGrid = () => {
      this.setState((prevState) => ({ ...prevState, grid: new Array(64).fill().map(() => cell) }));
    };

    this.submitPattern = (event) => {
      const { grid, selectedBox } = this.state;
      event.preventDefault();
      if (selectedBox !== null) {
        const msg = {
          type: 'pattern',
          name: selectedBox,
          pattern: grid.map((i) => i.colour).join(','),
        };
        this.client.send(JSON.stringify(msg));
      }
    };
  }

  componentDidMount() {
    this.client.onopen = () => {
    // eslint-disable-next-line no-console
      console.log('WebSocket Client Connected');
      const msg = {
        type: 'client connect',
      };
      this.client.send(JSON.stringify(msg));
    };

    this.client.onmessage = (message) => {
      const { boxes, selectedBox } = this.state;
      const data = JSON.parse(message.data);

      switch (data.type) {
        case 'box connect':
          this.setState((prevState) => ({
            ...prevState,
            boxes: [...prevState.boxes, data.name],
            selectedBox: prevState.selectedBox === undefined ? prevState.boxes[0] : undefined,
          }));
          break;

        case 'boxes':
          this.setState((prevState) => ({
            ...prevState,
            boxes: data.names.split(','),
            selectedBox: (selectedBox === undefined && boxes.length) > 0 ? boxes[0] : selectedBox,
          }));
          break;

        case 'box disconnect':
          this.setState((prevState) => ({
            ...prevState,
            boxes: boxes.filter((box) => box !== data.name),
            selectedBox: (selectedBox === data.name && boxes.length) > 0 ? boxes[0] : undefined,
          }));
          break;

        default:
          break;
      }
    };
  }

  render() {
    const {
      grid, colour, boxes, selectedBox,
    } = this.state;
    return (
      <div className="App">
        <div className="container">
          <div className="center">
            <h1>Draw Something!</h1>
          </div>
          <div className="center">
            <select value={selectedBox} onChange={this.setSelectedBox}>
              {boxes.map((box) => <option key={box} value={box}>{box}</option>)}
            </select>
          </div>
          <Colours currentColour={colour} setCurrentColour={this.setCurrentColour} />
          <Grid
            cells={grid}
            setCells={this.setGrid}
            currentColour={colour}
          />
          <button
            type="button"
            style={{ margin: '10px' }}
            onClick={this.submitPattern}
            disabled={selectedBox === undefined}
          >
            Upload
          </button>
          <button type="button" style={{ margin: '10px' }} onClick={this.clearGrid}>Clear</button>
        </div>
      </div>
    );
  }
}

export default App;
