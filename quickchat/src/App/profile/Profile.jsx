import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import app from '../../firebaseConfig';
import arrowImage from '../images/arrow.png';
import userImagePlaceholder from '../images/user.png';

const Profile = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileImage, setProfileImage] = useState(userImagePlaceholder);
  const [showModal, setShowModal] = useState(false); // State for image removal modal
  const [showSuccessModal, setShowSuccessModal] = useState(false); // State for success message modal
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        console.error('User ID is not defined');
        setError('User ID is required');
        setLoading(false);
        return;
      }

      const firestore = getFirestore(app);
      const userDocRef = doc(firestore, 'Users', userId);
      try {
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
          setProfileImage(data.profileImage || userImagePlaceholder);
        } else {
          setError('User not found');
        }
      } catch (error) {
        setError('Error fetching user data');
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const firestore = getFirestore(app);
    const userDocRef = doc(firestore, 'Users', userId);
    try {
      await setDoc(userDocRef, { ...userData, profileImage });
      setShowSuccessModal(true); // Show success message modal
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Update the image preview
        setProfileImage(reader.result);

        // Upload image if the current profileImage is the placeholder
        if (profileImage === userImagePlaceholder) {
          uploadImage(file); // Call upload function only if the placeholder is set
        }
      };
      reader.readAsDataURL(file);
      e.target.value = ''; // Reset file input to allow re-selection of the same file
    }
  };

  const uploadImage = async (file) => {
    const storage = getStorage(app);
    const storageRef = ref(storage, `profile/${userId}`);
    try {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setProfileImage(downloadURL);
      setUserData((prevData) => ({ ...prevData, profileImage: downloadURL }));
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleRemoveImage = () => {
    // Only show modal if the current profileImage is not the placeholder
    if (profileImage !== userImagePlaceholder) {
      setShowModal(true); // Show modal to confirm removal
    } else {
      // If the profile image is the placeholder, open the file chooser
      document.querySelector('input[type="file"]').click();
    }
  };

  const confirmRemoveImage = () => {
    setProfileImage(userImagePlaceholder); // Reset to placeholder
    setUserData((prevData) => ({ ...prevData, profileImage: null })); // Update userData
    setShowModal(false); // Close the modal
  };

  const cancelRemoveImage = () => {
    setShowModal(false); // Just close the modal
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false); // Close the success modal
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!userData) {
    return <div>User not found</div>;
  }

  const { firstname, lastname, middlename, gender, birthdate, email } = userData;

  return (
    <div className="profile" style={{ display: 'flex', alignItems: 'center' }}>
      <img
        src={arrowImage}
        alt="Back"
        onClick={() => navigate(`/dashboard/${userId}`)}
        style={{ cursor: 'pointer', width: '30px', height: '30px', marginRight: '10px' }}
      />
      <h1>User Profile</h1>
      <div style={{ display: 'flex', marginLeft: '20px', width: '100%' }}>
        <div style={{ marginRight: '20px' }}>
          <label style={{ cursor: 'pointer' }} onClick={handleRemoveImage}>
            <img
              src={profileImage}
              alt="Profile"
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #ccc',
              }}
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </label>
        </div>
        <div style={{ flex: 1 }}>
          <div>
            <label>
              <strong>First Name:</strong>
              <input
                type="text"
                name="firstname"
                value={firstname}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label>
              <strong>Last Name:</strong>
              <input
                type="text"
                name="lastname"
                value={lastname}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label>
              <strong>Middle Name:</strong>
              <input
                type="text"
                name="middlename"
                value={middlename}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label>
              <strong>Gender:</strong>
              <select
                name="gender"
                value={gender}
                onChange={handleChange}
              >
                <option value="Not Specified">Not Specified</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </label>
          </div>
          <div>
            <label>
              <strong>Birthdate:</strong>
              <input
                type="date"
                name="birthdate"
                value={new Date(birthdate).toISOString().slice(0, 10)}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label>
              <strong>Email:</strong>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
              />
            </label>
          </div>
          <button onClick={handleSave}>Save</button>
        </div>
      </div>

      {/* Modal for removing image confirmation */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Remove Image</h2>
            <p>Are you sure you want to remove the selected image?</p>
            <button onClick={confirmRemoveImage}>Yes</button>
            <button onClick={cancelRemoveImage}>No</button>
          </div>
        </div>
      )}

      {/* Modal for success message */}
      {showSuccessModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Success</h2>
            <p>User data updated successfully.</p>
            <button onClick={closeSuccessModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
