import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './assets/css/reset.css';
import { CharacterSelection, DaiVietChat } from './views';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<CharacterSelection />} />
          <Route path="/chat/:id" element={<DaiVietChat />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
