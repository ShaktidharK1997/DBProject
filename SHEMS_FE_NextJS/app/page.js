'use client'
// src/Login.js
import React, { useState } from 'react';
import './login.css';
import { useRouter } from 'next/navigation'
import Link from 'next/link';

function Login() {
    const router = useRouter()
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoginError('');  // Reset login error
        
    
        try {
            const response = await fetch('http://localhost:8000/SHEMS_v1/login/', {
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
                setLoginError('Login successful!');
    
                // Save the token to local storage or session storage
                localStorage.setItem('token', data.token); 
    
                // Redirect to dashboard
                router.push(`/dashboard?userid=${data.userid}`);
                // return <Link href="/dashboard/${data.customer.id}">Dashboard</Link>
            } else {
                // Handle login errors (e.g., incorrect credentials)
                console.error('Login failed:', data); // Log the error data for debugging
                setLoginError('Login failed. Please check your credentials.');
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
              <h2>Welcome to PowerTrack</h2>
              {loginError && <p className="login-error">{loginError}</p>}
              
              <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                      type="text"
                      id="username"
                      className="form-control"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      required
                  />
              </div>
  
              <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                      type="password"
                      id="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                  />
              </div>
  
              <button type="submit" className="submit-button">
                  Login
              </button>
              <p className="register-link">
                    New here? <Link href="/Register">Sign up</Link>
              </p>
          </form>
      </div>
  );
  
}

export default Login;
