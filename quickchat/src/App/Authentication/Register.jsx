import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import app from '../../firebaseConfig'; 
import communicateImage from '../images/communicate5.jpg'; 

const Register = () => {
    const auth = getAuth(app);
    const db = getFirestore(app);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstname: '',
        middlename: '',
        lastname: '',
        email: '',
        birthdate: '',
        gender: '',
        password: '',
        confirmPassword: '',
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
        const { firstname, middlename, lastname, email, birthdate, gender, password, confirmPassword } = formData;

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match!');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, "Users", user.uid), {
                firstname,
                middlename,
                lastname,
                email,
                birthdate,
                gender,
            });

            setFormData({
                firstname: '',
                middlename: '',
                lastname: '',
                email: '',
                birthdate: '',
                gender: '',
                password: '',
                confirmPassword: '',
            });

            setErrorMessage('');
            navigate('/signin'); // Redirect to signin page after success
        } catch (error) {
            console.error("Error registering user:", error);
            setErrorMessage("Error registering: " + error.message);
        }
    };

    return (
        <div className="register-container">
            <div className="left-section" style={{ backgroundImage: `url(${communicateImage})` }}>
                <h2>Welcome Back!</h2>
                <p>To help connected with us please login with your personal info.</p>
                <button className="sign-in-btn" onClick={() => navigate('/signin')}>SIGN IN</button>
            </div>

            {/* Right side with sign-up form */}
            <div className="right-section">
                <form className="register-form" onSubmit={handleSubmit}>
                    <h2>Sign up</h2>
                    <div className="form-group">
                        <input type="text" name="firstname" placeholder="First name" value={formData.firstname} onChange={handleChange} required />
                        <input type="text" name="middlename" placeholder="MI" value={formData.middlename} onChange={handleChange} />
                        <input type="text" name="lastname" placeholder="Last name" value={formData.lastname} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} required />
                        <input type="text" name="gender" placeholder="Gender" value={formData.gender} onChange={handleChange} required />
                    </div>
                    <div className="form-group2">
                        <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
                        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                        <input type="password" name="confirmPassword" placeholder="Confirm password" value={formData.confirmPassword} onChange={handleChange} required />
                    </div>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <button type="submit" className="submit-button">Sign up</button>
                </form>
            </div>
        </div>
    );
};

export default Register;
