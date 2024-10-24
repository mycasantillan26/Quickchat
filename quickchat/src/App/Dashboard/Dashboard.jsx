import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import app from '../../firebaseConfig'; 
import DashboardAppBar from '../Appbar/DashboardAppbar'; 
import Sidebar from '../Sidebar/Sidebar'; 
import './Dashboard.css'; 

const Dashboard = () => {
    const { userId } = useParams(); 
    const [userData, setUserData] = useState(null); 
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const fetchUserData = async () => {
            const db = getFirestore(app);
            const userDoc = await getDoc(doc(db, 'Users', userId));
            if (userDoc.exists()) {
                setUserData(userDoc.data()); 
            } else {
                console.error("No such user found!");
            }
            setLoading(false); 
        };

        fetchUserData(); 
    }, [userId]);

    return (
        <div className="notifications-page">
            <DashboardAppBar userData={userData} /> 
            <div className="notifications-layout">
                <Sidebar userId={userId} highlightedItem="Notifications" /> 
                <div className="notifications-container">
                    {loading ? (
                        <p>Loading user data...</p> 
                    ) : (
                        <div className="notifications-container2">
                            <h2>Dashboard</h2>
                            <p>Welcome to dashboard</p> 
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
