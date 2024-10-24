import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import app from '../../firebaseConfig';
import DashboardAppBar from '../Appbar/DashboardAppbar';
import Sidebar from '../Sidebar/Sidebar';
import './Friends.css';

const Friends = () => {
    const { userId } = useParams();
    const [usersData, setUsersData] = useState([]); // State to store users data
    const [userName, setUserName] = useState(''); // State to store logged-in user's name
    const [currentUserIndex, setCurrentUserIndex] = useState(0); // Index of the current user to display
    const [likedUsers, setLikedUsers] = useState([]); // State to store liked users
    const [dislikedUsers, setDislikedUsers] = useState([]); // State to store disliked users
    const [loading, setLoading] = useState(true); // State to manage loading status
    const [error, setError] = useState(null); // State to manage error messages
    const [message, setMessage] = useState(''); // State to manage like message

    useEffect(() => {
        const fetchUsersData = async () => {
            try {
                const db = getFirestore(app);

                // Fetching the logged-in user's data
                const userDoc = await getDoc(doc(db, 'Users', userId));
                if (userDoc.exists()) {
                    setUserName(userDoc.data().firstname); // Assuming the user's name is stored under 'firstname'
                }

                // Fetching liked users
                const likedUsersCollection = await getDocs(collection(db, 'Likes'));
                const likedUsersList = likedUsersCollection.docs
                    .filter(doc => doc.data().likedBy === userId)
                    .map(doc => doc.data().likedUser);

                setLikedUsers(likedUsersList); // Update likedUsers state

                // Fetching all users
                const usersCollection = collection(db, 'Users');
                const userDocs = await getDocs(usersCollection);
                const usersList = userDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                console.log('Fetched Users:', usersList); // Log fetched user data
                
                // Filter out the logged-in user and disliked/liked users
                const filteredUsersList = usersList.filter(user => 
                    user.id !== userId && 
                    !dislikedUsers.includes(user.id) && 
                    !likedUsersList.includes(user.id) // Ensure liked users are excluded
                );
                
                setUsersData(filteredUsersList);
                if (filteredUsersList.length > 0) {
                    setCurrentUserIndex(0); // Reset index to 0 if there are filtered users
                }
            } catch (err) {
                console.error('Error fetching users data:', err); // Log error to the console
                setError('Failed to fetch user data.'); // Set error message
            } finally {
                setLoading(false); // Always set loading to false after fetching
            }
        };

        fetchUsersData();
    }, [userId, dislikedUsers]); // Removed likedUsers from dependencies as it's fetched on mount

    const handleLike = async (user) => {
        const db = getFirestore(app);
        
        // Save liked user info to Firestore
        await setDoc(doc(db, 'Likes', `${userId}-${user.id}`), {
            likedBy: userId,
            likedUser: user.id,
            userNameWhoLiked: userName,
            likedUserName: user.firstname, // Save the username of the liked user
            timestamp: new Date() // Store the timestamp for future reference if needed
        });

        setMessage(`You liked ${user.firstname}`);
        setLikedUsers(prevLikedUsers => [...prevLikedUsers, user.id]); // Update liked users

        // Re-fetch users to update the list
        moveToNextUser();
    };

    const handleDislike = () => {
        setDislikedUsers(prevDislikedUsers => [...prevDislikedUsers, usersData[currentUserIndex].id]); // Update disliked users
        moveToNextUser();
    };

    const moveToNextUser = () => {
        // Move to the next user or loop back to the beginning
        const nextIndex = currentUserIndex + 1;
        if (nextIndex < usersData.length) {
            setCurrentUserIndex(nextIndex);
        } else {
            setCurrentUserIndex(0); // Reset to the start if at the end
        }
    };

    return (
        <div className="notifications-page">
            <DashboardAppBar userName={userName} /> {/* Pass userName to DashboardAppBar */}
            <div className="notifications-layout">
                <Sidebar userId={userId} highlightedItem="Friends" />
                <div className="notifications-container">
                    {loading ? (
                        <p>Loading user data...</p> // Display loading message
                    ) : error ? (
                        <p>{error}</p> // Display error message if exists
                    ) : (
                        <div className="users-container">
                            <h2>Friend Suggestions</h2>
                            {usersData.length > 0 && (
                                <div className="user-card" style={{ height: '91%', width: '51%' }}>
                                    {usersData[currentUserIndex].profileImage && (
                                        <img 
                                            src={usersData[currentUserIndex].profileImage} 
                                            alt={`${usersData[currentUserIndex].firstname}'s profile`} 
                                            className="profile-image" 
                                        />
                                    )}
                                    <div className="user-info">
                                        <h3>{usersData[currentUserIndex].firstname}</h3>
                                        {usersData[currentUserIndex].birthdate && (
                                            <p>Age: {calculateAge(usersData[currentUserIndex].birthdate)}</p>
                                        )}
                                    </div>
                                    <div className="user-actions">
                                        <button onClick={() => handleLike(usersData[currentUserIndex])}>❤️</button>
                                        <button onClick={handleDislike}>❌</button>
                                    </div>
                                </div>
                            )}
                            {message && <p>{message}</p>} {/* Display like message */}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Function to calculate age based on birthdate
const calculateAge = (birthdate) => {
    const birthDate = new Date(birthdate);
    const ageDiff = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDiff); // milliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970); // subtract 1970 because epoch starts then
};

export default Friends;
