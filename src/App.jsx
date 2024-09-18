import { useState, useEffect } from 'react';
import './App.css';
import { Buffer } from 'buffer';
import { Navbar } from './Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { auth } from './firebaseConfig';
import Login from './Login';
import Signup from './Signup';
import SeedPhrasePage from './SeedPhrasePage';
import WalletDashboard from './WalletDashboard'; // Import the WalletDashboard

window.Buffer = Buffer;

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <>
        {user && <Navbar user={user} />}
        <Routes>
          <Route path="/" element={user ? <WalletDashboard user={user} /> : <Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/seed-phrase" element={<SeedPhrasePage user={user} />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;
