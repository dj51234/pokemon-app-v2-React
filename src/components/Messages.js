import React, { useState, useEffect } from 'react';
import { Search, MoreVertical, Send, Users, MessageSquare, MoveLeft } from 'lucide-react';
import { collection, getDocs, query, limit, doc, getDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { firestore, storage } from '../js/firebase'; 
import ProfileHeader from './ProfileHeader';
import ProfileView from './ProfileView';
import MobileHeader from './MobileHeader';
import '../styles/Messages.css';

const Messages = () => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [isUserSearchActive, setIsUserSearchActive] = useState(false);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 1320);
  
    // Dummy data for demonstration
    const chats = [
      { id: 1, name: 'John Doe', lastMessage: 'Hey, want to trade?', avatar: '/api/placeholder/40/40' },
      { id: 2, name: 'Jane Smith', lastMessage: 'Thanks for the Charizard!', avatar: '/api/placeholder/40/40' },
      { id: 3, name: 'Mike Johnson', lastMessage: 'Do you have any rare cards?', avatar: '/api/placeholder/40/40' },
    ];
  
    const fetchUserAvatar = async (userId, displayName) => {
      try {
        console.log(`Attempting to fetch avatar for user: ${userId}`);
        const storageRef = ref(storage, `profileImages/${userId}`);
        console.log('Storage reference:', storageRef.fullPath);
        const url = await getDownloadURL(storageRef);
        console.log(`Successfully fetched avatar URL for ${userId}:`, url);
        return url;
      } catch (error) {
        if (error.code === 'storage/object-not-found') {
          console.log(`No profile image found for user ${userId}, using default avatar`);
          return generateDefaultAvatar(displayName);
        } else {
          console.error(`Error fetching avatar for ${userId}:`, error);
          return generateDefaultAvatar(displayName);
        }
      }
    };
    
    const generateDefaultAvatar = (displayName) => {
      const initial = displayName ? displayName.charAt(0).toUpperCase() : '?';
      const avatarUrl = `https://ui-avatars.com/api/?name=${initial}&background=random&color=fff`;
      console.log(`Generated default avatar for ${displayName}:`, avatarUrl);
      return avatarUrl;
    };
    
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const usersRef = collection(firestore, 'users');
        const q = query(usersRef, limit(10));
        const querySnapshot = await getDocs(q);
        const userList = await Promise.all(querySnapshot.docs.map(async (doc) => {
          const userData = doc.data();
          console.log(`User data for ${doc.id}:`, userData);
          const avatarUrl = await fetchUserAvatar(doc.id, userData.displayName);
          return {
            id: doc.id,
            ...userData,
            avatarUrl
          };
        }));
        console.log('Fetched user list:', userList);
        setUsers(userList);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    useEffect(() => {
      if (isUserSearchActive) {
        fetchUsers();
      }
    }, [isUserSearchActive]);
  
    const handleToggleClick = (isUsers) => {
      setIsUserSearchActive(isUsers);
      setSelectedChat(null);
    };

    useEffect(() => {
      const checkMobileView = () => {
          const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
          setIsMobileView(width <= 1320);
      };

      // Check on mount
      checkMobileView();

      // Add event listeners
      window.addEventListener('resize', checkMobileView);
      window.addEventListener('orientationchange', checkMobileView);

      // Cleanup
      return () => {
          window.removeEventListener('resize', checkMobileView);
          window.removeEventListener('orientationchange', checkMobileView);
      };
  }, []);

  const toggleMessagesSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

    const handleUserClick = async (userId) => {
      setIsLoading(true);
      try {
        const userDoc = await getDoc(doc(firestore, 'users', userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const avatarUrl = await fetchUserAvatar(userId, userData.displayName);
          setSelectedUser({ id: userId, ...userData, avatarUrl });
          // Delay hiding the sidebar slightly to allow for smooth transition
          setTimeout(() => setIsSidebarVisible(false), 50);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
      setIsLoading(false);
    };

    const handleCloseProfile = () => {
      setIsSidebarVisible(true);
      // Delay unsetting the selected user to allow for smooth transition
      setTimeout(() => setSelectedUser(null), 300);
    };
  
    return (
      <>
        {isMobileView ? (
                <MobileHeader toggleMessagesSidebar={toggleMessagesSidebar} />
            ) : (
                <ProfileHeader />
            )}
        <div className="messages-container">
          {/* Sidebar */}
          <div className={`messages-sidebar ${isMobileView && !isSidebarVisible ? 'hidden' : ''}`}>
            <div className="messages-sidebar-header">
              <div className="messages-toggle">
                <button 
                  className={`toggle-button ${!isUserSearchActive ? 'active' : ''}`}
                  onClick={() => setIsUserSearchActive(false)}
                >
                  <MessageSquare size={20} />
                  <span>Chats</span>
                </button>
                <button 
                  className={`toggle-button ${isUserSearchActive ? 'active' : ''}`}
                  onClick={() => setIsUserSearchActive(true)}
                >
                  <Users size={20} />
                  <span>Users</span>
                </button>
              </div>
              <div className="messages-search">
                <input 
                  type="text" 
                  placeholder={isUserSearchActive ? "Search users" : "Search messages"}
                />
                <Search className="search-icon" size={18} />
              </div>
            </div>
            <div className="messages-list">
              {isLoading ? (
                <div className="loading">Loading...</div>
              ) : isUserSearchActive ? (
                users.map((user) => (
                  <div 
                    key={user.id} 
                    className="chat-item" 
                    onClick={() => handleUserClick(user.id)}
                  >
                    <img 
                      src={user.avatarUrl} 
                      alt={user.displayName || 'User'} 
                      className="chat-avatar"
                      onError={(e) => {
                        console.log(`Error loading avatar for ${user.displayName}, falling back to default`);
                        e.target.src = generateDefaultAvatar(user.displayName);
                      }}
                    />
                    <div className="chat-info">
                      <h3>{user.displayName || 'Anonymous User'}</h3>
                      <p>Click to view profile</p>
                    </div>
                  </div>
                ))
              ) : (
                chats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`chat-item ${selectedChat === chat.id ? 'selected' : ''}`}
                    onClick={() => setSelectedChat(chat.id)}
                  >
                    <img src={chat.avatar} alt={chat.name} className="chat-avatar" />
                    <div className="chat-info">
                      <h3>{chat.name}</h3>
                      <p>{chat.lastMessage}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        
          {/* Chat Area */}
          <div className={`chat-area ${isMobileView && isSidebarVisible ? 'hidden' : ''}`}>
          {selectedUser ? (
              <div className={`profile-view-container ${!isSidebarVisible ? 'expanded' : ''}`}>
                <ProfileView 
                  user={selectedUser} 
                  handleCloseProfile={handleCloseProfile}
                  isSidebarVisible={isSidebarVisible}
                />
              </div>
            ) : selectedChat ? (
              <>
                <div className="chat-header">
                  <div className="chat-header-info">
                    <img src="/api/placeholder/40/40" alt="Selected user" className="chat-avatar" />
                    <h2>{chats.find(chat => chat.id === selectedChat)?.name}</h2>
                  </div>
                  <MoreVertical className="more-options" />
                </div>
                <div className="chat-messages">
                  {/* Messages will be rendered here */}
                </div>
                <div className="chat-input">
                  <input type="text" placeholder="Type a message" />
                  <button className="send-button">
                    <Send size={20} />
                  </button>
                </div>
              </>
            ) : (
              <div className="no-chat-selected">
                <p>Select a chat to start messaging or click on a user to view their profile</p>
              </div>
            )}
          </div>
        </div>
      </>
    );
};

export default Messages;