import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation for route matching
import './Sidebar.css';

const Sidebar = ({ userId }) => {
    const navigate = useNavigate();
    const location = useLocation(); // Get the current location

    const handleFriendSuggestionsClick = () => {
        navigate(`/friends/${userId}`);
    };

    return (
        <div className="sidebar">
            <ul className="menu-list">
            <li className={`menu-item ${location.pathname.includes('/dashboard') ? 'active' : ''}`} onClick={() => navigate(`/dashboard/${userId}`)}>
                    <span className="menu-icon">👥</span>
                   Dashboard
                </li>
            <li className={`menu-item ${location.pathname.includes('/friends') ? 'active' : ''}`} onClick={() => navigate(`/friends/${userId}`)}>
                    <span className="menu-icon">👥</span>
                   Friend Suggestion
                </li>
                <li className={`menu-item ${location.pathname.includes('/chats') ? 'active' : ''}`} onClick={() => navigate(`/chats/${userId}`)}>
                    <span className="menu-icon">💬</span>
                    Chat
                </li>
                <li className={`menu-item ${location.pathname.includes('/notifications') ? 'active' : ''}`} onClick={() => navigate(`/notifications/${userId}`)}>
                    <span className="menu-icon">🔔</span>
                    Notifications
                </li>
                <li className={`menu-item ${location.pathname.includes('/settings') ? 'active' : ''}`} onClick={() => navigate(`/settings/${userId}`)}>
                    <span className="menu-icon">⚙️</span>
                    Settings
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
