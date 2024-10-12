import React, { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart'; // Import the PieChart from MUI X Charts
import { api } from '../../../config/api';
import jsPDF from 'jspdf'; // Import jsPDF
import autoTable from 'jspdf-autotable'; // Import autoTable for tables in PDF
import signatureImage from '../../../assests/signature.png'

const SalesDashboard = () => {
    const [monthlySales, setMonthlySales] = useState([]);
    const [yearlySales, setYearlySales] = useState({});
    const [customerData, setCustomerData] = useState({ totalPreviousCustomers: 0, newCustomersThisMonth: 0 });

    useEffect(() => {
        const fetchMonthlySales = async () => {
            try {
                const response = await api.get('/api/sales/monthly');
                setMonthlySales(response.data);
            } catch (error) {
                console.error('Error fetching monthly sales data:', error);
            }
        };

        const fetchYearlySales = async () => {
            try {
                const response = await api.get('/api/sales/yearly');
                setYearlySales(response.data);
            } catch (error) {
                console.error('Error fetching yearly sales data:', error);
            }
        };

        const fetchCustomerData = async () => {
            try {
                const response = await api.get('/api/sales/customerarrival');
                setCustomerData(response.data);
            } catch (error) {
                console.error('Error fetching customer data:', error);
            }
        };

        fetchMonthlySales();
        fetchYearlySales();
        fetchCustomerData();
    }, []);

    // Prepare the dataset for the Monthly BarChart
    const monthlyDataset = monthlySales.map((item) => ({
        month: item.monthName,
        sales: Number(item.total),
    }));

    // Prepare the dataset for the Yearly BarChart
    const yearlyDataset = Object.keys(yearlySales).map((year) => ({
        year: year,
        sales: Number(yearlySales[year]),
    }));

    const monthlyChartSetting = {
        xAxis: [
            {
                label: 'Sales Amount',
                dataKey: 'sales',
            },
        ],
        yAxis: [
            {
                label: 'Month',
                dataKey: 'month',
                scaleType: 'band',
            },
        ],
        width: 500,
        height: 400,
    };

    const yearlyChartSetting = {
        xAxis: [
            {
                label: 'Year',
                dataKey: 'year',
                scaleType: 'band',
            },
        ],
        yAxis: [
            {
                label: 'Sales Amount',
                dataKey: 'sales',
                scaleType: 'linear',
            },
        ],
        width: 500,
        height: 400,
    };

    // Prepare Pie Chart data
    const pieChartData = [
        { id: 0, value: customerData.totalPreviousCustomers, label: 'Previous Customers' },
        { id: 1, value: customerData.newCustomersThisMonth, label: 'New Customers' },
    ];

    // Function to generate PDF report
    const generateReport = () => {
        const doc = new jsPDF();

        // Add Business Heading
        // Add Business Heading (Centered)
        const heading = 'Shepora Flowers';
        doc.setFontSize(22);
        const headingWidth = doc.getStringUnitWidth(heading) * doc.internal.getFontSize() / doc.internal.scaleFactor; // Calculate the width of the heading
        const pageWidth = doc.internal.pageSize.getWidth(); // Get the page width
        const x = (pageWidth - headingWidth) / 2; // Calculate x position for centering
        doc.text(heading, x, 20); // Centered text
        // doc.setFontSize(18);
        // doc.text('Shepora Flowers', 14, 20);
        
        // Add Title
        doc.setFontSize(16);
        doc.text('Sales Dashboard Report', 14, 30);

        // Add Monthly Sales Table
        doc.setFontSize(14);
        doc.text('Monthly Sales Data', 14, 40);
        autoTable(doc, {
            head: [['Month', 'Sales Amount']],
            body: monthlyDataset.map(item => [item.month, 'Rs ' + item.sales]),
            startY: 45,
            columnStyles: {
            0: { cellWidth: 60 }, // Width for the 'Year' column
            1: { cellWidth: 100 }, // Width for the 'Sales Amount' column
        },
        });

        // Add Yearly Sales Table
        doc.text('Yearly Sales Data', 14, doc.lastAutoTable.finalY + 10);
        autoTable(doc, {
            head: [['Year', 'Sales Amount']],
            body: yearlyDataset.map(item => [item.year, 'Rs ' + item.sales]),
            startY: doc.lastAutoTable.finalY + 15,
            columnStyles: {
            0: { cellWidth: 60 }, // Width for the 'Year' column
            1: { cellWidth: 100 }, // Width for the 'Sales Amount' column
        },
        });

        // Add Customer Comparison
        doc.text('Customer Comparison', 14, doc.lastAutoTable.finalY + 10);
        autoTable(doc, {
            head: [['Customer Type', 'Count']],
            body: [
                ['Previous Customers', customerData.totalPreviousCustomers],
                ['New Customers This Month', customerData.newCustomersThisMonth],
            ],
            startY: doc.lastAutoTable.finalY + 15,
            columnStyles: {
            0: { cellWidth: 60 }, // Width for the 'Year' column
            1: { cellWidth: 100 }, // Width for the 'Sales Amount' column
        },
        });

        // Add Signature Placeholder
        const signatureY = doc.lastAutoTable.finalY + 20; // Position for signature
        doc.text('Authorized by Sales Manager:', 14, signatureY);

        // Assuming you have the image data (base64 or URL)
        // const signatureImage = 'data:image/png;base64,...'; // Replace with your image data
        const signatureWidth = 50; // Width for the signature image
        const signatureHeight = 20; // Height for the signature image

        // Add the signature image below the text
        doc.addImage(signatureImage, 'PNG', 14, signatureY + 5, signatureWidth, signatureHeight);

        // Save the PDF
        doc.save('sales-dashboard-report.pdf');
    };


    return (
        <div style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
            {/* Button to generate report */}
            <button onClick={generateReport} style={{ marginBottom: '20px', padding: '10px', cursor: 'pointer' }}>
                Generate PDF Report
            </button>
            
            {/* Container for the Bar Charts (Monthly and Yearly) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                {/* Monthly Sales Chart */}
                <div style={{ flex: 1, marginRight: '10px' }}>
                    <h2>Monthly Sales Dashboard</h2>
                    {monthlyDataset.length > 0 ? (
                        <BarChart
                            dataset={monthlyDataset}
                            yAxis={[{ dataKey: 'month', scaleType: 'band' }]}
                            xAxis={[{ dataKey: 'sales', label: 'Sales Amount' }]}
                            series={[{ dataKey: 'sales', label: 'Monthly Sales' }]}
                            layout="horizontal"
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
                            xAxis={[{ dataKey: 'year', scaleType: 'band' }]}
                            yAxis={[{ dataKey: 'sales', scaleType: 'linear', label: 'Sales Amount' }]}
                            series={[{ dataKey: 'sales', label: 'Yearly Sales' }]}
                            layout="vertical"
                            {...yearlyChartSetting}
                        />
                    ) : (
                        <p>No yearly sales data available</p>
                    )}
                </div>
            </div>

            {/* Pie Chart for Customer Comparison (Below the Bar Charts) */}
            <div style={{ flex: 1, marginTop: '20px' }}>
                <h2>Customer Comparison</h2>
                <PieChart
                    series={[
                        {
                            data: pieChartData,
                            labelPosition: 'outside',  // Positioning the label outside the pie
                            labelOffset: 15,           // Adjusting the space between pie and label
                            labelStyle: { fontSize: 14, fontWeight: 'bold', fill: '#333' }, // Custom label style
                        },
                    ]}
                    width={400}
                    height={200}
                />
            </div>
        </div>
    );
};

export default SalesDashboard;
