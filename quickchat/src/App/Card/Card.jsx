// Card.jsx
import React from 'react';
import './Card.css'; // Ensure you have CSS to style the card

const Card = ({ firstName, age, profileImage }) => {
    return (
        <div className="user-card">
            {profileImage && <img src={profileImage} alt={`${firstName}'s profile`} className="profile-image" />}
            <div className="user-info">
                <h3>{firstName}</h3>
                {age && <p>Age: {age}</p>} {/* Only display age if it exists */}
            </div>
        </div>
    );
};

export default Card;
