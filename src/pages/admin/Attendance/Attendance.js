import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Attendance() {
    const [employeeId, setEmployeeId] = useState('');
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Format date and time as "MM/DD/YYYY HH:MM AM/PM"
    const formatDateTime = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    // Calculate overtime hours based on check-in and check-out times
    const calculateOTHours = (checkinTime, checkoutTime) => {
        if (!checkinTime || !checkoutTime) return '00:00';

        const checkinDate = new Date(checkinTime);
        const checkoutDate = new Date(checkoutTime);

        // Check if checkout time is on the next day
        if (checkoutDate < checkinDate) {
            checkoutDate.setDate(checkoutDate.getDate() + 1); // Add one day to checkout date
        }

        const workedHours = (checkoutDate - checkinDate) / (1000 * 60 * 60); // Convert milliseconds to hours
        const otHours = workedHours > 8 ? workedHours - 8 : 0; // OT is anything over 8 hours

        const hours = Math.floor(otHours); // Get the integer part (hours)
        const minutes = Math.round((otHours - hours) * 60); // Get the fractional part (minutes)

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`; // Format as "HH:MM"
    };

    // Fetch attendance records from the API
    const fetchAttendanceRecords = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/attendance/'); // Endpoint to fetch records
            setAttendanceRecords(response.data); // Assuming response.data contains the records
        } catch (error) {
            console.error('Error fetching attendance records:', error);
            setError('Failed to fetch attendance records. Please try again later.');
        }
    };

    // Handle employee scan (check-in or check-out)
    const handleScan = async () => {
        setLoading(true);
        setError(null);

        try {
            // Check for existing check-in record without a checkout
            const existingRecord = attendanceRecords.find(record => record.employeeId === employeeId && !record.checkoutTime);

            if (existingRecord) {
                // Perform checkout
                const response = await axios.put('http://localhost:5000/api/attendance/checkout', { employeeId });

                if (response.status !== 200) {
                    throw new Error(response.data.message || 'Checkout failed');
                }

                const updatedRecord = response.data.attendance; // Use the attendance data returned
                setAttendanceRecords((prevRecords) =>
                    prevRecords.map((record) =>
                        record.employeeId === updatedRecord.employeeId ? updatedRecord : record
                    )
                );
            } else {
                // Perform check-in
                const response = await axios.post('http://localhost:5000/api/attendance/checkin', { employeeId });

                if (response.status !== 201) {
                    throw new Error(response.data.message || 'Check-in failed');
                }

                const newRecord = response.data.attendance; // Use the attendance data returned
                setAttendanceRecords((prevRecords) => [...prevRecords, newRecord]);
            }

            // Clear the input field after processing
            setEmployeeId('');
        } catch (error) {
            setError(error.message || 'An error occurred while processing your request.');
        } finally {
            setLoading(false);
            fetchAttendanceRecords(); // Refetch attendance records after check-in or check-out
        }
    };

    useEffect(() => {
        fetchAttendanceRecords(); // Fetch records on component mount
    }, []);

    return (
        <div className="container mx-auto p-4 ">
            <h1 className="text-2xl font-bold mb-4">Attendance System</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <input
                
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="Scan or enter Employee ID"
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && employeeId && !loading) {
                        handleScan();
                    }
                }}
                className="border border-gray-300 p-2 rounded-md mb-4 w-full dark:bg-bOne"
                disabled={loading}
            />
            {loading && <p>Loading...</p>}
            <table className="min-w-full border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border px-4 py-2">Employee ID</th>
                        <th className="border px-4 py-2">Check-in Time</th>
                        <th className="border px-4 py-2">Check-out Time</th>
                        <th className="border px-4 py-2">OT Hours</th>
                    </tr>
                </thead>
                <tbody>
                    {attendanceRecords.map((record, index) => (
                        <tr key={index} className="hover:bg-gray-100">
                            <td className="border px-4 py-2">{record.employeeId}</td>
                            <td className="border px-4 py-2">{formatDateTime(record.checkinTime)}</td>
                            <td className="border px-4 py-2">{formatDateTime(record.checkoutTime)}</td>
                            <td className="border px-4 py-2">{calculateOTHours(record.checkinTime, record.checkoutTime)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Attendance;
