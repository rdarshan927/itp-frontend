import React, { useEffect, useState } from "react";
import Search from "./Search";
import { api } from "../../../config/api";

const ViewSalary = () => {
    const [salaries, setSalaries] = useState([]); // State to hold salary entries
    const [filteredSalaries, setFilteredSalaries] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSalary, setSelectedSalary] = useState(null); // State for the selected salary entry
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

    useEffect(() => {
        const fetchSalaries = async () => {
            try {
                const response = await api.get('/api/salaries/getall'); // Replace with your API endpoint
                setSalaries(response.data.salaries || []);
                setFilteredSalaries(response.data.salaries || []);
            } catch (error) {
                console.error('Failed to fetch salaries:', error);
            }
        };

        fetchSalaries();
    }, []);

    useEffect(() => {
        const results = salaries.filter(salary =>
            salary.salaryId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            salary.userId.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredSalaries(results);
    }, [searchTerm, salaries]);

    const handleEdit = (salary) => {
        setSelectedSalary(salary);
        setIsModalOpen(true); // Open the modal
    };

    const handleModalClose = () => {
        setIsModalOpen(false); // Close the modal
        setSelectedSalary(null); // Clear selected salary
    };

    const handleSave = async () => {
        try {
            await api.put(`/api/salaries/update/${selectedSalary._id}`, selectedSalary);
            setSalaries(salaries.map(salary => salary._id === selectedSalary._id ? selectedSalary : salary));
            setFilteredSalaries(filteredSalaries.map(salary => salary._id === selectedSalary._id ? selectedSalary : salary));
            setIsModalOpen(false); // Close the modal after saving
        } catch (error) {
            console.error('Failed to update salary:', error);
        }
    };

    const removeSalary = async (id) => {
        try {
            await api.delete(`/api/salaries/delete/${id}`); // Ensure the route matches the backend
            setSalaries(salaries.filter(salary => salary._id !== id));
            setFilteredSalaries(filteredSalaries.filter(salary => salary._id !== id));
        } catch (error) {
            console.error('Failed to delete salary:', error);
        }
    };

    const handleSearchChange = (term) => {
        setSearchTerm(term);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedSalary(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <div className="bg-[#BACD92] mt-5 p-3">
            <Search onSearchChange={handleSearchChange} />
            <h2 className="font-bold text-white mb-4 text-center text-5xl">Salary Entries</h2>
            {filteredSalaries.length === 0 ? (
                <p className="text-center dark:text-white dark:bg-black text-2xl">No salary entries available.</p>
            ) : (
                <>
                    <div className='flex items-center w-11/12 mb-3'>
                        <div className='w-1/4 text-center text-xl font-bold text-white'>Salary ID</div>
                        <div className='w-1/4 text-center text-xl font-bold text-white'>User ID</div>
                        <div className='w-1/4 text-center text-xl font-bold text-white'>OT Hours</div>
                        <div className='w-1/4 text-center text-xl font-bold text-white'>Total Salary</div>
                    </div>
                    <ul>
                        {filteredSalaries.map((salary) => (
                            <li key={salary._id} className="flex items-center justify-between mb-4 p-4 bg-[#75A47F] border border-[#BACD92] rounded-md">
                                <div className="flex-1 text-white flex items-center">
                                    <div className="w-1/4 px-2 text-center text-2xl">{salary.salaryId}</div>
                                    <div className="w-1/4 px-2 text-center text-2xl">{salary.userId}</div>
                                    <div className="w-1/4 px-2 text-center text-2xl">{salary.otHours}h</div>
                                    <div className="w-1/4 px-2 text-center text-2xl">Rs.{salary.totalSalary}</div>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        className="bg-yellow-400 text-white text-sm px-3 py-1 rounded hover:bg-yellow-500"
                                        onClick={() => handleEdit(salary)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-400 text-white text-sm px-3 py-1 rounded hover:bg-red-500"
                                        onClick={() => removeSalary(salary._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </>
            )}

            {/* Modal for editing salary entry */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-5 rounded-md shadow-lg">
                        <h2 className="text-2xl font-bold mb-4">Edit Salary Entry</h2>
                        <div className="mb-2">
                            <label className="block font-bold mb-1">Salary ID:</label>
                            <input
                                type="text"
                                name="salaryId"
                                value={selectedSalary.salaryId}
                                onChange={handleChange}
                                className="border p-2 w-full"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block font-bold mb-1">User ID:</label>
                            <input
                                type="text"
                                name="userId"
                                value={selectedSalary.userId}
                                onChange={handleChange}
                                className="border p-2 w-full"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block font-bold mb-1">Base Salary:</label>
                            <input
                                type="text"
                                name="baseSalary"
                                value={selectedSalary.baseSalary}
                                onChange={handleChange}
                                className="border p-2 w-full"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block font-bold mb-1">Allowances:</label>
                            <input
                                type="text"
                                name="allowances"
                                value={selectedSalary.allowances}
                                onChange={handleChange}
                                className="border p-2 w-full"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block font-bold mb-1">EPF:</label>
                            <input
                                type="text"
                                name="epf"
                                value={selectedSalary.epf}
                                onChange={handleChange}
                                className="border p-2 w-full"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block font-bold mb-1">ETF:</label>
                            <input
                                type="text"
                                name="etf"
                                value={selectedSalary.etf}
                                onChange={handleChange}
                                className="border p-2 w-full"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block font-bold mb-1">OT Hours:</label>
                            <input
                                type="text"
                                name="otHours"
                                value={selectedSalary.otHours}
                                onChange={handleChange}
                                className="border p-2 w-full"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block font-bold mb-1">Total Salary:</label>
                            <input
                                type="text"
                                name="totalSalary"
                                value={selectedSalary.totalSalary}
                                onChange={handleChange}
                                className="border p-2 w-full"
                            />
                        </div>
                        <div className="flex justify-end space-x-2 mt-4">
                            <button
                                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                                onClick={handleModalClose}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-green-400 text-white px-4 py-2 rounded hover:bg-green-500"
                                onClick={handleSave}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewSalary;
