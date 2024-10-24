import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import app from '../../firebaseConfig'; 
import DashboardAppBar from '../Appbar/DashboardAppbar'; 
import Sidebar from '../Sidebar/Sidebar'; 
import './Notifications.css';
import defaultProfileImage from '../images/user.png';

const Notifications = () => {
    const { userId } = useParams(); 
    const [likesData, setLikesData] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [userData, setUserData] = useState(null); 

    useEffect(() => {
        const fetchNotifications = async () => {
            const db = getFirestore(app);
            const storage = getStorage(app);

            try {
                const likesQuery = query(collection(db, 'Likes'), where('likedUser', '==', userId));
                const likesSnapshot = await getDocs(likesQuery);

                const likesPromises = likesSnapshot.docs.map(async (likeDoc) => {
                    const likeData = likeDoc.data();
                    const likedByUserId = likeData.likedBy;

                    const likedUserDoc = await getDoc(doc(db, 'Users', likedByUserId));
                    const likedUserData = likedUserDoc.data();

                    let profileImageUrl;
                    try {
                        // Try to fetch the user's profile image
                        const profileImageRef = ref(storage, `profile/${likedByUserId}`);
                        profileImageUrl = await getDownloadURL(profileImageRef);
                    } catch (error) {
                        // If profile image not found, use default profile image
                        if (error.code === 'storage/object-not-found') {
                            profileImageUrl = defaultProfileImage; // Use the imported default image
                        } else {
                            throw error; // Rethrow other errors
                        }
                    }

                    return {
                        id: likedByUserId,
                        firstname: likedUserData.firstname,
                        profileImageUrl,
                    };
                });

                const resolvedLikes = await Promise.all(likesPromises);
                setLikesData(resolvedLikes);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            } finally {
                setLoading(false); 
            }
        };

        fetchNotifications();
    }, [userId]);

    return (
        <div className="notifications-page">
            <DashboardAppBar userData={userData} /> 
            <div className="notifications-layout">
                <Sidebar userId={userId} highlightedItem="Notifications" />
                <div className="notifications-container">
                    {loading ? (
                        <p>Loading notifications...</p>
                    ) : (
                        <div className="notifications-container2">
                            <h2>Notifications</h2>
                            {likesData.length > 0 ? (
                                likesData.map((like) => (
                                    <div key={like.id} className="notification-item">
                                        <img
                                            src={like.profileImageUrl}
                                            alt={`${like.firstname}'s profile`}
                                            className="profile-image"
                                        />
                                        <p className="notification-text">
                                            {like.firstname} liked you
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p>No new notifications.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notifications;
