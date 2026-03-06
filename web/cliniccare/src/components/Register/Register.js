import React, { useState } from 'react';
import './Register.css';

const Register = ({ onSwitchToLogin, onRegisterSuccess }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validate = () => {
        let newErrors = {};
        if (!formData.fullName) newErrors.fullName = 'Full Name is required';
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length === 0) {
            try {
                const response = await fetch('http://localhost:8080/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        fullName: formData.fullName,
                        email: formData.email,
                        password: formData.password
                    }),
                });

                if (response.ok) {
                    if (onRegisterSuccess) {
                        onRegisterSuccess();
                    } else {
                        alert('Registration Successful!');
                        onSwitchToLogin();
                    }
                } else {
                    const errorText = await response.text();
                    alert('Registration Failed: ' + errorText);
                }
            } catch (error) {
                console.error('Error during registration:', error);
                alert('An error occurred. Please try again later.');
            }
        } else {
            setErrors(validationErrors);
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h1>ClinicCare</h1>
                <p className="subtitle">Join our community today</p>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        <label htmlFor="fullName">Full Name</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            placeholder="John Doe"
                            value={formData.fullName}
                            onChange={handleChange}
                            className={errors.fullName ? 'error' : ''}
                        />
                        {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? 'error' : ''}
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            className={errors.password ? 'error' : ''}
                        />
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={errors.confirmPassword ? 'error' : ''}
                        />
                        {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                    </div>

                    <button type="submit" className="register-button">Create Account</button>
                </form>
                <p className="login-link">
                    Already have an account? <a href="#login" onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }}>Login</a>
                </p>
            </div>
        </div>
    );
};

export default Register;
