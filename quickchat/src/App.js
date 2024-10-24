import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import Landingpage from './App/Landingpage/Landingpage'; 
import Login from './App/Authentication/Login'; 
import Register from './App/Authentication/Register'; 
import Dashboard from './App/Dashboard/Dashboard'; 
import Profile from './App/profile/Profile'; 
import ResetPassword from'./App/Authentication/Resetpassword';
import Friends from './App/Dashboard/Friends'; 
import Chats from './App/Dashboard/Chat';
import Notifications from './App/Dashboard/Notifications';
import Settings from './App/Dashboard/Settings';
import Message from './App/Dashboard/Message';


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landingpage />} />
                <Route path="/signin" element={<Login />} />
                <Route path="/signup" element={<Register />} />
                <Route path="/dashboard/:userId" element={<Dashboard />} />
                <Route path="/profile/:userId" element={<Profile />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/friends/:userId" element={<Friends />} /> 
                <Route path="/chats/:userId" element={<Chats />} /> 
                <Route path="/notifications/:userId" element={<Notifications />} /> 
                <Route path="/settings/:userId" element={<Settings />} /> 
                <Route path="/chats/message/:userId/:userName" element={<Message />} />
               
            </Routes>
        </Router>
    );
};

export default App;
