import React, { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { api } from '../../../config/api';

const SalesDashboard = () => {
    const [monthlySales, setMonthlySales] = useState([]);
    const [yearlySales, setYearlySales] = useState({});

    useEffect(() => {
        const fetchMonthlySales = async () => {
            try {
                const response = await api.get('/api/sales/monthly'); // Adjust the endpoint as needed
                setMonthlySales(response.data);
            } catch (error) {
                console.error('Error fetching monthly sales data:', error);
            }
        };

        const fetchYearlySales = async () => {
            try {
                const response = await api.get('/api/sales/yearly'); // Adjust the endpoint as needed
                setYearlySales(response.data);
            } catch (error) {
                console.error('Error fetching yearly sales data:', error);
            }
        };

        fetchMonthlySales();
        fetchYearlySales();
    }, []);

    // Prepare the dataset for the Monthly BarChart
    const monthlyDataset = monthlySales.map((item) => ({
        month: item.monthName, // Use monthName for y-axis
        sales: Number(item.total), // Ensure total is treated as a number
    }));

    // Prepare the dataset for the Yearly BarChart
    const yearlyDataset = Object.keys(yearlySales).map((year) => ({
        year: year, // Use the year for x-axis
        sales: Number(yearlySales[year]), // Convert the value to a number
    }));

    const monthlyChartSetting = {
        xAxis: [
            {
                label: 'Sales Amount', // Label for sales on x-axis
                dataKey: 'sales', // Bind sales data
            },
        ],
        yAxis: [
            {
                label: 'Month', // Label for months on y-axis
                dataKey: 'month', // Bind month names to y-axis
                scaleType: 'band', // Band scale for months
            },
        ],
        width: 500,
        height: 400,
    };

    const yearlyChartSetting = {
        xAxis: [
            {
                label: 'Year', // Label for year on x-axis
                dataKey: 'year', // Bind year to x-axis
                scaleType: 'band', // Band scale for years
            },
        ],
        yAxis: [
            {
                label: 'Sales Amount', // Label for sales on y-axis
                dataKey: 'sales', // Bind sales data to y-axis
                scaleType: 'linear', // Linear scale for sales values
            },
        ],
        width: 500,
        height: 400,
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
            {/* Monthly Sales Chart */}
            <div style={{ flex: 1, marginRight: '10px' }}>
                <h2>Monthly Sales Dashboard</h2>
                {monthlyDataset.length > 0 ? (
                    <BarChart
                        dataset={monthlyDataset}
                        yAxis={[{ dataKey: 'month', scaleType: 'band' }]} // Map months to y-axis
                        xAxis={[{ dataKey: 'sales', label: 'Sales Amount' }]} // Map sales to x-axis
                        series={[{ dataKey: 'sales', label: 'Monthly Sales' }]}
                        layout="horizontal" // Horizontal layout for Monthly Sales
                        {...monthlyChartSetting}
                    />
                ) : (
                    <p>No monthly sales data available</p>
                )}
            </div>

            {/* Yearly Sales Chart */}
            <div style={{ flex: 1, marginLeft: '10px' }}>
                <h2>Yearly Sales Dashboard</h2>
                {yearlyDataset.length > 0 ? (
                    <BarChart
                        dataset={yearlyDataset}
                        xAxis={[{ dataKey: 'year', scaleType: 'band' }]} // Map years to x-axis
                        yAxis={[{ dataKey: 'sales', scaleType: 'linear', label: 'Sales Amount' }]} // Map sales to y-axis
                        series={[{ dataKey: 'sales', label: 'Yearly Sales' }]}
                        layout="vertical" // Vertical layout for Yearly Sales
                        {...yearlyChartSetting}
                    />
                ) : (
                    <p>No yearly sales data available</p>
                )}
            </div>
        </div>
    );
};

export default SalesDashboard;
