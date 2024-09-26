import React, { useState, useEffect } from 'react';
import { api } from '../../../config/api';

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
    };

    const handleEdit = (index) => {
        const employee = employees[index];
        setEmployeeId(employee.employeeId);
        setFirstName(employee.firstName);
        setLastName(employee.lastName);
        setRole(employee.role);
        setContactNumber(employee.contactNumber);
        setEmail(employee.email);
        setStartDate(employee.startDate);
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

    return (
        <>
            <div className="bg-darkG p-6">
                <h1 className="text-5xl font-bold text-white mb-6 text-center">{isEditing ? "Edit Employee" : "Add Employee"}</h1>
                <form className='relative left-56'>
                    <div className="flex mb-4">
                        <div className="w-1/3 pr-2">
                            <label htmlFor="employeeId" className="block text-2xl text-white font-bold mb-2">Employee ID:</label>
                            <input 
                                type="text" 
                                id="employeeId" 
                                className="w-full rounded-md px-3 py-2 bg-lightG text-white text-3xl" 
                                value={employeeId}
                                onChange={(e) => setEmployeeId(e.target.value)} 
                                required
                            />
                        </div>
                    </div>
                    <div className="flex mb-4">
                        <div className="w-1/3 pr-2">
                            <label htmlFor="firstName" className="block text-2xl text-white font-bold mb-2">First Name:</label>
                            <input 
                                type="text" 
                                id="firstName" 
                                className="w-full rounded-md px-3 py-2 bg-lightG text-white text-3xl" 
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)} 
                                required
                            />
                        </div>
                        <div className="w-1/3 pl-2">
                            <label htmlFor="lastName" className="block text-2xl text-white font-bold mb-2">Last Name:</label>
                            <input 
                                type="text" 
                                id="lastName" 
                                className="w-full rounded-md px-3 py-2 bg-lightG text-white text-3xl" 
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)} 
                                required
                            />
                        </div>
                    </div>
                    <div className="flex mb-4">
                        <div className="w-1/3 pr-2">
                            <label htmlFor="role" className="block text-2xl text-white font-bold mb-2">Role:</label>
                            <input 
                                type="text" 
                                id="role" 
                                className="w-full rounded-md px-3 py-2 bg-lightG text-white text-3xl" 
                                value={role}
                                onChange={(e) => setRole(e.target.value)} 
                                required
                            />
                        </div>
                    </div>
                    <div className="flex mb-4">
                        <div className="w-1/3 pr-2">
                            <label htmlFor="contactNumber" className="block text-2xl text-white font-bold mb-2">Contact Number:</label>
                            <input 
                                type="text" 
                                id="contactNumber" 
                                className="w-full rounded-md px-3 py-2 bg-lightG text-white text-3xl" 
                                value={contactNumber}
                                onChange={(e) => setContactNumber(e.target.value)} 
                                required
                            />
                        </div>
                        <div className="w-1/3 pl-2">
                            <label htmlFor="email" className="block text-2xl text-white font-bold mb-2">Email:</label>
                            <input 
                                type="email" 
                                id="email" 
                                className="w-full rounded-md px-3 py-2 bg-lightG text-white text-3xl" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} 
                                required
                            />
                        </div>
                    </div>
                    <div className="flex mb-4">
                        <div className="w-1/3 pr-2">
                            <label htmlFor="startDate" className="block text-2xl text-white font-bold mb-2">Start Date:</label>
                            <input 
                                type="date" 
                                id="startDate" 
                                className="w-full rounded-md px-3 py-2 bg-lightG text-white text-3xl" 
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)} 
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="button"
                        className="bg-lightG text-white font-bold py-2 px-12 rounded text-2xl mt-5 hover:bg-[#c9d5b0]"
                        onClick={addOrUpdateEmployee}
                    >
                        {isEditing ? "Update Employee" : "Submit"}
                    </button>
                </form>
            </div>

            <div className="bg-darkG p-6 mt-10">
                <h2 className="text-5xl font-bold text-white mb-6 text-center">Employee List</h2>
                <ul>
                    {employees.map((employee, index) => (
                        <li key={employee._id} className="flex items-center justify-between mb-4 p-4 bg-lightG text-white rounded-md">
                            <div className="flex-1 flex items-center">
                                <div className="w-1/6 px-2 text-center text-2xl">{employee.employeeId}</div>
                                <div className="w-1/6 px-2 text-center text-2xl">{employee.firstName}</div>
                                <div className="w-1/6 px-2 text-center text-2xl">{employee.lastName}</div>
                                <div className="w-1/6 px-2 text-center text-2xl">{employee.role}</div>
                                <div className="w-1/6 px-2 text-center text-2xl">{employee.contactNumber}</div>
                                <div className="w-1/6 px-2 text-center text-2xl">{employee.email}</div>
                                <div className="w-1/6 px-2 text-center text-2xl">{employee.startDate}</div>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    className="bg-yellow-400 text-white text-sm px-3 py-1 rounded hover:bg-yellow-500"
                                    onClick={() => handleEdit(index)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="bg-red-400 text-white text-sm px-3 py-1 rounded hover:bg-red-500"
                                    onClick={() => handleDelete(index)}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default AddEmployee

