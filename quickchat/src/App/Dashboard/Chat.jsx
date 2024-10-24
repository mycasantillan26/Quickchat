import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import app from '../../firebaseConfig'; 
import DashboardAppBar from '../Appbar/DashboardAppbar'; 
import Sidebar from '../Sidebar/Sidebar'; 
import './Chat.css'; 
import defaultProfileImage from '../images/user.png';

const Chats = () => {
    const { userId } = useParams(); 
    const [chatsData, setChatsData] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [userData, setUserData] = useState(null); 
    const navigate = useNavigate(); // Initialize navigate

    const calculateAge = (birthDateString) => {
        if (!birthDateString) return 'N/A'; // Return 'N/A' if birthdate is null
        const today = new Date();
        const birthDate = new Date(birthDateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    useEffect(() => {
        const fetchChatsData = async () => {
            const db = getFirestore(app);
            const storage = getStorage(app);

            try {
                const likedByQuery = query(collection(db, 'Likes'), where('likedUser', '==', userId));
                const likedBySnapshot = await getDocs(likedByQuery);
                
                const chatsPromises = likedBySnapshot.docs.map(async (likeDoc) => {
                    const likeData = likeDoc.data();
                    const likedByUserId = likeData.likedBy;

                    const mutualLikeQuery = query(
                        collection(db, 'Likes'),
                        where('likedUser', '==', likedByUserId),
                        where('likedBy', '==', userId)
                    );
                    const mutualLikeSnapshot = await getDocs(mutualLikeQuery);

                    if (!mutualLikeSnapshot.empty) {
                        const likedUserDoc = await getDoc(doc(db, 'Users', likedByUserId));
                        const likedUserData = likedUserDoc.data();

                        let profileImageUrl;
                        try {
                            const profileImageRef = ref(storage, `profile/${likedByUserId}`);
                            profileImageUrl = await getDownloadURL(profileImageRef);
                        } catch (error) {
                            if (error.code === 'storage/object-not-found') {
                                profileImageUrl = defaultProfileImage;
                            } else {
                                throw error;
                            }
                        }

                        const age = calculateAge(likedUserData.birthdate);
                        return {
                            id: likedByUserId,
                            firstname: likedUserData.firstname,
                            lastname: likedUserData.lastname,
                            age,
                            profileImageUrl,
                        };
                    }
                    return null;
                });

                const resolvedChats = await Promise.all(chatsPromises);
                setChatsData(resolvedChats.filter(chat => chat !== null));
            } catch (error) {
                console.error('Error fetching chats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchChatsData(); 
    }, [userId]);

    const handleChatClick = (chat) => {
        navigate(`/chats/message/${chat.id}/${chat.firstname} ${chat.lastname}`);
    };

    return (
        <div className="chats-page">
            <DashboardAppBar userData={userData} />
            <div className="chats-layout">
                <Sidebar userId={userId} highlightedItem="Chats" />
                <div className="chats-container">
                    {loading ? (
                        <p>Loading chats...</p>
                    ) : (
                        <div className="chats-list">
                            <h2>Chats</h2>
                            {chatsData.length > 0 ? (
                                chatsData.map((chat) => (
                                    <div key={chat.id} className="chat-item" onClick={() => handleChatClick(chat)}>
                                        <img
                                            src={chat.profileImageUrl}
                                            alt={`${chat.firstname} ${chat.lastname}'s profile`}
                                            className="chat-profile-image"
                                        />
                                        <div className="chat-details">
                                            <p className="chat-name">
                                                {chat.firstname} {chat.lastname}, {chat.age}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No mutual likes found.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chats;
