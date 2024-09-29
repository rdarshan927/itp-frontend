import React, { useEffect, useState } from 'react';
import { api } from '../../../config/api';

function FinancialDashboard() {
    // Set initial values for total cost and total sales
    const [totalCost, setTotalCost] = useState(0);  // Initialize to 0
    const [totalSales, setTotalSales] = useState(0);  // Initialize to 0
    const [loading, setLoading] = useState(true);  // Start loading as true
    const netIncome = totalSales - totalCost;  // Calculate net income based on sales and cost

    useEffect(() => {
        const fetchFinancialData = async () => {
            setLoading(true); // Set loading to true before fetching data
            try {
                const response = await api.get('/api/summary'); 
                console.log(response);
                // Check if response data is valid
                if (response.data) {
                    setTotalCost(response.data.totalCost || 0); // Use 0 if undefined
                    setTotalSales(response.data.totalSales || 0); // Use 0 if undefined
                }
            } catch (error) {
                console.error('Error fetching financial data:', error);
            } finally {
                setLoading(false); // Set loading to false after data fetch
            }
        };

        // Fetch data when component mounts
        fetchFinancialData();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Loading state
    }

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-500 p-6 rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold text-white">Total Sales</h1>
                    <p className="text-3xl font-bold text-white">Rs.{totalSales.toLocaleString()}</p>
                </div>
                <div className="bg-red-500 p-6 rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold text-white">Total Cost</h1>
                    <p className="text-3xl font-bold text-white">Rs.{totalCost.toLocaleString()}</p>
                </div>
                <div className={`p-6 rounded-lg shadow-lg ${netIncome >= 0 ? 'bg-green-500' : 'bg-red-500'}`}>
                    <h1 className="text-2xl font-bold text-white">Net Income</h1>
                    <p className="text-3xl font-bold text-white">Rs.{netIncome.toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
}

export default FinancialDashboard;
