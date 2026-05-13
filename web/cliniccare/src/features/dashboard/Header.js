import React, { useState } from "react";
import './Header.css';
import { Bell } from "lucide-react";
import NotificationCenter from "./NotificationCenter";

const Header = ({ user, userRole, onNavigate }) => {
    const [showNotifs, setShowNotifs] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0); 
    const userName = user?.fullName || user?.name || "Patient";
    const userInitial = userName.charAt(0).toUpperCase();

    return (
        <header className="header" style={{ position: 'relative' }}>
            <div className="header-welcome">
                {userRole === 'STAFF' ? (
                    <>
                        <h2>Staff Overview</h2>
                        <p className="header-subtitle">Manage clinic operations and track patient flow</p>
                    </>
                ) : (
                    <>
                        <h2>Welcome back, <span className="header-name">{userName}</span></h2>
                        <p className="header-subtitle">Here's your health overview</p>
                    </>
                )}
            </div>
            <div className="header-actions">
                {userRole !== 'STAFF' && (
                    <div style={{ position: 'relative' }}>
                        <button 
                            className={`header-notification ${showNotifs ? 'active' : ''}`} 
                            aria-label="Notifications"
                            onClick={() => setShowNotifs(!showNotifs)}
                        >
                            <Bell size={20} />
                            {unreadCount > 0 && (
                                <span className="header-notification-badge">{unreadCount}</span>
                            )}
                        </button>
                        
                        {/* Background fetcher/dropdown */}
                        {showNotifs ? (
                            <NotificationCenter 
                                isDropdown={true} 
                                onClose={() => setShowNotifs(false)} 
                                user={user}
                                onUnreadCount={setUnreadCount}
                            />
                        ) : (
                            <div style={{ display: 'none' }}>
                                <NotificationCenter 
                                    user={user}
                                    onUnreadCount={setUnreadCount}
                                />
                            </div>
                        )}
                    </div>
                )}
                <div 
                    className="header-avatar" 
                    onClick={() => onNavigate && onNavigate('profile')} 
                    style={{ cursor: 'pointer' }}
                    title="Profile Settings"
                >
                    <span>{userInitial}</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
