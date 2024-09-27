import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';  // Importing chart.js

function BarChart() {
    const [chartData, setChartData] = useState({});

    // Fetch bar chart data from the backend
    const fetchBarChartData = async () => {
        try {
            const response = await fetch('/api/barchart'); // API endpoint from the backend
            const result = await response.json();

            if (result.success) {
                // Set the chart data using the response
                setChartData(result.data);
            }
        } catch (error) {
            console.error('Error fetching bar chart data:', error);
        }
    };

    useEffect(() => {
        // Fetch the bar chart data when the component mounts
        fetchBarChartData();
    }, []);

    return (
        <div>
            <h2>Inventory Bar Chart</h2>
            {chartData.labels ? (
                <Bar
                    data={chartData}
                    options={{
                        scales: {
                            y: {
                                beginAtZero: true, // Ensure y-axis starts at 0
                            },
                        },
                    }}
                />
            ) : (
                <p>Loading chart data...</p>
            )}
        </div>
    );
}

export default BarChart;
