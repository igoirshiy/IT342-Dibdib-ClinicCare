import React, { useState } from 'react';
import './App.css';
import Register from './components/Register/Register';
import Login from './components/Login/Login';

function App() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="App">
      {isLogin ? (
        <Login onSwitchToRegister={() => setIsLogin(false)} />
      ) : (
        <Register onSwitchToLogin={() => setIsLogin(true)} />
      )}
    </div>
  );
}

export default App;
