
import './App.css';
// import { io } from "socket.io-client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import Home from './views/Home/Home';
import Admin from './views/Admin/Admin';


const theme = createTheme({
  palette: {
    primary: {
      light: '#2AA784',
      main: '#2AA784',
      dark: '#FFF',
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
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home socket={{}} />} />
          <Route path="admin" element={<Admin socket={{}} />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

