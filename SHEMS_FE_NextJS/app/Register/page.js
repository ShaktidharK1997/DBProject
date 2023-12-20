'use client'
import React, { useState } from 'react';
import './Register.css'; // CSS file for styling
import Link from 'next/link';



function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [baline1, setBaline1] = useState('');
    const [baline2, setBaline2] = useState('');
    const [phonenumber, setPhonenumber] = useState('');
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [Message, setMessage] = useState(false);
    const handlePhotoChange = (event) => {
        setProfilePhoto(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();


        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        formData.append('firstname',firstname);
        formData.append('lastname',lastname);
        formData.append('baline1',baline1);
        formData.append('baline2',baline2);
        formData.append('phonenumber',phonenumber);
        formData.append('profile_photo', profilePhoto);
        try {
            const response = await fetch('http://localhost:8000/SHEMS_v1/register/', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (response.ok){
                setMessage('Registration successful!');
                setIsRegistered(true);
            }
            else{
                setMessage('Registration failed. Please try again :(');
            }
        } catch (error) {
            setMessage('Error: ' + error.message);
        }
    };

    return (
        <div className="register-container">
            <form onSubmit={handleSubmit} className="register-form">
                <input 
                    id="username"
                    type="text"
                    className="register-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                />
    
                <input 
                    id="password"
                    type="password"
                    className="register-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
    
                <input 
                    id="firstname"
                    type="text"
                    className="register-control"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    placeholder="First Name"
                />

                <input 
                    id="lastname"
                    type="text"
                    className="register-control"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    placeholder="Last Name"
                />

                <input 
                    id="baline1"
                    type="text"
                    className="register-control"
                    value={baline1}
                    onChange={(e) => setBaline1(e.target.value)}
                    placeholder="Line 1"
                />

                {/*<label htmlFor="baline2">Business Address Line 2</label>*/}
                <input 
                    id="baline2"
                    type="text"
                    className="register-control"
                    value={baline2}
                    onChange={(e) => setBaline2(e.target.value)}
                    placeholder="Line 2"
                />

                {/*<label htmlFor="phonenumber">Phone number</label>*/}
                <input 
                    id="phonenumber"
                    type="text"
                    className="register-control"
                    value={phonenumber}
                    onChange={(e) => setPhonenumber(e.target.value)}
                    placeholder="Phone number"
                />
    
                {/*<label htmlFor="profilePhoto">Profile Photo</label>*/}
                <input 
                    id="profilePhoto"
                    type="file"
                    onChange={handlePhotoChange}
                />
    
                <button type="submit" className="register-button">Register</button>
            </form>
            <div className="api-response">
                {isRegistered && <Link href="/">Login</Link>}
            </div>
        </div>
    );
    
}

export default Register;