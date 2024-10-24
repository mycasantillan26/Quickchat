import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams to access URL parameters
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import app from '../../firebaseConfig'; // Import your Firebase config
import DashboardAppBar from '../Appbar/DashboardAppbar'; // Import your AppBar component
import Sidebar from '../Sidebar/Sidebar'; // Import your Sidebar component
import './Settings.css'; // Import your specific styles for the Notifications component

const Settings = () => {
    const { userId } = useParams(); // Extract userId from the URL
    const [userData, setUserData] = useState(null); // State to store user data
    const [loading, setLoading] = useState(true); // State to manage loading status

    useEffect(() => {
        const fetchUserData = async () => {
            const db = getFirestore(app);
            const userDoc = await getDoc(doc(db, 'Users', userId));
            if (userDoc.exists()) {
                setUserData(userDoc.data()); // Set user data if it exists
            } else {
                console.error("No such user found!");
            }
            setLoading(false); // Set loading to false after fetching
        };

        fetchUserData(); // Fetch user data on component mount
    }, [userId]);

    return (
        <div className="notifications-page">
            <DashboardAppBar userData={userData} /> {/* Pass user data to AppBar */}
            <div className="notifications-layout">
                <Sidebar userId={userId} highlightedItem="Notifications" /> {/* Highlight Notifications in Sidebar */}
                <div className="notifications-container">
                    {loading ? (
                        <p>Loading user data...</p> // Loading state message
                    ) : (
                        <div className="notifications-container2">
                            <h2>Settings</h2>
                            <p>Settings</p> {/* Placeholder for notification messages */}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
