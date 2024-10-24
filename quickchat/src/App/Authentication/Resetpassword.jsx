import React, { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import app from '../../firebaseConfig';
import './Resetpassword.css'; 

const ResetPassword = () => {
    const auth = getAuth(app);
    const navigate = useNavigate(); 
    const [email, setEmail] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const handleResetPassword = async () => {
        if (!email) {
            setMessage("Please enter your email.");
            setModalOpen(true);
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            setMessage("Password reset email sent! Check your inbox.");
        } catch (error) {
            console.error("Error sending password reset email:", error);
            setMessage("Error sending reset email: " + error.message);
        }

        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setMessage('');
        setEmail('');
    };

    const handleReturnToSignIn = () => {
        navigate('/signin'); // Redirect to /signin
    };

    return (
        <div className="reset-password-container">
            <h2>Reset Password</h2>
            <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={handleChange}
                    className="form-input"
                    required
                />
            </div>
            <button onClick={handleResetPassword} className="reset-button">Reset Password</button>

            {modalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseModal}>&times;</span>
                        <p>{message}</p>
                        <button onClick={handleCloseModal} className="modal-close-button">Close</button>
                    </div>
                </div>
            )}

            <p className="return-signin" onClick={handleReturnToSignIn}>
                Return to Sign In
            </p>
        </div>
    );
};

export default ResetPassword;
