import React, { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { api } from '../../../config/api';
import { Card, CardContent, Typography } from '@mui/material';

const BarChartDisplay = () => {
  // States for labels and data
  const [labels, setLabels] = useState([]);
  const [data, setData] = useState([]);

  // Fetch bar chart data from backend
  useEffect(() => {
    const fetchBarChartData = async () => {
      try {
        const response = await api.get('/api/barchart'); // Adjust the URL to your backend
        const { labels, datasets } = response.data.data;
        setLabels(labels);
        setData(datasets[0].data); // Assuming only one dataset
      } catch (error) {
        console.error('Error fetching bar chart data:', error);
      }
    };

    fetchBarChartData();
  }, []);

  // MUI Bar chart configuration
  const chartSetting = {
    yAxis: [
      {
        label: 'Total Price Rs.',
        // Use valueFormatter to format the Y-axis values
        valueFormatter: (value) => {
          if (value === 0) return '0'; // Display 0 for the value 0
          return `${(value / 1000).toFixed(0)}k`; // Format other values
        },
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

  return (
    <Card sx={{ backgroundColor: '#f2f2f2', padding: 2 }} elevation={0}> {/* Set elevation to 0 to remove shadow */}
      <CardContent>
        {/* Centered Typography with Increased Font Size */}
        <Typography variant="h6" align="center" gutterBottom sx={{ fontSize: '36px', fontWeight: 'bold', color: '#75A47F' }}>
          Inventory Stuff Prices
        </Typography>
        <div style={{ width: '100%' }}>
          <BarChart
            dataset={labels.map((label, index) => ({
              month: label, // label represents the item name in this case
              totalPrice: data[index], // Corresponding total price
            }))}
            xAxis={[
              { scaleType: 'band', dataKey: 'month', tickPlacement: 'middle', tickLabelPlacement: 'middle' },
            ]}
            {...chartSetting}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BarChartDisplay;
