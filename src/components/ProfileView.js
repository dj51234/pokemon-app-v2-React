import React from "react";
import { User, Mail, Calendar, Clock, Book, Star, Heart } from "lucide-react";
import "../styles/ProfileView.css";

const formatRarityName = (rarityKey) => {
  const words = rarityKey.split(/(?=[A-Z])/).map((word) => word.toLowerCase());
  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const ProfileView = ({ user }) => {
  const totalRareCards = Object.values(user.userRarities).reduce(
    (a, b) => a + b,
    0
  );

  return (
    <div className="profile-view">
      <div
        className="profile-header"
        style={{ backgroundColor: user.profileColor }}
      >
        <img
          src={user.avatarUrl}
          alt={user.displayName}
          className="profile-avatar"
        />
        <h1>{user.displayName}</h1>
        <span className="rank">{user.rank}</span>
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
              <User size={20} />
              <span>
                Total Cards:{" "}
                <strong className="number-highlight">{user.totalCards}</strong>
              </span>
            </div>
            <div className="stat-item">
              <Star size={20} />
              <span>
                Rare Cards:{" "}
                <strong className="number-highlight">{totalRareCards}</strong>
              </span>
            </div>
            <div className="stat-item">
              <Mail size={20} />
              <span>{user.email}</span>
            </div>
            <div className="stat-item">
              <Clock size={20} />
              <span>
                Last Login: {new Date(user.lastLogin.toDate()).toLocaleString()}
              </span>
            </div>
            <div className="stat-item">
              <div
                className={`status-indicator ${
                  user.isActive ? "active" : "inactive"
                }`}
              ></div>
              <span>{user.isActive ? "Online" : "Offline"}</span>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Rare Cards</h2>
          <div className="rarity-grid">
            {Object.entries(user.userRarities).map(
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

        <div className="profile-section">
          <h2>Wishlist</h2>
          <div className="wishlist-grid">
            {user.wishlist.map((item, index) => (
              <div key={index} className="wishlist-item">
                {typeof item === "object" && item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={`Card ${item.id}`}
                    className="wishlist-card-image"
                  />
                ) : (
                  <div className="wishlist-placeholder">No Image</div>
                )}
                <Heart size={16} />
              </div>
            ))}
          </div>
        </div>

        <div className="profile-section">
          <h2>Binder Preview</h2>
          <div className="binder-preview">
            {user.binder.slice(0, 5).map((card, index) => (
              <img
                key={index}
                src={card.imageUrl}
                alt={card.name}
                className="binder-card"
              />
            ))}
            {user.binder.length > 5 && (
              <div className="more-cards">+{user.binder.length - 5} more</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
