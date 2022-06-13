
import './App.css';
import { io } from "socket.io-client";
import React from 'react';
import { Routes, Route, Link } from "react-router-dom";
import Home from "./views/Home/Home";
import Admin from "./views/Admin/Admin";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = { socket: io() , turn: undefined, year: undefined };
    
  }

  // när app har laddats i hemsida
  componentDidMount() {
    this.state.socket.on("updateGame", (obj) => {
      console.log("hello")
      console.log(obj)
      this.setState({turn: obj.turn, year: obj.year })
    });
  }
  componentWillUnmount() {
    this.state.socket.off('updateGame');
   }

  render() {
    return (
      <div className="App">
        <Routes>
          <Route path="/" element={<Home socket={this.state.socket} turn={this.state.turn} year={this.state.year} />} />
          <Route path="/admin" element={<Admin socket={this.state.socket} turn={this.state.turn} year={this.state.year} />} />
        </Routes>
      </div>);
  }
}

export default App;
