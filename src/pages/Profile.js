import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import ProfileHeader from '../components/ProfileHeader';
import MobileHeader from '../components/MobileHeader';
import '../styles/Profile.css';
import bronze from '../assets/diamond.png';
import { auth, storage, firestore } from '../js/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { fetchSetData } from '../js/api';

const MAX_USERNAME_LENGTH = 16;
const MIN_USERNAME_LENGTH = 8;
const MAX_BIO_LENGTH = 350;
const defaultBio = "I'm an avid Pokémon trainer on a mission to catch 'em all! Always exploring new places, meeting fellow trainers, and evolving my team. Add something cool about yourself here...";

const Profile = () => {
  const { currentUser } = useContext(AuthContext);
  const [profileImage, setProfileImage] = useState(currentUser?.photoURL || '');
  const [username, setUsername] = useState(currentUser?.displayName || '');
  const [bio, setBio] = useState(defaultBio);
  const [stats, setStats] = useState({ cards: 0, trades: 0 });
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(username);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [newBio, setNewBio] = useState(bio);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [forYouSets, setForYouSets] = useState([]);
  const [forYouLoading, setForYouLoading] = useState(true);
  const [isSliderVisible, setIsSliderVisible] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isLeftArrowVisible, setIsLeftArrowVisible] = useState(false);
  const [isRightArrowVisible, setIsRightArrowVisible] = useState(true);
  const forYouRef = useRef(null);
  const usernameInputRef = useRef(null);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const storageRef = ref(storage, `profileImages/${currentUser.uid}`);
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);
      await updateProfile(currentUser, { photoURL });
      setProfileImage(photoURL);
      console.log('Uploaded Image URL:', photoURL);
    }
  };

  const checkUsernameAvailability = async (username) => {
    const usersCollection = collection(firestore, 'users');
    const q = query(usersCollection, where('lowercaseUsername', '==', username.toLowerCase()));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
  };

  const handleEditClick = () => {
    setIsEditingUsername(true);
  };

  const handleUsernameChange = (e) => {
    if (e.target.value.length <= MAX_USERNAME_LENGTH) {
      setNewUsername(e.target.value);
      adjustInputWidth(e.target);
    }
  };

  const adjustInputWidth = (input) => {
    input.style.width = `${input.value.length + 1}ch`;
  };

  const handleBioChange = (e) => {
    if (e.target.value.length <= MAX_BIO_LENGTH) {
      setNewBio(e.target.value);
    }
  };

  const handleSaveUsernameClick = async () => {
    setError('');
    if (newUsername.length < MIN_USERNAME_LENGTH || newUsername.length > MAX_USERNAME_LENGTH) {
      setError(`Username must be between ${MIN_USERNAME_LENGTH} and ${MAX_USERNAME_LENGTH} characters`);
      return;
    }
    const isUsernameAvailable = await checkUsernameAvailability(newUsername);
    if (!isUsernameAvailable) {
      setError('Username is already taken');
      return;
    }

    try {
      await updateProfile(currentUser, { displayName: newUsername });
      setUsername(newUsername);
      const userDocRef = doc(firestore, 'users', currentUser.uid);
      await setDoc(userDocRef, { displayName: newUsername, lowercaseUsername: newUsername.toLowerCase() }, { merge: true });
      setIsEditingUsername(false);
    } catch (error) {
      console.error('Error saving username:', error);
      setError('Error saving username. Please try again.');
    }
  };

  const handleSaveBioClick = async () => {
    try {
      const userDocRef = doc(firestore, 'users', currentUser.uid);
      await setDoc(userDocRef, { bio: newBio }, { merge: true });
      setBio(newBio);
      setIsEditingBio(false);
    } catch (error) {
      console.error('Error saving bio:', error);
    }
  };

  const handleCancelUsernameClick = () => {
    setNewUsername(username);
    setIsEditingUsername(false);
  };

  const handleCancelBioClick = () => {
    setNewBio(bio);
    setIsEditingBio(false);
  };

  const handleUsernameKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveUsernameClick();
    }
  };

  const handleBioKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveBioClick();
    }
  };

  useEffect(() => {
    if (currentUser && currentUser.photoURL) {
      setProfileImage(currentUser.photoURL);
    }
    if (currentUser && currentUser.displayName) {
      setUsername(currentUser.displayName);
    }

    const fetchUserData = async () => {
      try {
        const userDocRef = doc(firestore, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          if (userData.bio) {
            setBio(userData.bio);
            setNewBio(userData.bio);
          }
          if (userData.displayName) {
            setUsername(userData.displayName);
            setNewUsername(userData.displayName);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (usernameInputRef.current) {
      adjustInputWidth(usernameInputRef.current);
    }
  }, [newUsername]);

  useEffect(() => {
    const setIds = ['sv6pt5', 'sv6', 'sv5', 'sv4pt5'];

    const fetchForYouSets = async () => {
      try {
        const allSets = await fetchSetData();
        const filteredSets = allSets.filter((set) => setIds.includes(set.id));
        const sortedSets = filteredSets.sort((a, b) => setIds.indexOf(a.id) - setIds.indexOf(b.id));
        setForYouSets(sortedSets);
        setForYouLoading(false);
      } catch (error) {
        console.error('Error fetching "For You" sets:', error);
        setForYouLoading(false);
      }
    };

    fetchForYouSets();
  }, []);

  const handleForYouSetClick = (setId) => {
    sessionStorage.removeItem('overlayOpened');
    navigate(`/packs/view-all?setId=${setId}`);
  };

  const handleScrollRight = () => {
    if (forYouRef.current) {
      forYouRef.current.scrollBy({ left: 300, behavior: 'smooth' });
      setScrollPosition(forYouRef.current.scrollLeft + 300);
    }
  };

  const handleScrollLeft = () => {
    if (forYouRef.current) {
      forYouRef.current.scrollBy({ left: -300, behavior: 'smooth' });
      setScrollPosition(forYouRef.current.scrollLeft - 300);
    }
  };

  const updateArrowsVisibility = () => {
  if (forYouRef.current) {
    const maxScrollLeft = forYouRef.current.scrollWidth - forYouRef.current.clientWidth;
    const wrapper = forYouRef.current.closest('.for-you-wrapper');

    // Show or hide arrows based on the scroll position
    const isLeftVisible = forYouRef.current.scrollLeft > 0;
    const isRightVisible = forYouRef.current.scrollLeft < maxScrollLeft;

    setIsLeftArrowVisible(isLeftVisible);
    setIsRightArrowVisible(isRightVisible);

    // Toggle gradient visibility
    if (wrapper) {
      if (isLeftVisible) {
        wrapper.classList.add('show-left-gradient');
      } else {
        wrapper.classList.remove('show-left-gradient');
      }

      if (isRightVisible) {
        wrapper.classList.add('show-right-gradient');
      } else {
        wrapper.classList.remove('show-right-gradient');
      }
    }
  }
};

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1039) {
        setIsSliderVisible(true);
        updateArrowsVisibility();
      } else {
        setIsSliderVisible(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    if (forYouRef.current) {
      updateArrowsVisibility();
      forYouRef.current.addEventListener('scroll', updateArrowsVisibility);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (forYouRef.current) {
        forYouRef.current.removeEventListener('scroll', updateArrowsVisibility);
      }
    };
  }, [scrollPosition]);

  return (
    <>
      <ProfileHeader />
      <MobileHeader />

      <div className="profile-container">
        {loading ? (
          <div className="loading-container">
            {/* Loading Spinner or Skeleton */}
          </div>
        ) : (
          <div className="profile-content">
            <div className="profile-header">
              <div className={`profile-image-wrapper ${profileImage ? 'no-border' : ''}`}>
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="profile-image profile-image--main" />
                ) : (
                  <div className="default-image gradient-background">
                    {username.charAt(0)}
                  </div>
                )}
                <input type="file" onChange={handleImageUpload} />
              </div>
              <div className="profile-details">
                {isEditingUsername ? (
                  <div className="username-edit">
                    <input
                      ref={usernameInputRef}
                      type="text"
                      value={newUsername}
                      onChange={handleUsernameChange}
                      onKeyDown={handleUsernameKeyDown}
                      maxLength={MAX_USERNAME_LENGTH}
                      style={{ width: 'auto' }}
                    />
                    <button onClick={handleSaveUsernameClick}>Save</button>
                    <button onClick={handleCancelUsernameClick}>Cancel</button>
                    {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
                  </div>
                ) : (
                  <h2 onClick={handleEditClick}>
                    {username} <img src={bronze} alt="Edit" className="rank" />
                  </h2>
                )}
                <div className="profile-stats">
                  <div className="stat-item">
                    <h3>{stats.cards}</h3>
                    <p>Cards</p>
                  </div>
                  <div className="stat-item">
                    <h3>{stats.trades}</h3>
                    <p>Trades</p>
                  </div>
                </div>
                {isEditingBio ? (
                  <div className="bio-edit">
                    <textarea
                      value={newBio}
                      onChange={handleBioChange}
                      onKeyDown={handleBioKeyDown}
                      rows="4"
                      maxLength={MAX_BIO_LENGTH}
                    />
                    <div className="bio-char-count">
                      {newBio.length}/{MAX_BIO_LENGTH}
                    </div>
                    <button onClick={handleSaveBioClick}>Save</button>
                    <button onClick={handleCancelBioClick}>Cancel</button>
                  </div>
                ) : (
                  <div className="bio-container" onClick={() => setIsEditingBio(true)}>
                    <p className="bio">
                      {bio}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* "For You" Section */}
            <div className="profile-for-you">
              <h2><span className="gradient-text">For</span> You</h2>
              <div className="for-you-wrapper">
                {isSliderVisible && (
                  <>
                    {isLeftArrowVisible && (
                      <button className="scroll-left-arrow" onClick={handleScrollLeft}>
                        &#8249;
                      </button>
                    )}
                    {isRightArrowVisible && (
                      <button className="scroll-right-arrow" onClick={handleScrollRight}>
                        &#8250;
                      </button>
                    )}
                  </>
                )}
                <div className="for-you-grid" ref={forYouRef}>
                  {forYouLoading ? (
                    Array.from({ length: 4 }).map((_, index) => (
                      <div className="skeleton-item" key={index}>
                        <div className="skeleton-logo"></div>
                      </div>
                    ))
                  ) : (
                    forYouSets.map((set) => (
                      <div
                        className="set-item"
                        key={set.id}
                        onClick={() => handleForYouSetClick(set.id)}
                      >
                        <img src={set.images.logo} alt={`${set.name} logo`} className="set-logo" />
                      </div>
                    ))
                  )}
                </div>
              </div>
              <button className="profile-edit-sets">Edit Your Sets</button>
            </div>

            <div className="profile-messages">
              <h3>Messages</h3>
              {/* Messaging system UI here */}
            </div>
            <div className="profile-binder">
              <h3>My Binder</h3>
              {/* Binder preview UI here */}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
