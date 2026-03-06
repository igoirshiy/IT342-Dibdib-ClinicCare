import React, { useState } from 'react';
import './App.css';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  // view can be 'login', 'register', or 'dashboard'
  const [view, setView] = useState('login');

  const handleLogin = () => setView('dashboard');
  const handleRegister = () => {
    alert('Registration Successful!');
    setView('dashboard');
  };
  const handleLogout = () => setView('login');

  return (
    <div className="App">
      {view === 'login' && (
        <Login
          onSwitchToRegister={() => setView('register')}
          onLogin={handleLogin}
        />
      )}
      {view === 'register' && (
        <Register
          onSwitchToLogin={() => setView('login')}
          onRegisterSuccess={handleRegister}
        />
      )}
      {view === 'dashboard' && (
        <Dashboard onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
