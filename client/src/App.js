
import './App.css';
import { io } from "socket.io-client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import React, { useEffect, useState } from "react";
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import Home from './views/Home/Home';
import Admin from './views/Admin/Admin';


const theme = createTheme({
  palette: {
    primary: {
      light: '#bfe5da',
      main: '#2AA784',
      dark: '#1c8668',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },
});



function App() {
  const socket = io();
  console.log("howdy")
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home socket={socket} />} />
          <Route path="admin" element={<Admin socket={socket} />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

