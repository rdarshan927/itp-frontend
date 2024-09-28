import React, { useState, useEffect } from 'react';
import { api } from '../../../config/api';
import html2pdf from 'html2pdf.js';

function AddEmployee() {
    const [employeeId, setEmployeeId] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [email, setEmail] = useState('');
    const [startDate, setStartDate] = useState('');
    const [employees, setEmployees] = useState([]);

    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(null);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await api.get('/api/employee');
            setEmployees(response.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const addOrUpdateEmployee = async () => {
        const employeeData = {
            employeeId,
            firstName,
            lastName,
            role,
            contactNumber,
            email,
            startDate, // Ensure startDate is passed correctly
        };

        try {
            if (isEditing) {
                await api.put(`/api/employees/${editIndex}`, employeeData);
            } else {
                await api.post('/api/employees', employeeData);
            }
            fetchEmployees();
            clearForm();
        } catch (error) {
            console.error('Error saving employee:', error);
        }
    };

    const handleEdit = (index) => {
        const employee = employees[index];
        setEmployeeId(employee.employeeId);
        setFirstName(employee.firstName);
        setLastName(employee.lastName);
        setRole(employee.role);
        setContactNumber(employee.contactNumber);
        setEmail(employee.email);
        // Ensure the startDate is formatted as YYYY-MM-DD
        const formattedDate = employee.startDate ? new Date(employee.startDate).toISOString().split('T')[0] : '';
        setStartDate(formattedDate);
        setIsEditing(true);
        setEditIndex(employee._id);
    };

    const handleDelete = async (index) => {
        try {
            await api.delete(`/api/employees/${employees[index]._id}`);
            fetchEmployees();
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    };

    const clearForm = () => {
        setEmployeeId('');
        setFirstName('');
        setLastName('');
        setRole('');
        setContactNumber('');
        setEmail('');
        setStartDate('');
        setIsEditing(false);
        setEditIndex(null);
    };

    // Add this function to generate the PDF
    const generatePDF = () => {
        const element = document.getElementById('employeeTable'); // Get the element you want to convert to PDF
        if (!element) {
            console.error("Element not found");
            return;
        }
    
        // Create a clone of the table element to apply styles without affecting the original
        const cloneElement = element.cloneNode(true);
    
        // Apply custom styles for PDF generation
        cloneElement.style.backgroundColor = 'white'; // No background color
        cloneElement.style.color = 'black'; // Text color black
    
        // Find the "Actions" column header and corresponding cells
        const headers = cloneElement.querySelectorAll('th');
        const actionColumnIndex = Array.from(headers).findIndex(th => th.textContent === "Actions");
    
        // Remove the "Actions" column from headers
        if (actionColumnIndex !== -1) {
            headers[actionColumnIndex].remove();
            const rows = cloneElement.querySelectorAll('tr');
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length > actionColumnIndex) {
                    cells[actionColumnIndex].remove();
                }
            });
        }
    
        // Apply styles to remaining cells
        const cells = cloneElement.querySelectorAll('th, td');
        cells.forEach(cell => {
            cell.style.fontSize = '12px'; // Set a smaller font size
            cell.style.border = '1px solid black'; // Add borders for clarity
            cell.style.padding = '5px'; // Adjust padding for a compact look
        });
    
        const opt = {
            margin: 1,
            filename: 'employee_report.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', orientation: 'landscape', format: 'letter', margin: 10 },
        };
    
        // Use html2pdf to generate and download the PDF
        html2pdf().from(cloneElement).set(opt).save();
    };
    

    return (
        <>
            <div className="bg-darkG p-6">
                
                <h1 className="text-5xl font-bold text-black mb-6 text-center">{isEditing ? "Edit Employee" : "Add Employee"}</h1>
                <form className='relative left-56'>
                    <div className="flex mb-4">
                        <div className="w-1/3 pr-2">
                            <label htmlFor="employeeId" className="block text-2xl text-black font-bold mb-2">Employee ID:</label>
                            <input 
                                type="text" 
                                id="employeeId" 
                                className="w-full rounded-md px-3 py-2 bg-lightG text-black text-3xl" 
                                value={employeeId}
                                onChange={(e) => setEmployeeId(e.target.value)} 
                                required
                            />
                        </div>

                        <div className="w-1/3 pr-2">
                            <label htmlFor="firstName" className="block text-2xl text-black font-bold mb-2">First Name:</label>
                            <input 
                                type="text" 
                                id="firstName" 
                                className="w-full rounded-md px-3 py-2 bg-lightG text-black text-3xl" 
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)} 
                                required
                            />
                        </div>
                    </div>
                   
                    <div className="flex mb-4">
                        <div className="w-1/3 pr-2">
                            <label htmlFor="lastName" className="block text-2xl text-black font-bold mb-2">Last Name:</label>
                            <input 
                                type="text" 
                                id="lastName" 
                                className="w-full rounded-md px-3 py-2 bg-lightG text-black text-3xl" 
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)} 
                                required
                            />
                        </div>
                        <div className="w-1/3 pr-2">
                            <label htmlFor="role" className="block text-2xl text-black font-bold mb-2">Role:</label>
                            <input 
                                type="text" 
                                id="role" 
                                className="w-full rounded-md px-3 py-2 bg-lightG text-black text-3xl" 
                                value={role}
                                onChange={(e) => setRole(e.target.value)} 
                                required
                            />
                        </div>
                    </div>
                    <div className="flex mb-4">
                        <div className="w-1/3 pr-2">
                            <label htmlFor="contactNumber" className="block text-2xl text-black font-bold mb-2">Contact Number:</label>
                            <input 
                                type="text" 
                                id="contactNumber" 
                                className="w-full rounded-md px-3 py-2 bg-lightG text-black text-3xl" 
                                value={contactNumber}
                                onChange={(e) => setContactNumber(e.target.value)} 
                                required
                            />
                        </div>
                        <div className="w-1/3 pr-2">
                            <label htmlFor="email" className="block text-2xl text-black font-bold mb-2">Email:</label>
                            <input 
                                type="email" 
                                id="email" 
                                className="w-full rounded-md px-3 py-2 bg-lightG text-black text-3xl" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} 
                                required
                            />
                        </div>
                    </div>
                    <div className="flex mb-4">
                        <div className="w-1/3 pr-2">
                            <label htmlFor="startDate" className="block text-2xl text-black font-bold mb-2">Start Date:</label>
                            <input 
                                type="date" 
                                id="startDate" 
                                className="w-full rounded-md px-3 py-2 bg-lightG text-black text-3xl" 
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)} 
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="button"
                        className="bg-lightG text-black font-bold py-2 px-12 rounded text-2xl mt-5 hover:bg-[#c9d5b0]"
                        onClick={addOrUpdateEmployee}
                    >
                        {isEditing ? "Update Employee" : "Submit"}
                    </button>
                </form>
            </div>

            <div className="bg-darkG p-6 mt-10">
                <h2 className="text-5xl font-bold text-black mb-6 text-center">Employee List</h2>
                <div className="mt-8 flex justify-end"> {/* Flex container to align items */}
                 <button
                 className="bg-red-500 text-black font-bold py-3 px-6 rounded mt-5" // Increased padding here
                 onClick={generatePDF}
                 >  Download Report</button>
            </div>

                <table id="employeeTable" className="table-auto w-full bg-lightG text-black rounded-md">
                    <thead>
                        <tr className="text-2xl text-left bg-gray-200 font-bold">
                            <th className="p-4">Employee ID</th>
                            <th className="p-4">First Name</th>
                            <th className="p-4">Last Name</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Contact Number</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Start Date</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((employee, index) => (
                            <tr key={employee._id} className="border-b text-1xl">
                                <td className="p-4">{employee.employeeId}</td>
                                <td className="p-4">{employee.firstName}</td>
                                <td className="p-4">{employee.lastName}</td>
                                <td className="p-4">{employee.role}</td>
                                <td className="p-4">{employee.contactNumber}</td>
                                <td className="p-4">{employee.email}</td>
                                <td className="p-4">{new Date(employee.startDate).toISOString().split('T')[0]}</td>
                                <td className="p-4">
                                    <button
                                        className="bg-yellow-400 text-black text-sm px-3 py-1 rounded hover:bg-yellow-500 mr-2"
                                        onClick={() => handleEdit(index)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-400 text-black text-sm px-3 py-1 rounded hover:bg-red-500"
                                        onClick={() => handleDelete(index)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default AddEmployee;
