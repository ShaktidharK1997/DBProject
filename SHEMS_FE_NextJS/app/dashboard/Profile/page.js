'use client'
import './profile.css';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import React, { useState, useEffect } from 'react';

const Profile = () => {

    const [customerData, setCustomerData] = useState({
        firstname: '',
        lastname: '',
        baline1: '',
        baline2: '',
        phonenumber: '',
        email: '',
        profile_photo: ''
    });
    const [isRegistered, setIsRegistered] = useState(false);
    const [originalData, setOriginalData] = useState({});
    const [message, setMessage] = useState('');
    const searchParams = useSearchParams();
    const search = searchParams.get('userid');
    const router = useRouter();


    useEffect(() => {
        // Fetch the customer data for editing
        const fetchData = async () => {
        try {
            const response = await fetch(`http://localhost:8000/SHEMS_v1/customers/?user=${search}`);
            if (!response.ok) throw new Error('API request failed');
            const data = await response.json();
            setCustomerData(data[0]);
            setOriginalData(data[0]); // Save original data for possible revert
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        };

        if (search) {
        fetchData();
        }
    }, [search]);

    const handleChange = (e) => {
        if (e.target.name === 'profile_photo') {
            setCustomerData({ ...customerData, profile_photo: e.target.files[0] });
        } else {
            setCustomerData({ ...customerData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Prepare the form data
        const formData = new FormData();
        formData.append('firstname', customerData.firstname);
        formData.append('lastname', customerData.lastname);
        formData.append('baline1', customerData.baline1);
        formData.append('baline2', customerData.baline2);
        formData.append('phonenumber', customerData.phonenumber);
        formData.append('email', customerData.email);

        console.log("Sending data to server:", customerData);
    
        // Include the profile photo only if it has been changed
        if (customerData.profile_photo instanceof File) {
            formData.append('profile_photo', customerData.profile_photo);
        }
    
        try {
            const response = await fetch(`http://localhost:8000/SHEMS_v1/customers/${customerData.userid}/`, {
                method: 'PUT',
                body: formData,
            });
    
            if (response.ok) {
                setMessage('You have successfully updated your profile!');
                setIsRegistered(true);
                localStorage.setItem('profileUpdated', 'true');
                //router.push('/dashboard');  // Redirect to the dashboard
            } else {
                setMessage('Update failed, please try again later.');
            }
        } catch (error) {
            setCustomerData(originalData);
            setMessage(`Error: ${error.message}`);
        }
    };

    const handleBackButtonClick = () => {
        router.back(); // This will take the user to the previous page
    };

    return (
        <div className='edit-profile-container'>
        <h1>Edit Profile</h1>
        <form onSubmit={handleSubmit}>
            <input type="file" name="profile_photo" onChange={handleChange} />  
            <input type="text" name="firstname" value={customerData.firstname} onChange={handleChange} placeholder="First Name" />
            <input type="text" name="lastname" value={customerData.lastname} onChange={handleChange} placeholder="Last Name" />
            <input type="text" name="baline1" value={customerData.baline1} onChange={handleChange} placeholder="Business Address Line 1" />
            <input type="text" name="baline2" value={customerData.baline2} onChange={handleChange} placeholder="Business Address Line 2" />
            <input type="text" name="phonenumber" value={customerData.phonenumber} onChange={handleChange} placeholder="Phone Number" />
            <input type="text" name="email" value={customerData.email} onChange={handleChange} placeholder="Email" />
            
            <button type="submit">Save Changes</button>
            <button type="button" onClick={handleBackButtonClick}>Back</button>
        </form>
        {/*<div className="api-response">
                {isRegistered && <Link href="/dashboard">Login</Link>}
    </div>*/}
        </div>
        
    );
};

export default Profile;
