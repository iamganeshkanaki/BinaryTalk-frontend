import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import SqlEditor from './Components/SqlEditor';
function App() {
  return (
    <>
      <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sqleditor" element={<SqlEditor />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
