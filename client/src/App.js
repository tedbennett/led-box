import React, { Component } from 'react';
import './App.css';
import "ws";

class App extends Component {
  // Initialize state
  constructor() {
    super()
    this.state = { value: '', messages: [] }

    this.client = new WebSocket('ws://127.0.0.1:5000');
  
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  componentWillMount() {
    this.client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    this.client.onmessage = (message) => {
      const data = JSON.parse(message.data)
      console.log("message received: ", data)
      this.setState( () => ({value: this.state.value, messages: this.state.messages.concat(data.text)}));
    };
  }

  handleChange = (event) => {
    this.setState( () => ({value: event.target.value, messages: this.state.messages}));
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const msg = {
      type: "message",
      text: this.state.value,
    };
    this.client.send(JSON.stringify(msg));
  }

  render() {
    const { messages } = this.state;

    return (
      <div className="App">
        <h2>Send:</h2>
        <form onSubmit={this.handleSubmit}>
          <label>
            Send message:
            <input value={this.state.value} type="text" name="name" onChange={this.handleChange}/>
          </label>
          <input type="submit" value="Submit" />
        </form>
        <h2>Messages:</h2>
        <div>
        {messages.map((message) => {     
           return <p>{message}</p>
        })}
        </div>
      </div>
    );
  }
}

export default App;
