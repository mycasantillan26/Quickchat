// src/components/AppBar.js
import React from 'react';
import { Link } from 'react-router-dom'; 
import logo from '../images/nobg.png'; 
import './Appbar.css'; 



const AppBar = () => {
    return (
        <div className="appbar">
            <div className="logo-section">
                <img src={logo} alt="QuickChat Logo" className="logo" />
                <span className="app-name">uickChat</span>
            </div>
            <div className="button-section">
                <Link to="/signin" className="button">SIGN IN</Link>
                <Link to="/signup" className="button">SIGN UP</Link>
            </div>
        </div>
    );
};

export default AppBar;
