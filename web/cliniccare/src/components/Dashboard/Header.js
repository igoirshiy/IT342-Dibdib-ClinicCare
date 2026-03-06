import React from "react";
import "./Header.css";
import { Bell } from "lucide-react";

const Header = () => {
    return (
        <header className="header">
            <div className="header-welcome">
                <h2>Welcome back, <span className="header-name">Patient</span></h2>
                <p className="header-subtitle">Here's your health overview</p>
            </div>
            <div className="header-actions">
                <button className="header-notification" aria-label="Notifications">
                    <Bell size={20} />
                    <span className="header-notification-badge">3</span>
                </button>
                <div className="header-avatar">
                    <span>P</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
