'use client'
import './Servicelocation.css';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Popup from './Popup';
import UpdateDeviceForm from './deviceform'; // Adjust the path and name as needed
import AddDeviceForm from './adddeviceform'; // Import AddDeviceForm
import EditServiceLocationForm from './EditServiceLocationForm';



import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'

const Servicelocation = () =>{
    const [sldata, setsldata] = useState(null);
    const [devicedata, setdevicedata] = useState(null);
    const SearchParams = useSearchParams();
    const search = SearchParams.get('servicelocationid');
    const [showPopup, setShowPopup] = useState(false);
    const [popupContent, setPopupContent] = useState('');
    const router = useRouter();

    const handleAddDevice = () => {
        setPopupContent(
            <AddDeviceForm 
                onClose={handleClosePopup} 
                onSubmit={handleAddDeviceSubmit}
            />
        );
        setShowPopup(true);
    };


    const handleAddDeviceSubmit = async (newDeviceData) => {
        // Step 1: Add new device
        const deviceResponse = await fetch('http://localhost:8000/SHEMS_v1/devicemanagers/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newDeviceData),
        });
    
        if (deviceResponse.ok) {
            // Assuming the response includes the added device's data
            const addedDevice = await deviceResponse.json();
    
            // Step 2: Map the new device to the service location
            const mappingData = {
                servicelocationid: search, // assuming 'search' contains the service location ID
                deviceid: addedDevice.deviceid, // or however you get the new device's ID
                active: true // or set based on your business logic
            };
    
            const mappingResponse = await fetch('http://localhost:8000/SHEMS_v1/servicelocationdevicemappings/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(mappingData),
            });
    
            if (mappingResponse.ok) {
                // Fetch updated device data or update state
                const updatedDevicesResponse = await fetch('http://localhost:8000/SHEMS_v1/devicemanagers/');
                if (updatedDevicesResponse.ok) {
                    const updatedDevices = await updatedDevicesResponse.json();
                    setdevicedata(updatedDevices);
                } else {
                    console.error('Failed to refresh device list');
                }
                handleClosePopup(); // Close the popup
            } else {
                console.error('Failed to map new device to service location');
            }
        } else {
            console.error('Failed to add new device');
        }
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
        setPopupContent(
            <EditServiceLocationForm 
                serviceLocationData={sldata} 
                onClose={handleClosePopup} 
                onSubmit={handleEditServiceLocationSubmit}
            />
        );
        setShowPopup(true);
    };

    const handleEditServiceLocationSubmit = async (updatedData) => {
        const servicelocationid = updatedData.servicelocationid.toString();
        const response = await fetch(`http://localhost:8000/SHEMS_v1/servicelocations/${updatedData.servicelocationid}/`, {
            method: 'PUT',
            body: updatedData,
        });
    
        if (response.ok) {
            const updatedServiceLocation = await response.json();
            setsldata(updatedServiceLocation);
            handleClosePopup();
        } else {
            console.error('Failed to update service location');
        }
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