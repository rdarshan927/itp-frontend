import React, { useState, useEffect } from 'react';
import { api } from '../../../config/api';
import html2pdf from 'html2pdf.js';

// Declaring state variables for form fields and employee data.
function AddEmployee() {
    const [employeeId, setEmployeeId] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [email, setEmail] = useState('');
    const [startDate, setStartDate] = useState('');
    const [employees, setEmployees] = useState([]);
    const [errors, setErrors] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredEmployees = employees.filter(employee =>
        employee.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.lastName.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

    const validateForm = () => {
        const newErrors = {};
        if (!employeeId) newErrors.employeeId = "Employee ID is required.";
        if (!firstName) newErrors.firstName = "First Name is required.";
        if (!lastName) newErrors.lastName = "Last Name is required.";
        if (!role) newErrors.role = "Role is required.";
        if (!contactNumber || !/^\d{10}$/.test(contactNumber)) {
            newErrors.contactNumber = "Valid Contact Number is required (10 digits).";
        }
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Valid Email is required.";
        }
        if (!startDate) newErrors.startDate = "Start Date is required.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Returns true if no errors
    };

    const addOrUpdateEmployee = async () => {
        if (validateForm()) {
            const employeeData = {
                employeeId,
                firstName,
                lastName,
                role,
                contactNumber,
                email,
                startDate,
              
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
        } else {
            console.log("Form is invalid, fix the errors.");
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

    // Function to generate a PDF report of employees.
    const generatePDF = () => {
        const element = document.getElementById('employeeTable');
        if (!element) {
            console.error("Element not found");
            return;
        }

        const cloneElement = element.cloneNode(true);
        cloneElement.style.backgroundColor = 'white';
        cloneElement.style.color = 'black';

        const headers = cloneElement.querySelectorAll('th');
        const actionColumnIndex = Array.from(headers).findIndex(th => th.textContent === "Actions");

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

        const cells = cloneElement.querySelectorAll('th, td');
        cells.forEach(cell => {
            cell.style.fontSize = '12px';
            cell.style.border = '1px solid black';
            cell.style.padding = '5px';
        });

        const opt = {
            margin: 1,
            filename: 'employee_report.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', orientation: 'landscape', format: 'letter', margin: 10 },
        };
        // Generate the PDF using html2pdf.js.
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
                                className={`w-full rounded-md px-3 py-2 bg-lightG text-black text-3xl ${errors.employeeId ? 'border-red-500' : ''}`} 
                                value={employeeId}
                                onChange={(e) => setEmployeeId(e.target.value)} 
                                required
                            />
                            {errors.employeeId && <p className="text-red-500 text-sm">{errors.employeeId}</p>}
                        </div>

                        <div className="w-1/3 pr-2">
                            <label htmlFor="firstName" className="block text-2xl text-black font-bold mb-2">First Name:</label>
                            <input 
                                type="text" 
                                id="firstName" 
                                className={`w-full rounded-md px-3 py-2 bg-lightG text-black text-3xl ${errors.firstName ? 'border-red-500' : ''}`} 
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)} 
                                required
                            />
                            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                        </div>
                    </div>

                    <div className="flex mb-4">
                        <div className="w-1/3 pr-2">
                            <label htmlFor="lastName" className="block text-2xl text-black font-bold mb-2">Last Name:</label>
                            <input 
                                type="text" 
                                id="lastName" 
                                className={`w-full rounded-md px-3 py-2 bg-lightG text-black text-3xl ${errors.lastName ? 'border-red-500' : ''}`} 
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)} 
                                required
                            />
                            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                        </div>
                        <div className="w-1/3 pr-2">
                            <label htmlFor="role" className="block text-2xl text-black font-bold mb-2">Role:</label>
                            <input 
                                type="text" 
                                id="role" 
                                className={`w-full rounded-md px-3 py-2 bg-lightG text-black text-3xl ${errors.role ? 'border-red-500' : ''}`} 
                                value={role}
                                onChange={(e) => setRole(e.target.value)} 
                                required
                            />
                            {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
                        </div>
                    </div>

                    <div className="flex mb-4">
                        <div className="w-1/3 pr-2">
                            <label htmlFor="contactNumber" className="block text-2xl text-black font-bold mb-2">Contact Number:</label>
                            <input 
                                type="text" 
                                id="contactNumber" 
                                className={`w-full rounded-md px-3 py-2 bg-lightG text-black text-3xl ${errors.contactNumber ? 'border-red-500' : ''}`} 
                                value={contactNumber}
                                onChange={(e) => setContactNumber(e.target.value)} 
                                required
                            />
                            {errors.contactNumber && <p className="text-red-500 text-sm">{errors.contactNumber}</p>}
                        </div>

                        <div className="w-1/3 pr-2">
                            <label htmlFor="email" className="block text-2xl text-black font-bold mb-2">Email:</label>
                            <input 
                                type="email" 
                                id="email" 
                                className={`w-full rounded-md px-3 py-2 bg-lightG text-black text-3xl ${errors.email ? 'border-red-500' : ''}`} 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} 
                                required
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                        </div>
                    </div>

                    <div className="flex mb-4">
                        <div className="w-1/3 pr-2">
                            <label htmlFor="startDate" className="block text-2xl text-black font-bold mb-2">Start Date:</label>
                            <input 
                                type="date" 
                                id="startDate" 
                                className={`w-full rounded-md px-3 py-2 bg-lightG text-black text-3xl ${errors.startDate ? 'border-red-500' : ''}`} 
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)} 
                                required
                            />
                            {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate}</p>}
                        </div>
                    </div>

                    <div className="flex mb-4">
                        <button 
                            type="button" 
                            className="bg-lightG text-black px-4 py-2 rounded-lg mr-2" 
                            onClick={addOrUpdateEmployee}
                        >
                            {isEditing ? "Update Employee" : "Add Employee"}
                        </button>
                        <button 
                            type="button" 
                            className="bg-lightG text-black px-4 py-2 rounded-lg" 
                            onClick={clearForm}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-lightG p-6">
                <h2 className="text-4xl font-bold text-black mb-6 text-center">Employee List</h2>
                <div className="flex justify-center mb-4">
                    <input 
                        type="text" 
                        placeholder="Search by ID or Name" 
                        className="border border-gray-300 rounded-md px-4 py-2 w-1/3" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)} 
                    />
                </div>
                <div id="employeeTable" className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 px-4 py-2">Employee ID</th>
                                <th className="border border-gray-300 px-4 py-2">First Name</th>
                                <th className="border border-gray-300 px-4 py-2">Last Name</th>
                                <th className="border border-gray-300 px-4 py-2">Role</th>
                                <th className="border border-gray-300 px-4 py-2">Contact Number</th>
                                <th className="border border-gray-300 px-4 py-2">Email</th>
                                <th className="border border-gray-300 px-4 py-2">Start Date</th>
                                <th className="border border-gray-300 px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.map((employee, index) => (
                                <tr key={employee._id}>
                                    <td className="border border-gray-300 px-4 py-2">{employee.employeeId}</td>
                                    <td className="border border-gray-300 px-4 py-2">{employee.firstName}</td>
                                    <td className="border border-gray-300 px-4 py-2">{employee.lastName}</td>
                                    <td className="border border-gray-300 px-4 py-2">{employee.role}</td>
                                    <td className="border border-gray-300 px-4 py-2">{employee.contactNumber}</td>
                                    <td className="border border-gray-300 px-4 py-2">{employee.email}</td>
                                    <td className="border border-gray-300 px-4 py-2">{new Date(employee.startDate).toLocaleDateString()}</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <button 
                                            className="bg-blue-500 text-white px-2 py-1 rounded" 
                                            onClick={() => handleEdit(index)}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className="bg-red-500 text-white px-2 py-1 rounded ml-2" 
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
                <div className="flex justify-center mt-4">
                    <button 
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg" 
                        onClick={generatePDF}
                    >
                        Generate Report
                    </button>
                </div>
            </div>
        </>
    );
}

export default AddEmployee;
