import React, { useState } from 'react';

const AddServiceLocation = ({ onClose, onSubmit }) => {
    const [slData, setSlData] = useState({
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
        setSlData({ ...slData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(slData); // This function will make the actual API call to create the service location
        onClose(); // Close the popup after submission
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="addressline1" placeholder="Address Line 1" value={slData.addressline1} onChange={handleChange} required />
            <input type="text" name="addressline2" placeholder="Address Line 2" value={slData.addressline2} onChange={handleChange} />
            <input type="text" name="city" placeholder="City" value={slData.city} onChange={handleChange} />
            <input type="text" name="zipcode" placeholder="Zip Code" value={slData.zipcode} onChange={handleChange} required />
            <input type="text" name="takeover_date" placeholder="Takeover Date (YYYY-MM-DD)" value={slData.takeover_date} onChange={handleChange} required />
            <input type="text" name="sqft" placeholder="Square Feet" value={slData.sqft} onChange={handleChange} required />
            <input type="number" name="bedrooms" placeholder="Bedrooms" value={slData.bedrooms} onChange={handleChange} required />
            <input type="number" name="occupants" placeholder="Occupants" value={slData.occupants} onChange={handleChange} required />
            <input type="text" name="aptno" placeholder="Apartment Number" value={slData.aptno} onChange={handleChange} />
            <button type="submit">Add Service Location</button>
        </form>
    );
};

export default AddServiceLocation;
