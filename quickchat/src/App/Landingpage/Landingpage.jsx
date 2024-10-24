import React from 'react';
import './Landingpage.css'; 
import logo from '../images/nobg.png'; 
import communicate from '../images/communicate2.jpg'; 
import AppBar from '../Appbar/Appbar';

const Landingpage = () => {
    return (
        <div className="container">
            <AppBar />
            <div className="content">
                <div className="text-section">
                    <h1 className="app-title">Connect & Make Friends Online</h1>
                    <p className="app-description">Connect with new people online and make friends easily. Start conversations and build lasting connections.</p>
                </div>
                <div className="image-section">
                    <img src={communicate} alt="Communicate" className="communicate" />
                </div>
            </div>
        </div>
    );
};

export default Landingpage;
