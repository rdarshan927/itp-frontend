import React, { useState, useEffect } from 'react';
import { api } from '../../../config/api';
import {
    LineChart,
    XAxis, // Corrected from ChartsXAxis
    YAxis, // Corrected from ChartsYAxis
    CartesianGrid, // Corrected from ChartsGrid
    Tooltip, // Corrected from ChartsTooltip
    Line // Corrected from LineElement
} from 'recharts';


const App = () => {
    const [cropType, setCropType] = useState('');
    const [cropData, setCropData] = useState(null);
    const [annualCropData, setAnnualCropData] = useState('');

    useEffect(() => {
        console.log(cropType, "Fetching crop data");
        if (cropType) {
            api.post('/harvest/harvestchart', { cropType }) // Adjust the endpoint as necessary
                .then(response => {
                    setCropData(response.data.cropEstimates);
                    setAnnualCropData(response.data.annualCropCounts); // Assuming you have state for this
                })
                .catch(err => console.error(err));
        }
    }, [cropType]);
    

    const handleCropTypeChange = (e) => {
        setCropType(e.target.value);
    };

    const harvestPieData = [
        { name: 'Previous Crop', value: cropData ? cropData.previousCrop : 0 },
        { name: 'Current Crop', value: cropData ? cropData.currentCrop : 0 },
        { name: 'Estimated Crop', value: cropData ? cropData.estimatedCrop : 0 },
    ];

    const annualHarvestData = [
        { year: '2020', yield: 200 },
        { year: '2021', yield: 300 },
        { year: '2022', yield: 400 },
        { year: '2023', yield: 330 },  // Mock data for annual harvest
    ];

    return (
      <div className="min-h-screen bg-gray-100 p-8  dark:bg-bOne">
          <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6  dark:bg-cTwo">
              <h1 className="text-3xl font-bold text-center mb-8">Harvest Dashboard</h1>
              
              <div className="mb-6">
                  <label className="block text-lg font-semibold mb-2">Crop Type:</label>
                  <input
                      type="text"
                      value={cropType}
                      onChange={handleCropTypeChange}
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400  dark:bg-bOne"
                      placeholder="Enter Crop Type"
                  />
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-green-100 p-4 rounded-md">
                      <h2 className="text-2xl font-bold text-green-600">
                          {cropData ? cropData.previousMonth : 'N/A'}
                      </h2>
                      <p className="text-lg text-gray-600">Previous Crop</p>
                  </div>
                  <div className="bg-green-100 p-4 rounded-md">
                      <h2 className="text-2xl font-bold text-green-600">
                          {cropData ? cropData.currentMonth : 'N/A'}
                      </h2>
                      <p className="text-lg text-gray-600">Current Crop</p>
                  </div>
                  <div className="bg-green-100 p-4 rounded-md">
                      <h2 className="text-2xl font-bold text-green-600">
                          {cropData ? cropData.estimatedNextMonth : 'N/A'}
                      </h2>
                      <p className="text-lg text-gray-600">Estimated Crop</p>
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mt-10">
                  
              {annualCropData.length > 0 ? (
                <LineChart
                    width={500}
                    height={300}
                    data={annualCropData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Line type="monotone" dataKey="totalQuantity" stroke="#8884d8" />
                </LineChart>
            ) : (
                <p>No data available for the selected crop type</p>
            )}

                  
              </div>
          </div>
      </div>
    );
};

export default App;
