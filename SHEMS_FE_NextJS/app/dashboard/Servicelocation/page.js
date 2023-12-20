'use client'
import './Servicelocation.css';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Popup from './Popup';
import UpdateDeviceForm from './deviceform'; // Adjust the path and name as needed


import React, { useState, useEffect } from 'react';


const Servicelocation = () =>{
    const [sldata, setsldata] = useState(null);
    const [devicedata, setdevicedata] = useState(null);
    const SearchParams = useSearchParams();
    const search = SearchParams.get('servicelocationid');
    const [showPopup, setShowPopup] = useState(false);
    const [popupContent, setPopupContent] = useState('');
    

    const handleAddDevice = () => {
        setPopupContent(<p>Add Device Form Here</p>);
        setShowPopup(true);
    };

    const handleUpdateDevice = (deviceid) => {
        setPopupContent(
            <UpdateDeviceForm 
                deviceid={deviceid} 
                onClose={handleClosePopup} 
                onSubmit={handleDeviceUpdateSubmit} 
            />
        );
        setShowPopup(true);
    };

    const handleDeviceUpdateSubmit = async (deviceData) => {
        // Implement your API call logic here to update the device
        // Example: await fetch('/api/update-device', { method: 'POST', body: JSON.stringify(deviceData) });
        const response = await fetch(`http://localhost:8000/SHEMS_v1/devicemanagers/${deviceData.deviceid}/`, {
                method: 'PUT',
                body: deviceData,
            });
            const data = await response.json();
            if (response.ok){
                // setMessage('You have successfully updated your profile!');
                // setIsRegistered(true);
            }
            else{
                console.log('Updated device data:', deviceData);
                // setMessage('Update failed, please try again later :(');
            }
        console.log('Updated device data:', deviceData);
        // Refresh your device list or update state as necessary
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setPopupContent(null);
    };

    useEffect(() =>{
        const fetchData = async() =>{
            if (search) { 
                try{
                    const response = await fetch(`http://localhost:8000/SHEMS_v1/servicelocations/?servicelocationid=${search}`)

                    if(!response.ok) throw new Error('API request failed');
                    const data = await response.json();
                    setsldata(data[0]);

                    const response2 = await fetch(`http://localhost:8000/SHEMS_v1/devicemanagers/?servicelocationid=${data[0].servicelocationid}`);
                    if (!response2.ok) console.error('API failed');
                    const data2 = await response2.json();
                    setdevicedata(data2);
                    console.log(devicedata);
                }
                catch(error){
                    console.error('Error fetching data:', error);
                }

            }
        };
        fetchData();
    }, [search]);

    if (!sldata) {
        return <div>Loading...</div>;
      }
    
      const handleEditServiceLocation = () => {
        router.push(`/dashboard/Profile?userid=${search}`); // Navigate to the Profile page
      };

    

      return(
        <div className = 'sl-container'>
            <div className = 'sl-info'>
                <h2>Service location :{sldata.servicelocationid}</h2>
                <p className='edit-servicelocation'>
                    <button onClick={handleEditServiceLocation}>Edit or Delete</button>
                </p>
                <p>Address: {sldata.addressline1} {sldata.addressline2}</p>
                <p>City: {sldata.city}</p>
                <p>Zipcode : {sldata.zipcode} </p>
                <p>Take-over date: {sldata.takeover_date}</p>
                <p>Sqft : {sldata.sqft}</p>
                <p>Bedrooms : {sldata.bedrooms}</p>
                <p>Occupants : {sldata.occupants}</p>
                <p>Aptno : {sldata.aptno}</p>
            </div>
            <div className = 'device-info'>
                <h2> My Devices</h2>
                {devicedata &&  devicedata.map((item,index)=>(
                    <div key={index}>
                        <p>
                            Device ID : {item.deviceid}
                            <button onClick={() => handleUpdateDevice(item.deviceid)}>Update/Delete</button>
                        </p>
                    </div>
                ))}
                <button onClick={handleAddDevice}>Add Device</button>
            </div>
        {showPopup && <Popup onClose={handleClosePopup}>{popupContent}</Popup>}
        </div>

      );
};

export default Servicelocation;