import React, { useState } from 'react';

const AddServiceLocation = ({ onClose, onSubmit }) => {
    const [serviceLocation, setServiceLocation] = useState({
        servicelocationid: '',
        addressline1: '',
        addressline2: '',
        city: '',
        zipcode: '',
        takeover_date: '',
        sqft: '',
        bedrooms: '',
        occupants: '',
        aptno: ''
    });

    const handleChange = (e) => {
        setServiceLocation({ ...serviceLocation, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(serviceLocation); // This function will make the actual API call to create the service location
        onClose(); // Close the popup after submission
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit} className="service-location-form">
            <label>
                    servicelocationid:
                    <input 
                        type="text" 
                        name="servicelocationid" 
                        value={serviceLocation.servicelocationid} 
                        onChange={handleChange} 
                        required 
                    />
                </label>
                <label>
                    Address Line 1:
                    <input 
                        type="text" 
                        name="addressline1" 
                        value={serviceLocation.addressline1} 
                        onChange={handleChange} 
                        required 
                    />
                </label>
                <label>
                    Address Line 2:
                    <input 
                        type="text" 
                        name="addressline2" 
                        value={serviceLocation.addressline2} 
                        onChange={handleChange} 
                    />
                </label>
                <label>
                    City:
                    <input 
                        type="text" 
                        name="city" 
                        value={serviceLocation.city} 
                        onChange={handleChange} 
                    />
                </label>
                <label>
                    Zip Code:
                    <input 
                        type="text" 
                        name="zipcode" 
                        value={serviceLocation.zipcode} 
                        onChange={handleChange} 
                        required 
                    />
                </label>
                <label>
                    Takeover Date (YYYY-MM-DD):
                    <input 
                        type="date" 
                        name="takeover_date" 
                        value={serviceLocation.takeover_date} 
                        onChange={handleChange} 
                        required 
                    />
                </label>
                <label>
                    Square Feet:
                    <input 
                        type="text" 
                        name="sqft" 
                        value={serviceLocation.sqft} 
                        onChange={handleChange} 
                        required 
                    />
                </label>
                <label>
                    Bedrooms:
                    <input 
                        type="number" 
                        name="bedrooms" 
                        value={serviceLocation.bedrooms} 
                        onChange={handleChange} 
                        required 
                    />
                </label>
                <label>
                    Occupants:
                    <input 
                        type="number" 
                        name="occupants" 
                        value={serviceLocation.occupants} 
                        onChange={handleChange} 
                        required 
                    />
                </label>
                <label>
                    Apartment Number:
                    <input 
                        type="text" 
                        name="aptno" 
                        value={serviceLocation.aptno} 
                        onChange={handleChange} 
                    />
                </label>
                <button type="submit" className="submit-button">Add Service Location</button>
            </form>
            <button onClick={onClose} className="close-button">Close</button>
        </div>
    );
};

export default AddServiceLocation;
