import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { firestore } from '../js/firebase';
// import '../styles/MessagesSidebar.css';

const MessagesSidebar = ({ onSelectChat }) => {
  const [activeTab, setActiveTab] = useState('chats');
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchChats = () => {
      const chatsRef = collection(firestore, 'chats');
      const q = query(chatsRef, orderBy('lastMessageTime', 'desc'), limit(20));
      
      return onSnapshot(q, (snapshot) => {
        const chatData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setChats(chatData);
      });
    };

    const fetchUsers = () => {
      const usersRef = collection(firestore, 'users');
      const q = query(usersRef, limit(20));
      
      return onSnapshot(q, (snapshot) => {
        const userData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(userData);
      });
    };

    const unsubscribeChats = fetchChats();
    const unsubscribeUsers = fetchUsers();

    return () => {
      unsubscribeChats();
      unsubscribeUsers();
    };
  }, []);

  const filteredItems = activeTab === 'chats'
    ? chats.filter(chat => chat.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : users.filter(user => user.displayName.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="messages-sidebar-content">
      <div className="messages-tabs">
        <button 
          className={`tab ${activeTab === 'chats' ? 'active' : ''}`}
          onClick={() => setActiveTab('chats')}
        >
          Chats
        </button>
        <button 
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
      </div>
      <div className="search-bar">
        <Search size={18} />
        <input 
          type="text" 
          placeholder={`Search ${activeTab}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="items-list">
        {filteredItems.map(item => (
          <div key={item.id} className="item" onClick={() => onSelectChat(item.id, activeTab)}>
            <img src={item.avatar || '/default-avatar.png'} alt={item.name || item.displayName} className="avatar" />
            <div className="item-details">
              <h4>{item.name || item.displayName}</h4>
              {activeTab === 'chats' && <p>{item.lastMessage}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessagesSidebar;