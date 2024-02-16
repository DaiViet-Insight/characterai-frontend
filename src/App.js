import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './assets/css/reset.css';
import { AuthenticationPage, CharacterSelection, DaiVietChat, PaymentPage } from './views';
import './App.css';
import { UserProvider } from "./contexts/UserContext";

function App() {
  return (
    <div className="App">
      <Router>
        <UserProvider>
          <Routes>
            <Route path="/" element={<CharacterSelection />} />
            <Route path="/login" element={<AuthenticationPage />} />
            <Route path="/chat/:id" element={<DaiVietChat />} />
            <Route path="/payment/:id" element={<PaymentPage />} />
          </Routes>
        </UserProvider>
      </Router>
    </div>
  );
}

export default App;
