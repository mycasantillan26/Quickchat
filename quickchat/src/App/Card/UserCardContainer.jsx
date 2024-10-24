// UserCardContainer.js
import React, { useState, useEffect } from 'react';
import Card from './Card'; // Adjust the import path as necessary

const UserCardContainer = () => {
  const [viewedUsers, setViewedUsers] = useState({}); // State to track viewed users
  const [currentUserId, setCurrentUserId] = useState('currentUserId'); // Replace with actual user ID
  const [userIds, setUserIds] = useState(['userId1', 'userId2', 'userId3']); // List of user IDs to display
  const [currentUserIndex, setCurrentUserIndex] = useState(0); // Track the current user index

  useEffect(() => {
    // Filter out expired users from userIds
    const filteredUserIds = userIds.filter((userId) => {
      const expirationTime = viewedUsers[userId];
      return !expirationTime || Date.now() < expirationTime; // Keep user if not viewed or still valid
    });
    setUserIds(filteredUserIds);
  }, [viewedUsers, userIds]);

  const handleNextUser = () => {
    setCurrentUserIndex((prevIndex) => (prevIndex + 1) % userIds.length); // Cycle through user IDs
  };

  return (
    <div>
      {userIds.length > 0 && (
        <Card
          userId={userIds[currentUserIndex]} // Pass the current user ID
          currentUserId={currentUserId} // Pass the current user ID
          onNextUser={handleNextUser} // Function to show the next user
          viewedUsers={viewedUsers} // Pass the viewed users state
          setViewedUsers={setViewedUsers} // Pass the setter function
        />
      )}
    </div>
  );
};

export default UserCardContainer;
