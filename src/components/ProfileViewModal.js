import React from 'react';
import { X } from 'lucide-react';
import '../styles/ProfileViewModal.css';

const ProfileViewModal = ({ user, onClose }) => {
    const formatRarityName = (rarityKey) => {
        const words = rarityKey.split(/(?=[A-Z])/).map((word) => word.toLowerCase());
        return words
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    const totalRareCards = Object.values(user.userRarities || {}).reduce(
        (a, b) => a + b,
        0
    );

    return (
        <div className="profile-view-modal">
            <div className="profile-view-content">
                <button className="close-profile" onClick={onClose}>
                    <X size={24} />
                </button>
                <div className="profile-header" style={{ backgroundColor: user.profileColor }}>
                    <img
                        src={user.avatarUrl}
                        alt={user.displayName}
                        className="profile-avatar"
                    />
                    <h1>{user.displayName}</h1>
                </div>

                <div className="profile-content">
                    <div className="profile-section">
                        <h2>About</h2>
                        <p>{user.bio}</p>
                    </div>

                    <div className="profile-section">
                        <h2>Stats</h2>
                        <div className="stats-grid">
                            <div className="stat-item">
                                <span>Total Cards:</span>
                                <strong>{user.totalCards}</strong>
                            </div>
                            <div className="stat-item">
                                <span>Rare Cards:</span>
                                <strong>{totalRareCards}</strong>
                            </div>
                        </div>
                    </div>

                    <div className="profile-section">
                        <h2>Rare Cards</h2>
                        <div className="rarity-grid">
                            {Object.entries(user.userRarities || {}).map(
                                ([rarity, count]) =>
                                    count > 0 && (
                                        <div key={rarity} className="rarity-item">
                                            <span className="rarity-name">
                                                {formatRarityName(rarity)}
                                            </span>
                                            <span className="rarity-count">{count}</span>
                                        </div>
                                    )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileViewModal;
