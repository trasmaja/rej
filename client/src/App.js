
import './App.css';
import { io } from "socket.io-client";
import React from 'react';
import { Routes, Route } from "react-router-dom";
import Home from "./views/Home/Home";
import Admin from "./views/Admin/Admin";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { socket: io() };
  }

  render() {
    return (
      <div className="App">
        <Routes>
          <Route path="/" element={<Home socket={this.state.socket} />} />
          <Route path="/admin" element={<Admin socket={this.state.socket} />} />
        </Routes>
      </div>
    );
  }
}

export default App;
