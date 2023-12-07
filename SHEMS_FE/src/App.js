import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './Register';
import CustomerDetails from './CustomerDetails';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Register />} />
                <Route path="/customer-details" element={<CustomerDetails />} />
            </Routes>
        </Router>
    );
}

export default App;
