
import './App.css';
// import { io } from "socket.io-client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from './views/Home/Home';
import Admin from './views/Admin/Admin';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home socket={{}}/>} />
      <Route path="admin" element={<Admin socket={{}}/>} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;

