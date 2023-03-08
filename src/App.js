import './App.css'
import Homepage from "./components/homepage/homepage"
import Login from "./components/login/login"
import Register from "./components/register/register"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [user, setLoginUser] = useState({});

  const logout = async () => {
    try {
      const response = await axios.post('http://localhost:9002/logout');
      if (response.status === 200) {
        localStorage.removeItem('token');
        setLoginUser({});
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:9002/reminderUser", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLoginUser(response.data.user);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, []); 
  
  
  
  
  

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={user && user._id ? <Homepage setLoginUser={setLoginUser} user={user} logout={logout} /> : <Login setLoginUser={setLoginUser} />} />
          <Route path="/login" element={<Login setLoginUser={setLoginUser} />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
