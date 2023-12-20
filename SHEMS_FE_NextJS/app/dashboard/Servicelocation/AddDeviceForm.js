import React, { useState } from 'react';

const AddDeviceForm = ({ onClose, onSubmit }) => {
    const [newDevice, setNewDevice] = useState({
        deviceid: '',
        type: '',
        modelno: ''
    });

    const handleChange = (e) => {
        setNewDevice({...newDevice, [e.target.name]: e.target.value});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(newDevice);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
                name="deviceid" 
                value={newDevice.deviceid} 
                onChange={handleChange} 
                placeholder="Device ID" 
            />
            <input 
                name="type" 
                value={newDevice.type} 
                onChange={handleChange} 
                placeholder="Type" 
            />
            <input 
                name="modelno" 
                value={newDevice.modelno} 
                onChange={handleChange} 
                placeholder="Model No" 
            />
            <button type="submit">Add Device</button>
        </form>
    );
};

export default AddDeviceForm;