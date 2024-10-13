import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ViewPlantSchedule = () => {
  const [plantSchedules, setPlantSchedules] = useState([]);
  const [originalSchedules, setOriginalSchedules] = useState([]); // State to store original schedules
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  // Fetch plant schedules from API
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_FLOWER_API_URL}/plantSchedules`)
      .then(res => {
        setPlantSchedules(res.data.plantSchedules);  // Use 'plantSchedules' array from the response
        setOriginalSchedules(res.data.plantSchedules);  // Store original data
      })
      .catch(error => {
        console.error("There was an error fetching the data!", error);
        setError('Failed to load plant schedules');
      });
  }, []);

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle search action
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setError('Please enter a valid search term');
      return;
    }

    const filteredSchedules = originalSchedules.filter(schedule =>
      schedule.ScheduleID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.PlantName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filteredSchedules.length > 0) {
      setPlantSchedules(filteredSchedules);
      setError('');
    } else {
      setError('Plant Schedule Not Found');
      setPlantSchedules([]);
    }
  };




  //PDF Generation
  const downloadPDF = () => {
    const doc = new jsPDF();

    
    doc.setFontSize(18);
    doc.text('Plant Schedule Report', 105, 20, { align: 'center' });


    
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    // Define table columns
    const tableColumn = ['Schedule ID', 'Plant Name', 'Field', 'Planted Date', 'Expected Blooming Date', 'Resources', 'Weather Condition'];

    // Define table rows by mapping plant schedules
    const tableRows = plantSchedules.map(schedule => [
      schedule.ScheduleID,
      schedule.PlantName,
      schedule.Field,
      new Date(schedule.PlantedDate).toLocaleDateString('en-GB'),
      new Date(schedule.ExpectedBloomingDate).toLocaleDateString('en-GB'),
      schedule.Resources,
      schedule.WeatherCondition
    ]);

    // Generate the table in the PDF
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'striped',
      styles: {
        fontSize: 10,
        halign: 'center',
      },
      headStyles: {
        fillColor: [72, 209, 204],
      },
    });

    // Add footer with page numbers
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.text(
        `Page ${i} of ${totalPages}`,
        doc.internal.pageSize.getWidth() - 20,
        doc.internal.pageSize.getHeight() - 10
      );
    }

    // Save the PDF
    doc.save('plant_schedule_report.pdf');
  };

  return (
    <div className="bg-[#BACD92] mt-10 p-6">
      {/* Search Input and Button */}
      <div className="mt-1">
        <div className="flex justify-start items-center space-x-2">
          <input
            type="text"
            placeholder="Enter Schedule ID or Plant Name"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-1/4 p-3 rounded-md border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="p-3 bg-darkG text-white font-bold rounded-md shadow-md focus:outline-none"
          >
            Search
          </button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      <h2 className="font-bold text-black mb-4 text-center text-5xl">Plant Schedules</h2>

      {/* Display schedule in a grid */}
      <div className="grid grid-cols-7 gap-4 w-full text-center font-bold text-black text-xl mb-5">
        <div className="px-4">Schedule ID</div>
        <div className="px-4">Plant Name</div>
        <div className="px-4">Field</div>
        <div className="px-4">Planted Date</div>
        <div className="px-4">Expected Blooming Date</div>
        <div className="px-4">Resources</div>
        <div className="px-4">Weather Condition</div>
      </div>

      {/* List plant schedules */}
      <ul className="space-y-4">
        {plantSchedules.length > 0 ? (
          plantSchedules.map(schedule => (
            <li key={schedule._id} className="grid grid-cols-7 gap-4 p-4 bg-[#75A47F] border border-[#BACD92] rounded-md">
              <div className="px-4 text-center text-2xl">{schedule.ScheduleID}</div>
              <div className="px-4 text-center text-2xl">{schedule.PlantName}</div>
              <div className="px-4 text-center text-2xl">{schedule.Field}</div>
              <div className="px-4 text-center text-2xl">{new Date(schedule.PlantedDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })}</div>
              <div className="px-4 text-center text-2xl">{new Date(schedule.ExpectedBloomingDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })}</div>
              <div className="px-4 text-center text-2xl">{schedule.Resources}</div>
              <div className="px-4 text-center text-2xl">{schedule.WeatherCondition}</div>
            </li>
          ))
        ) : (
          <li className="text-center text-2xl text-red-500">No plant schedules available</li>
        )}
      </ul>

      {/* Button to download the PDF */}
      <div className="flex justify-center mt-6">
        <button
          onClick={downloadPDF}
          className="bg-[#75A47F] hover:bg-[#388E3C] text-white font-bold py-2 px-6 rounded"
        >
          Download Report
        </button>
      </div>
    </div>
  );
};

export default ViewPlantSchedule;
