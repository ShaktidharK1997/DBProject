import React, { useState } from 'react';

function CustomerDetails() {
    const [formData, setFormData] = useState({
        // initialize state for each form field
        firstname: '',
        lastname: '',
        baline1: '',
        baline2: '',
        phonenumber: '',
        email: ''
    });
    const [profilePhoto, setProfilePhoto] = useState(null);

    const handlePhotoChange = (event) => {
        setProfilePhoto(event.target.files[0]);
    };
    const [message, setMessage] = useState(''); 

    const handleInputChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }
        if (profilePhoto) {
            data.append('profilePhoto', profilePhoto);
        }

        try {
            const response = await fetch('http://localhost:8000/SHEMS_v1/customers/', {
                method: 'POST',
                body: data
            });

            if (response.ok) {
                // Handle success
                setMessage('Your data has been saved successfully!')
            } else {
                // Handle failure
                setMessage('Ohno! Something went wrong :(')
            }
        } catch (error) {
            // Handle error
            setMessage('Error: ' + error.message);
        }
    };

    return (
        <div>
            <h2>Enter Customer Details</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleInputChange}
                    placeholder="First Name"
                />
                <input 
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleInputChange}
                    placeholder="Last Name"
                />
                <input 
                    type="text"
                    name="baline1"
                    value={formData.baline1}
                    onChange={handleInputChange}
                    placeholder="Billing Address Line 1"
                />
                <input 
                    type="text"
                    name="baline2"
                    value={formData.baline2}
                    onChange={handleInputChange}
                    placeholder="Billing Address Line 2"
                />
                <input 
                    type="text"
                    name="phonenumber"
                    value={formData.phonenumber}
                    onChange={handleInputChange}
                    placeholder="Phone Number"
                />
                <input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                />
                <input 
                    type="file"
                    onChange={handlePhotoChange}
                />
                <button type="submit">Submit</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default CustomerDetails;