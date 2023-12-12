'use client'
import React, { useState, useEffect } from 'react';
import './dashboard.css';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const Dashboard = () => {
  const [customerData, setCustomerData] = useState(null);
  const [slData, setslData] = useState(null);
  const searchParams = useSearchParams();
  const search = searchParams.get('userid');

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

  return (
    <div className = 'dashboard-container'>
      <div className = 'dashboard-info'>
        <h2>My Profile</h2>
        <img src='http://localhost:8000/media/profile_photos/vegetable_5uvUXEb.jpg'/>
        <p>First Name: {customerData.firstname}</p>
        <p>Last Name: {customerData.lastname}</p>
        <p>Business Address Line 1: {customerData.baline1}</p>
        <p>Business Address Line 2: {customerData.baline2}</p>
        <p>Phone Number: {customerData.phonenumber}</p>
        <p>Alternate Email: {customerData.email}</p>
      </div>
      <div className = 'dashboard-info'>
      <h2>Service Locations</h2>
      {slData && slData.map((item, index) => (
        <div key={index}>
          <p>
          Service Location ID: 
          <Link href={`/servicelocations/${item.servicelocationid}`}>
            {item.servicelocationid}
          </Link>
          </p>
          <p>Active: {item.active ? 'Yes' : 'No'}</p>
        </div>
      ))}
    </div>
    </div>
    
  );
};

export default Dashboard;
