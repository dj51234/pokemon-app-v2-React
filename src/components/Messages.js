import React, { useState, useEffect } from 'react';
import { Search, Send, Users, MessageSquare, Menu, ArrowLeft } from 'lucide-react';
import { collection, getDocs, query, limit, doc, getDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { firestore, storage } from '../js/firebase';
import ProfileHeader from './ProfileHeader';
import ProfileView from './ProfileView';
import MobileHeader from './MobileHeader';
import '../styles/Messages.css';

const Messages = () => {
  const [activeTab, setActiveTab] = useState('Chats'); // 'Chats' or 'Users'
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 1320);
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  // Fetch users and chats on component mount
  useEffect(() => {
    fetchUsers();
    fetchChats();
    handleResize(); // Set initial mobile view state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle window resize
  const handleResize = () => {
    setIsMobileView(window.innerWidth <= 1320);
    if (window.innerWidth > 1320) {
      setSidebarVisible(true);
    }
  };

  // Fetch users function
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const usersRef = collection(firestore, 'users');
      const q = query(usersRef, limit(20));
      const querySnapshot = await getDocs(q);
      const userList = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const userData = doc.data();
          const avatarUrl = await fetchUserAvatar(doc.id, userData.displayName);
          return {
            id: doc.id,
            ...userData,
            avatarUrl,
          };
        })
      );
      setUsers(userList);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
    setIsLoading(false);
  };

  // Fetch chats function (dummy data for now)
  const fetchChats = async () => {
    // Replace with actual fetching logic
    setChats([
      { id: 1, name: 'John Doe', lastMessage: 'Hey, want to trade?', avatar: '/api/placeholder/40/40' },
      { id: 2, name: 'Jane Smith', lastMessage: 'Thanks for the Charizard!', avatar: '/api/placeholder/40/40' },
      { id: 3, name: 'Mike Johnson', lastMessage: 'Do you have any rare cards?', avatar: '/api/placeholder/40/40' },
    ]);
  };

  // Fetch user avatar
  const fetchUserAvatar = async (userId, displayName) => {
    try {
      const storageRef = ref(storage, `profileImages/${userId}`);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (error) {
      if (error.code === 'storage/object-not-found') {
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
    return avatarUrl;
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedChat(null);
    setSelectedUser(null);
  };

  const handleChatSelect = (chatId) => {
    setSelectedChat(chatId);
    setSelectedUser(null);
    if (isMobileView) {
      setSidebarVisible(false);
    }
  };

  const handleUserSelect = (userId) => {
    setIsLoading(true);
    getDoc(doc(firestore, 'users', userId))
      .then(async (docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          const avatarUrl = await fetchUserAvatar(userId, userData.displayName);
          setSelectedUser({ id: userId, ...userData, avatarUrl });
          setSelectedChat(null);
          if (isMobileView) {
            setSidebarVisible(false);
          }
        } else {
          console.error('User not found');
        }
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleBackButtonClick = () => {
    setSelectedChat(null);
    setSelectedUser(null);
    if (isMobileView) {
      setSidebarVisible(true);
    }
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <>
      {isMobileView ? (
        <MobileHeader toggleMessagesSidebar={toggleSidebar} />
      ) : (
        <ProfileHeader />
      )}
      <div className="messages-container">
        {/* Sidebar */}
        {(!isMobileView || sidebarVisible) && (
          <div className="messages-sidebar">
            <div className="sidebar-header">
              <div className="tabs">
                <button
                  className={`tab ${activeTab === 'Chats' ? 'active' : ''}`}
                  onClick={() => handleTabChange('Chats')}
                >
                  <MessageSquare size={20} />
                  <span>Chats</span>
                </button>
                <button
                  className={`tab ${activeTab === 'Users' ? 'active' : ''}`}
                  onClick={() => handleTabChange('Users')}
                >
                  <Users size={20} />
                  <span>Users</span>
                </button>
              </div>
              <div className="search-bar">
                <Search size={18} className="search-icon" />
                <input type="text" placeholder={`Search ${activeTab.toLowerCase()}`} />
              </div>
            </div>
            <div className="sidebar-content">
              {isLoading ? (
                <div className="loading">Loading...</div>
              ) : activeTab === 'Chats' ? (
                chats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`item ${selectedChat === chat.id ? 'selected' : ''}`}
                    onClick={() => handleChatSelect(chat.id)}
                  >
                    <img src={chat.avatar} alt={chat.name} className="avatar" />
                    <div className="info">
                      <h3>{chat.name}</h3>
                      <p>{chat.lastMessage}</p>
                    </div>
                  </div>
                ))
              ) : (
                users.map((user) => (
                  <div
                    key={user.id}
                    className={`item ${selectedUser?.id === user.id ? 'selected' : ''}`}
                    onClick={() => handleUserSelect(user.id)}
                  >
                    <img src={user.avatarUrl} alt={user.displayName} className="avatar" />
                    <div className="info">
                      <h3>{user.displayName}</h3>
                      <p>Click to view profile</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Main Area */}
        {(!isMobileView || !sidebarVisible) && (
          <div className={`main-area ${!sidebarVisible ? 'full-width' : ''}`}>
            {(selectedChat || selectedUser) && (
              <button className="back-button" onClick={handleBackButtonClick}>
                <ArrowLeft size={24} />
                <span>Back to Messages</span>
              </button>
            )}
            {selectedChat ? (
              // Chat view
              <div className="chat-view">
                <div className="chat-header">
                  <div className="chat-header-info">
                    <img src="/api/placeholder/40/40" alt="Selected user" className="chat-avatar" />
                    <h2>{chats.find((chat) => chat.id === selectedChat)?.name}</h2>
                  </div>
                </div>
                <div className="chat-messages">
                  {/* Messages will be rendered here */}
                  <p>This is where chat messages will appear.</p>
                </div>
                <div className="chat-input">
                  <input type="text" placeholder="Type a message" />
                  <button className="send-button">
                    <Send size={20} />
                  </button>
                </div>
              </div>
            ) : selectedUser ? (
              // Profile view
              <div className="profile-view-wrapper">
                <ProfileView user={selectedUser} handleCloseProfile={handleBackButtonClick} />
              </div>
            ) : (
              // Default view
              <div className="default-view">
                <p>Select a chat or user to start messaging or view profile</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Messages;
