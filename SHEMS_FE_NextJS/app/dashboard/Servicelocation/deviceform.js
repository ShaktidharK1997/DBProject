import React, { useState, useEffect } from 'react';


const UpdateDeviceForm = ({ deviceid, onClose, onSubmit }) => {
    const [deviceData, setDeviceData] = useState({
        deviceid: deviceid, // This should be non-editable if it's a primary key
        type: '',
        modelno: '',
    });

    // Load the existing data for the device when the component mounts
    // You will need to implement this API call
    useEffect(() => {
        const fetchData = async () => {
            // API call to fetch device data
            // Example: const response = await fetch(`/api/device/${deviceid}`);
            // setDeviceData(response.data);
            const response = await fetch(`http://localhost:8000/SHEMS_v1/devicemanagers/?deviceid=${deviceid}`);

            if(!response.ok) throw new Error('API request failed');
            const data = await response.json();
            setDeviceData(data[0]);
            
        };
        fetchData();
    }, [deviceid]);

    const handleChange = (e) => {
        setDeviceData({ ...deviceData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(deviceData); // This function will make the actual API call
        onClose(); // Close the popup after submission
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="type" placeholder="Type" value={deviceData.type} onChange={handleChange} required />
            <input type="text" name="modelno" placeholder="Model Number" value={deviceData.modelno} onChange={handleChange} required />
            <button type="submit">Update Device</button>
        </form>
    );
};
export default UpdateDeviceForm;