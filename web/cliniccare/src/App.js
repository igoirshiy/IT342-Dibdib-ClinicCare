import React, { useState } from 'react';
import './App.css';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  // view can be 'login', 'register', or 'dashboard'
  const [view, setView] = useState('login');
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    console.log("Logged in user:", userData);
    setUser(userData);
    setView('dashboard');
  };
  const handleRegister = (userData) => {
    console.log("Registered user:", userData);
    alert('Registration Successful!');
    setUser(userData);
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
        <Dashboard
          onLogout={handleLogout}
          userRole={user?.role || 'PATIENT'}
          user={user}
        />
      )}
    </div>
  );
}

export default App;
