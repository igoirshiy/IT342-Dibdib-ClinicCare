import React, { useState } from 'react';
import { User, Mail, Lock, Save, AlertCircle, CheckCircle } from 'lucide-react';
import './ProfileView.css';

const ProfileView = ({ user, onUpdate }) => {
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        password: '',
        confirmPassword: '',
        age: user?.age || '',
        gender: user?.gender || ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });

        if (formData.password && formData.password !== formData.confirmPassword) {
            setStatus({ type: 'error', message: 'Passwords do not match!' });
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                ...user,
                fullName: formData.fullName,
                email: formData.email,
                age: formData.age,
                gender: formData.gender,
                role: user.role || 'PATIENT'
            };
            if (formData.password) {
                payload.password = formData.password;
            }

            const response = await fetch(`http://127.0.0.1:8080/api/users/profile/${user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setStatus({ type: 'success', message: 'Profile updated successfully!' });
                if (onUpdate) onUpdate(updatedUser);
                setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
            } else {
                const errorText = await response.text();
                setStatus({ type: 'error', message: errorText });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Network error: ' + error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="profile-view-container animate-fade-in">
            <div className="glass-card profile-card">
                <div className="profile-header">
                    <div className="avatar-large">
                        {user?.fullName?.charAt(0).toUpperCase() || 'P'}
                    </div>
                    <div className="profile-header-text">
                        <h2>Personal Profile</h2>
                        <p>Manage your account settings and credentials</p>
                    </div>
                </div>

                {status.message && (
                    <div className={`status-alert ${status.type}`}>
                        {status.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
                        <span>{status.message}</span>
                    </div>
                )}

                <form className="profile-form" onSubmit={handleSubmit}>
                    <div className="profile-sections-grid">
                        <div className="profile-section-card glass-card">
                            <div className="section-header">
                                <User size={20} />
                                <h3>General Information</h3>
                            </div>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    required
                                    placeholder="Enter your full name"
                                />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    placeholder="yourname@example.com"
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Age</label>
                                    <input
                                        type="number"
                                        value={formData.age}
                                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                        placeholder="e.g. 25"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Gender</label>
                                    <select
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    >
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="profile-section-card glass-card">
                            <div className="section-header">
                                <Lock size={20} />
                                <h3>Security Settings</h3>
                            </div>
                            <p className="section-note">Update your password to keep your account secure.</p>
                            <div className="form-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter new password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirm New Password</label>
                                <input
                                    type="password"
                                    placeholder="Repeat new password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                />
                            </div>
                            <div className="security-info">
                                <AlertCircle size={14} />
                                <span>Leave blank to keep your current password.</span>
                            </div>
                        </div>
                    </div>

                    <div className="form-footer-sticky">
                        <button type="submit" className="btn-primary save-profile-btn" disabled={isSubmitting}>
                            {isSubmitting ? <span className="loader-small"></span> : <Save size={18} />}
                            {isSubmitting ? 'Saving Changes...' : 'Save Profile Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileView;
