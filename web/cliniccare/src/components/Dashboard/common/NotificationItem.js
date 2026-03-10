import React from "react";
import "./NotificationCenter.css";

const typeIcon = {
    reminder: "💊",
    alert: "⚠️",
    update: "📋",
    info: "ℹ️",
};

const typeClass = {
    reminder: "notif-type--reminder",
    alert: "notif-type--alert",
    update: "notif-type--update",
    info: "notif-type--info",
};

const NotificationItem = ({ notification }) => {
    return (
        <div className={`notif-item ${notification.read ? "notif-item--read" : ""}`}>
            <div className={`notif-icon ${typeClass[notification.type]}`}>
                {typeIcon[notification.type]}
            </div>
            <div className="notif-content">
                <h4 className="notif-title">{notification.title}</h4>
                <p className="notif-message">{notification.message}</p>
                <span className="notif-time">{notification.time}</span>
            </div>
            {!notification.read && <span className="notif-dot" />}
        </div>
    );
};

export default NotificationItem;
