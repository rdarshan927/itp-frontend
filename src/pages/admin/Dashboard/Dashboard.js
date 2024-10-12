import React, { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { api } from '../../../config/api';
import { Card, CardContent, Typography, Button } from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import signatureImage from '../../../assests/signature.png'; // Add the signature image

const FinancialDashboardWithChart = () => {
  // States for financial data
  const [totalCost, setTotalCost] = useState(0); 
  const [totalSales, setTotalSales] = useState(0); 
  const [loading, setLoading] = useState(true); 

  // States for bar chart data
  const [labels, setLabels] = useState([]); 
  const [data, setData] = useState([]); 

  const netIncome = totalSales - totalCost;
  const image = ""

  useEffect(() => {
    const fetchFinancialData = async () => {
      setLoading(true); 
      try {
        const response = await api.get('/api/summary'); 
        if (response.data) {
          setTotalCost(response.data.totalCost || 0); 
          setTotalSales(response.data.totalSales || 0); 
        }
      } catch (error) {
        console.error('Error fetching financial data:', error);
      } finally {
        setLoading(false); 
      }
    };

    const fetchBarChartData = async () => {
      try {
        const response = await api.get('/api/barchart'); 
        const { labels, datasets } = response.data.data;
        setLabels(labels);
        setData(datasets[0].data); 
      } catch (error) {
        console.error('Error fetching bar chart data:', error);
      }
    };

    fetchFinancialData();
    fetchBarChartData();
  }, []);

  if (loading) {
    return <div>Loading...</div>; 
  }

  const chartSetting = {
    yAxis: [
      {
        label: 'Total Price Rs.',
        valueFormatter: (value) => (value === 0 ? '0' : `${(value / 1000).toFixed(0)}k`), 
      },
    ],
    series: [{ dataKey: 'totalPrice', label: 'Total Price' }],
    height: 300,
    sx: {
      [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
        transform: 'translateX(-10px)',
      },
    },
  };

  // Function to generate PDF with logo, description, and financial summary
  const handleDownload = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Add centered company logo
    doc.setFontSize(22);
    doc.setTextColor('#75A47F');  // Logo color
    doc.text('Sephora Flowers', pageWidth / 2, 20, { align: 'center' });

    // Add a matching description under the logo
    doc.setFontSize(12);
    doc.setTextColor(100); // Gray description color
    doc.text('Delivering beauty and elegance in every petal.', pageWidth / 2, 30, { align: 'center' });

    // Draw a horizontal line
    doc.setDrawColor(150); // Light gray line
    doc.line(10, 35, pageWidth - 10, 35); // Horizontal line from left to right

    // Add company information below the line
    doc.setFontSize(12);
    doc.setTextColor(0); // Black color for information text
    doc.text('Contact: 0777-894523 | Email: sephoraflowers@gmail.com', 10, 45);
    doc.text('Address: Badulla,Bandarawela', 10, 55);

    // Add some space before financial summary
    doc.setFontSize(16);
    doc.setTextColor(0); 
    doc.text('Financial Summary', pageWidth / 2, 70, { align: 'center' });

    // Add financial data (Total Sales, Total Cost, Net Income)
    doc.setFontSize(12);
    doc.text(`Total Sales: Rs.${totalSales.toLocaleString()}`, 10, 80);
    doc.text(`Total Cost: Rs.${totalCost.toLocaleString()}`, 10, 90);
    doc.text(`Net Income: Rs.${netIncome.toLocaleString()}`, 10, 100);

    // Add Inventory Stuff Purchases heading
    doc.setFontSize(16);
    doc.text('Inventory Stuff Purchases', pageWidth / 2, 110, { align: 'center' });

    const tableColumn = ['Item Name', 'Total Price (Rs.)'];
    const tableRows = [];

    labels.forEach((label, index) => {
      const item = [label, data[index].toLocaleString()]; 
      tableRows.push(item);
    });

    // Add table with inventory data, setting header style for background color
    doc.autoTable({
      startY: 120, 
      head: [tableColumn],
      body: tableRows,
      headStyles: {
        fillColor: '#75A47F',   // Set header background color to #75A47F
        textColor: '#FFFFFF',   // Set header text color to white
      }
    });

    // Get current date
    const currentDate = new Date().toLocaleDateString();

    // Add Date and Signature at the bottom
    const signatureY = doc.autoTable.previous.finalY + 30; // Position the signature after the table

    // Print Date and Signature with horizontal alignment
    doc.text(`Date: ${currentDate}`, 10, signatureY);
    doc.text('Signature:', pageWidth - 50, signatureY);

    // Add the signature image (assuming it's a small image)
    doc.addImage(signatureImage, 'PNG', pageWidth - 50, signatureY + 5, 30, 10); // Adjust image size and position

    // Save the PDF
    doc.save('financial_summary.pdf');
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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

      {/* Download button */}
      <div className="mb-4 text-right">
        <Button 
          variant="contained" 
          sx={{ backgroundColor: '#75A47F', color: 'white' }} 
          onClick={handleDownload}
        >
          Download Summary Report 
        </Button>
      </div>

      <Card sx={{ backgroundColor: '#f2f2f2', padding: 2 }} elevation={0}>
        <CardContent>
          <Typography variant="h6" align="center" gutterBottom sx={{ fontSize: '36px', fontWeight: 'bold', color: '#75A47F' }}>
            Inventory Stuff Prices
          </Typography>
          <div style={{ width: '100%' }}>
            <BarChart
              dataset={labels.map((label, index) => ({
                month: label,
                totalPrice: data[index], 
              }))}
              xAxis={[
                { scaleType: 'band', dataKey: 'month', tickPlacement: 'middle', tickLabelPlacement: 'middle' },
              ]}
              {...chartSetting}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialDashboardWithChart;
