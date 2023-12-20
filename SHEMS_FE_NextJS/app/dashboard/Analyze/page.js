"use client"
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import './Analyze.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';

const Analyze = () => {
    const [graph1Data, setGraph1Data] = useState(null);
    const [graph2Data, setGraph2Data] = useState(null);
    const [graph3Data, setGraph3Data] = useState(null);
    const [graph4Data, setGraph4Data] = useState(null);

    const searchParams = useSearchParams();
    const search = searchParams.get('userid');
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            if (search) {
                try {
                    const response = await fetch(`http://localhost:8000/SHEMS_v1/energy-usage/?userid=${search}`);
                    if (!response.ok) throw new Error('API request failed');
                    const data = await response.json();
                    setGraph1Data(data.energy_per_location);

                    const response2 = await fetch(`http://localhost:8000/SHEMS_v1/device-energy-usage/?userid=${search}`);
                    if (!response2.ok) throw new Error('API request failed');
                    const data2 = await response2.json();
                    setGraph2Data(data2.energy_per_device_type);

                    const response3 = await fetch(`http://localhost:8000/SHEMS_v1/energy-usage-over-time/?userid=${search}`);
                    if (!response3.ok) throw new Error('API request failed for energy usage over time');
                    const data3 = await response3.json();
                    setGraph3Data(data3.energy_over_time);

                    // Fetch data for Graph 4: Energy Prices by Zipcode
                    const response4 = await fetch(`http://localhost:8000/SHEMS_v1/energy-prices-by-zipcode/?userid=${search}`);
                    if (!response4.ok) throw new Error('API request failed for energy prices');
                    const data4 = await response4.json();
                    setGraph4Data(data4.prices_by_zipcode);
                    


                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        };

        fetchData();
    }, [search]);

    if (!graph1Data || !graph2Data) {
        return <div>Loading...</div>;
    }

    return (
        <div className='graphs-container' style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
        <div className='graph-container' >
        <h2 style={{ textAlign: 'center' }}>Energy Usage Per Location</h2>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={graph1Data}
                    margin={{
                        top: 20, right: 30, left: 20, bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="servicelocationid">
                        <Label value="Service Location ID" offset={-5} position="insideBottom" />
                    </XAxis>
                    <YAxis label={{ value: 'Energy Used (Units)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend verticalAlign="top" wrapperStyle={{ lineHeight: '20px' }} />
                    <Bar dataKey="energy_used" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
        <div className='graph-container' >
                <h2 style={{ textAlign: 'center' }}>Energy Usage Per Device Type</h2>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={graph2Data}
                        margin={{
                            top: 20, right: 30, left: 20, bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="type">
                            <Label value="Device Type" offset={-5} position="insideBottom" />
                        </XAxis>
                        <YAxis label={{ value: 'Energy Used (Units)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend verticalAlign="top" wrapperStyle={{ lineHeight: '40px' }} />
                        <Bar dataKey="energy_used" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className='graph-container' >
            <h2 style={{ textAlign: 'center' }}>Energy Usage Over Time</h2>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={graph3Data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total_energy" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>

        <div className='graph-container' >
            <h2 style={{ textAlign: 'center' }}>Energy Prices by Zipcode</h2>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={graph4Data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="zipcode" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="average_price" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
        </div>
        </div>
    );
};

export default Analyze;
