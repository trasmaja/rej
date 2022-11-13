
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
import IndustryView from './views/IndustryView/IndustryView';
import PolicyView from './views/PolicyView/PolicyView';
import ElcoView from './views/ElcoView/ElcoView';
import Voters from './views/Voters/Voters';




function App() {
  const socket = io();
  const sectors = [<IndustryView socket={socket} sectorName="Industrin" />, <PolicyView socket={socket} sectorName="Politiker" />, <ElcoView socket={socket} sectorName="Elbolag" />, <Voters socket={socket} sectorName="Väljare" />]
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home socket={socket} />} />
          <Route path="admin" element={<Admin socket={socket} />} />
          <Route path="industri" element={<main className="industryMain">{sectors[0]}</main>} />
          <Route path="politiker" element={<main className="policyMain">{sectors[1]}</main>} />
          <Route path="elbolag" element={<main className="elcoMain">{sectors[2]}</main>} />
          <Route path="valjare" element={<main className="voterMain">{sectors[3]}</main>} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;



/*

    switch (sectorIndex) {
        case 0:
            return <main className="industryMain">{sectors[0]}</main>
        case 1:
            return <main className="policyMain">{sectors[1]}</main>
        case 2:
            return <main className="elcoMain">{sectors[2]}</main>
        case 3:
            return <main className="voterMain">{sectors[3]}</main>
        default:
*/