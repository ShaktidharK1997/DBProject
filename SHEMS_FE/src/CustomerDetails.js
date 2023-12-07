// src/CustomerDetails.js
import React, { useState, useEffect } from 'react';
import './CustomerDetails.css'; // Import the CSS file

function CustomerDetails() {
    const [customer, setCustomer] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8000/api/customers/1/')  // Replace with your API URL and the desired customer ID
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setCustomer(data);
                setIsLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }

    return (
        <div className="customer-details">
            {customer ? (
                <div>
                    <h2>Customer Details</h2>
                    <p><strong>ID:</strong> {customer.userid}</p>
                    <p><strong>Name:</strong> {customer.firstname} {customer.lastname}</p>
                    <p><strong>Email:</strong> {customer.email}</p>
                    {/* Add more fields as needed */}
                </div>
            ) : (
                <div>No customer data</div>
            )}
        </div>
    );
}

export default CustomerDetails;