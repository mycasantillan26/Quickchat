import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import loginImage from '../images/communicate4.jpg';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import app from '../../firebaseConfig';

const Login = () => {
    const auth = getAuth(app);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = formData;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            navigate(`/dashboard/${user.uid}`);
        } catch (error) {
            console.error("Error signing in:", error);
            setErrorMessage("Invalid email or password.");
        }
    };

    // Updated handleForgotPassword to redirect to /reset-password
    const handleForgotPassword = () => {
        navigate('/reset-password'); // Redirect to /reset-password
    };

    // New function to handle Sign Up button click
    const handleSignUp = () => {
        navigate('/signup'); // Redirect to /signup
    };

    return (
        <div className="login-container">
            <div className="form-section">
                <div className="login-box">
                    <form className="login-form" onSubmit={handleSubmit}>
                        <h2>Login</h2>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-input"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="form-input"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        <button type="submit" className="submit-button">Login</button>
                    </form>
                    <p className="forgot-password" onClick={handleForgotPassword}>
                        Forgot Password? <span>Click here</span>
                    </p>
                </div>
            </div>
            <div className="image-section">
                <div className="image-background">
                    <img src={loginImage} alt="Login" className="login-image" />
                    <div className="text-overlay">
                        <h1 className="welcome-text">Welcome!</h1>
                        <p className="journey-text">Enter your personal details and start your journey with us!</p>
                        <button className="signup-button" onClick={handleSignUp}>SIGN UP</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
