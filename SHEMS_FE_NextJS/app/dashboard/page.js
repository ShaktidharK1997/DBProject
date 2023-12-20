'use client'
import React, { useState, useEffect } from 'react';
import './dashboard.css';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation'
import Link from 'next/link';
import AddServiceLocation from './servicelocationform'; 
import Popup from './popup';


const Dashboard = () => {
  const [customerData, setCustomerData] = useState(null);
  const [slData, setslData] = useState(null);
  const searchParams = useSearchParams();
  const search = searchParams.get('userid');
  const router = useRouter();
  const [showCreateLocationPopup, setShowCreateLocationPopup] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      if (search) {
        try {
          const response = await fetch(`http://localhost:8000/SHEMS_v1/customers/?user=${search}`);
          
          if (!response.ok) throw new Error('API request failed');
          const data = await response.json();
          setCustomerData(data[0]);

          const response2 = await fetch(`http://localhost:8000/SHEMS_v1/servicelocations/?userid=${data[0].userid}`);
          if (!response2.ok) console.error('API failed');
          const data2 = await response2.json();
          setslData(data2);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
      
    };

    fetchData();

  }, []);

  if (!customerData) {
    return <div>Loading...</div>;
  }

  const handleAnalyzeData = (userid) => {
    router.push(`/dashboard/Analyze?userid=${userid}`);
  };

  const handleEditProfile = () => {
    router.push(`/dashboard/Profile?userid=${search}`); // Navigate to the Profile page
  };

  const navigateToServiceLocation = (servicelocationid) => {
    router.push(`/dashboard/Servicelocation?servicelocationid=${servicelocationid}`); 
  }

  const handleCreateSLPopup = () => {
    setShowCreateLocationPopup(true);
  };

    const handleCreateServiceLocationSubmit = async (newServiceLocationData) => {
      try {
          const response = await fetch('http://localhost:8000/SHEMS_v1/servicelocations/', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(newServiceLocationData),
          });
  
          if (!response.ok) throw new Error('Failed to create service location');

          const createdLocation = await response.json(); 

          const customerServiceLocationData = {
            userid: customerData.userid, // assuming customerData contains the userid
            servicelocationid: createdLocation.servicelocationid, // replace 'id' with the actual ID field from your response
            active: true,
          };
          console.log(customerServiceLocationData);
          const response2 = await fetch('http://localhost:8000/SHEMS_v1/customerservicelocations/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(customerServiceLocationData),
          });

          if (!response2.ok) throw new Error('Failed to link service location with user');

          const createdLocationmapping = await response.json(); 

          // Handle success - maybe close the popup and refresh the service locations list
          setShowCreateLocationPopup(false);
          // Fetch service locations again to update the list
          // ... (fetch and update service location data)
      } catch (error) {
          console.error('Error creating service location:', error);
          // Handle error - show message to the user
      }
    };
  
  return (
    <div className = 'dashboard-container'>
      <div className = 'dashboard-info'>
        <h2>My Profile</h2>
        <button className="analyze-button" onClick={() => handleAnalyzeData(customerData.userid)} style={{ alignSelf: 'flex-start' }}>Analyze your data</button>
        <img src={customerData.profile_photo}style={{ width: '200px', height: '200px', objectFit: 'cover' }}/>
        <p className="edit-profile">
          <button onClick={handleEditProfile}>Update Profile</button>
        </p>
        <p>First Name: {customerData.firstname}</p>
        <p>Last Name: {customerData.lastname}</p>
        <p>Business Address: {customerData.baline1} , {customerData.baline2}</p>
        <p>Phone Number: {customerData.phonenumber}</p>
        {/* <p>Alternate Email: {customerData.email}</p> */}
      </div>
      <div className = 'dashboard-info'>
      <h2>My Service Locations</h2>
      <button className="createsl-button" onClick={handleCreateSLPopup} style={{ marginLeft: 'auto' }}>
      Add Service Location
      </button>
      {slData && slData.map((item, index) => (
        <div key={index}>
          <p>
          Service Location: 
          <span onClick={() => navigateToServiceLocation(item.servicelocationid)} style={{ cursor: 'pointer' }}>
        {item.servicelocationid}
        </span>
          </p>
          {/* <p>Active: {item.active ? 'Yes' : 'No'}</p> */}
        </div>
      ))}
    </div>
    {showCreateLocationPopup && (
  <Popup onClose={() => setShowCreateLocationPopup(false)}>
    <AddServiceLocation 
      onSubmit={handleCreateServiceLocationSubmit} 
      onClose={() => setShowCreateLocationPopup(false)} 
    />
  </Popup>
)}
    </div>
    
  );
};

export default Dashboard;
