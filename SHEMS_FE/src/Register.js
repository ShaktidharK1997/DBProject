import React, { useState } from 'react';
import './Register.css'; // CSS file for styling
import logo from './images/logo.png'; // Path to your logo image
import { useNavigate } from 'react-router-dom';

function Register() {
    const history = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/SHEMS_v1/register/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (response.ok){
                setMessage('Registration successful!')
                history.push('/customer-details');
            }
            else{
                setMessage('Registration failed. Please try again :(')
            }
        } catch (error) {
            setMessage('Error: ' + error.message);
        }
    };

    return (
        <div className="register-container">
            <header className="register-header">
                <img src={logo} alt="Standard Electric Logo" className="logo" />
                <h1>Standard Electric</h1>
            </header>
            <form onSubmit={handleSubmit} className="register-form">
                <label htmlFor="username">Username</label>
                <input 
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                />
                <label htmlFor="password">Password</label>
                <input 
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <button type="submit">Register</button>
            </form>
            <div className="api-response">{message}</div>
        </div>
    );
}

export default Register;