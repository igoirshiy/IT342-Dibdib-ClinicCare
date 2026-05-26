import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import './Login.css';

const Login = ({ onSwitchToRegister, onLogin }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
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
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.password) newErrors.password = 'Password is required';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length === 0) {
            try {
                const response = await fetch((process.env.REACT_APP_API_URL || (process.env.REACT_APP_API_URL || "http://127.0.0.1:8080") + "") + '/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password
                    }),
                });

                if (response.ok) {
                    const userData = await response.json();
                    if (onLogin) onLogin(userData);
                } else {
                    const errorText = await response.text();
                    alert('Login Failed: ' + errorText);
                }
            } catch (error) {
                console.error('Error during login:', error);
                alert('An error occurred. Please try again later.');
            }
        } else {
            setErrors(validationErrors);
        }
    };

    return (
        <div className="login-screen">
            <div className="login-card">
                <div className="login-header">
                    <h1>ClinicCare</h1>
                    <p>Welcome back</p>
                </div>
                <form className="login-form" onSubmit={handleSubmit} noValidate>
                    <div className="form-fields">
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                className={errors.email ? 'input-error' : ''}
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
                                className={errors.password ? 'input-error' : ''}
                            />
                            {errors.password && <span className="error-message">{errors.password}</span>}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="login-button"
                        >
                            Login
                        </button>
                    </div>
                </form>
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                    <GoogleLogin
                        onSuccess={async (credentialResponse) => {
                            try {
                                const response = await fetch((process.env.REACT_APP_API_URL || (process.env.REACT_APP_API_URL || "http://127.0.0.1:8080") + "") + '/api/auth/google-login', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        idToken: credentialResponse.credential
                                    }),
                                });
                                if (response.ok) {
                                    const userData = await response.json();
                                    if (onLogin) onLogin(userData);
                                } else {
                                    alert('Google Login Failed on server');
                                }
                            } catch (error) {
                                console.error('Error during Google login:', error);
                            }
                        }}
                        onError={() => {
                            console.log('Google Login Failed');
                        }}
                    />
                </div>
                <div className="login-footer">
                    <p>
                        Don't have an account? <a href="#register" onClick={(e) => { e.preventDefault(); onSwitchToRegister(); }}>Register</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
