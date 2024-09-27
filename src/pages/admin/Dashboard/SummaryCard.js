import React, { useEffect, useState } from 'react';
import axios from 'axios';

function FinancialDashboard() {
    // Set temporary values for total revenue and total expenses
    const [totalRevenue, setTotalRevenue] = useState(5000000);  // Example: Rs. 5,000,000
    const [totalExpenses, setTotalExpenses] = useState(2000000);  // Example: Rs. 2,000,000
    const [loading, setLoading] = useState(false);  // No need to show loading for temp values
    const netIncome = totalRevenue - totalExpenses;

    useEffect(() => {
        const fetchFinancialData = async () => {
            try {
                const response = await axios.get('/api/financial-data'); 
                setTotalRevenue(response.data.totalRevenue);
                setTotalExpenses(response.data.totalExpenses);
            } catch (error) {
                console.error('Error fetching financial data:', error);
            } finally {
                setLoading(false);
            }
        };

        // Uncomment the following line to fetch data when ready
        // fetchFinancialData();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Loading state
    }

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-500 p-6 rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold text-white">Total Revenue</h1>
                    <p className="text-3xl font-bold text-white">Rs.{totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-red-500 p-6 rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold text-white">Total Expenses</h1>
                    <p className="text-3xl font-bold text-white">Rs.{totalExpenses.toLocaleString()}</p>
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
