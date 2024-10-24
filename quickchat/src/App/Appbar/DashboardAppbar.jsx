import React from 'react';
import { useNavigate, useParams } from 'react-router-dom'; 
import logo from '../images/nobg.png';
import userImage from '../images/user.png'; 
import './DashboardAppbar.css';

const DashboardAppBar = ({ userData }) => {
    const navigate = useNavigate(); 
    const { userId } = useParams(); 
    
    const handleProfileClick = () => {
        console.log('User ID:', userId); 
        if (userId) {
            console.log('Profile section clicked');
            navigate(`/profile/${userId}`);
        } else {
            console.warn('User ID is missing!');
            alert('Profile information is not available.');
        }
    };

    return (
        <div className="appbar">
            <div className="logo-section2">
                <img src={logo} alt="QuickChat Logo" className="logo" />
                <span className="app-name">uickChat</span>
            </div>

            {/* Search text field */}
            <div className="search-section">
                <input
                    type="text"
                    placeholder="Search..."
                    className="search-input"
                />
            </div>

            <div className="welcome-section">
                {userData ? (
                    <h1>Hello, {userData.firstname}!</h1>
                ) : (
                    <p>Loading...</p>  // Simple loading message
                )}
            </div>
            
            <div className="profile-section">
                <div className="profile-circle" onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
                    <img src={userImage} alt="User" className="user-image" />
                </div>
            </div>
        </div>
    );
};

export default DashboardAppBar;
