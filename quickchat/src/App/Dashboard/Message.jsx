import React, { useEffect, useState } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, collection, addDoc, onSnapshot, query, where, orderBy, updateDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage'; 
import app from '../../firebaseConfig';
import './Message.css';
import defaultProfileImage from '../images/user.png';
import sendButtonImage from '../images/send.jpg';
import arrowImage from '../images/arrow.png';
import paperClipImage from '../images/paper-clip.png';

const Message = () => {
    const { userId } = useParams();
    const [message, setMessage] = useState('');
    const [userData, setUserData] = useState({});
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [showTimestampFor, setShowTimestampFor] = useState(null); 
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');

    useEffect(() => {
        const auth = getAuth(app);
        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const db = getFirestore(app);
                const userDoc = await getDoc(doc(db, 'Users', user.uid));
                if (userDoc.exists()) {
                    setCurrentUser({ id: userDoc.id, ...userDoc.data() });
                }
            }
            setLoading(false);
        });

        return () => unsubscribeAuth();
    }, []);

    useEffect(() => {
        if (!currentUser) return;

        const fetchUserData = async () => {
            const db = getFirestore(app);
            try {
                const userDoc = await getDoc(doc(db, 'Users', userId));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    
                    if (data.profileImage) {
                        const storage = getStorage(app);
                        const profileImageRef = ref(storage, `profile/${userId}`);
                        const profileImageUrl = await getDownloadURL(profileImageRef);
                        data.profileImageUrl = profileImageUrl;
                    }

                    const birthDate = new Date(data.birthdate);
                    const age = new Date().getFullYear() - birthDate.getFullYear();
                    data.age = age;
                    setUserData(data);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();

        const db = getFirestore(app);
        const messagesQuery = query(
            collection(db, 'Messages'),
            where('sender', 'in', [currentUser.id, userId]),
            where('receiver', 'in', [currentUser.id, userId]),
            orderBy('timestamp', 'asc')
        );
        
        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
            const fetchedMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMessages(fetchedMessages);
        });

        return () => unsubscribe();
    }, [userId, currentUser]);

    const handleSendMessage = async () => {
        if (!currentUser || (!message.trim() && !file)) return;

        const db = getFirestore(app);
        try {
            let imageUrl = null;

            if (file) {
                const storage = getStorage(app);
                const fileRef = ref(storage, `sendFiles/${file.name}`);
                await uploadBytes(fileRef, file);
                imageUrl = await getDownloadURL(fileRef);
            }

            await addDoc(collection(db, 'Messages'), {
                sender: currentUser.id,
                receiver: userId,
                message,
                image: imageUrl,
                timestamp: new Date(),
                seen: false, 
            });
            setMessage('');
            setFile(null);
            setFileName('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileName(selectedFile.name);
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
        setFileName('');
    };

    const handleFileUploadClick = () => {
        document.getElementById('fileInput').click();
    };

    const formatTimestamp = (timestamp) => {
        const now = new Date();
        const messageDate = new Date(timestamp.seconds * 1000);
        const diffInHours = (now - messageDate) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        } else {
            return messageDate.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short', hour12: true });
        }
    };

    const handleClickMessage = async (msgId) => {
        setShowTimestampFor(showTimestampFor === msgId ? null : msgId);
        
        const messageToUpdate = messages.find(msg => msg.id === msgId);
        if (messageToUpdate && messageToUpdate.receiver === currentUser.id && !messageToUpdate.seen) {
            const db = getFirestore(app);
            const messageRef = doc(db, 'Messages', msgId);
            await updateDoc(messageRef, { seen: true });
        }
    };

    const handleFileClick = (msg) => {
        const fileType = msg.image.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'avi'].includes(fileType)) {
            window.open(msg.image, '_blank'); // Open image/video in a new tab
        } else {
            const link = document.createElement('a');
            link.href = msg.image;
            link.download = msg.image.split('/').pop();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    if (loading) return <p>Loading...</p>;

    if (!currentUser) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <div className="message-page">
            <div className="message-header">
                <img
                    src={arrowImage}
                    alt="Back"
                    className="back-arrow"
                    onClick={() => navigate(`/chats/${userId}`)}
                />
                <img
                    src={userData.profileImageUrl || defaultProfileImage}
                    alt={`${userData.firstname || 'User'} ${userData.lastname || ''}'s profile`}
                    className="profile-image"
                />
                <h2>
                    {userData.firstname || 'User'} {userData.lastname || ''}, {userData.age || 'N/A'}
                </h2>
            </div>
            <div className="message-list">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`message ${msg.sender === currentUser.id ? 'sent' : 'received'}`}
                        onClick={() => handleClickMessage(msg.id)}
                    >
                        {msg.sender !== currentUser.id && (
                            <img
                                src={userData.profileImageUrl || defaultProfileImage}
                                alt={`${userData.firstname}'s profile`}
                                className="message-sender-image"
                            />
                        )}
                        <div className="message-content">
                            {msg.message && <p>{msg.message}</p>}
                            {msg.image && (
                                <div onClick={() => handleFileClick(msg)}>
                                    <img src={msg.image} alt="sent" className="message-image" />
                                </div>
                            )}
                        </div>
                        {showTimestampFor === msg.id && (
                            <div className="message-timestamp-outside">
                                {formatTimestamp(msg.timestamp)}
                                {msg.sender === currentUser.id && msg.seen && <p className="seen-message">Seen</p>}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="message-container">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="message-input"
                />
                <button onClick={handleFileUploadClick} className="file-upload-button">
                    <img src={paperClipImage} alt="Attach file" />
                </button>
                <input
                    type="file"
                    id="fileInput"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
                {file && (
                    <div className="file-display">
                        <span>{fileName}</span>
                        <button onClick={handleRemoveFile} className="remove-file-button">X</button>
                    </div>
                )}
                <button onClick={handleSendMessage} className="send-button">
                    <img src={sendButtonImage} alt="Send" />
                </button>
            </div>
        </div>
    );
};

export default Message;
