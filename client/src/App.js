import React, { Component } from 'react';
import './App.css';
import "ws";

class App extends Component {
  // Initialize state
  constructor() {
    super()
    this.state = { value: '', messages: [] }
    var host = window.location.origin.replace(/^http/, 'ws')
    this.client = new WebSocket(host);
  
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  componentDidMount() {
    this.client.onopen = () => {
      console.log('WebSocket Client Connected');
      const msg = {
        type: "client connection",
      };
      this.client.send(JSON.stringify(msg))
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
      type: "pattern",
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
