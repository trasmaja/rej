
import './App.css';
import { io } from "socket.io-client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import React from "react";

import Home from './views/Home/Home';
import Admin from './views/Admin/Admin';





function App() {
  const socket = io();
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home socket={socket} />} />
          <Route path="admin" element={<Admin socket={socket} />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;

