import React, { useState } from 'react';
import './HeartButton.css'; // Import your styles for the heart button

const HeartButton = ({ onClick }) => { // Accept onClick as a prop
    const [isLiked, setIsLiked] = useState(false); // State to track if the heart is liked

    const handleClick = () => {
        setIsLiked(!isLiked); // Toggle the liked state
        onClick(); // Call the onClick prop to handle liking
    };

    return (
        <i 
            className={`fa fa-heart heart ${isLiked ? 'red' : ''}`} 
            onClick={handleClick} 
            aria-hidden="true"
        ></i>
    );
};

export default HeartButton;
