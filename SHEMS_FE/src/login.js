// src/Login.js
import React, { useState } from 'react';
import './Login.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoginError('');  // Reset login error

        try {
            const response = await fetch('http://localhost:8000/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Handle successful login here
                console.log('Login successful:', data);
                // You might want to save the token (if provided) and redirect the user
            } else {
                // Handle login errors (e.g., incorrect credentials)
                setLoginError(data.message || 'Login failed');
            }
        } catch (error) {
            // Handle network errors
            setLoginError('Network error');
            console.error('Login request failed:', error);
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Login</h2>
                {loginError && <p className="login-error">{loginError}</p>}
                <div className="form-group">
                    {/* Input fields */}
                </div>
                {/* ... rest of your form ... */}
            </form>
        </div>
    );
}

export default Login;
