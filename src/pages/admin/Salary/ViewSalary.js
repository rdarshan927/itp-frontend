import React, { useEffect, useState } from "react";
import Search from "./Search";  // Assuming this is your search component
import { api } from "../../../config/api";  // Your configured API

const ViewSalary = () => {
    const [salaries, setSalaries] = useState([]);
    const [filteredSalaries, setFilteredSalaries] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSalary, setSelectedSalary] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch salaries from the backend
    useEffect(() => {
        const fetchSalaries = async () => {
            try {
                const response = await api.get('/api/employeesalary/getall');  // Make sure this matches your endpoint
                const salariesData = Array.isArray(response.data.getEmployeeSalary) ? response.data.getEmployeeSalary : [];
                setSalaries(salariesData);
                setFilteredSalaries(salariesData);  // Initially show all salaries
            } catch (error) {
                console.error('Failed to fetch salaries:', error.message);
            }
        };

        fetchSalaries();
    }, []);

    // Filter the salary list based on the search term
    useEffect(() => {
        const results = salaries.filter(salary =>
            salary.salaryID?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            salary.userID?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredSalaries(results);
    }, [searchTerm, salaries]);

    const handleEdit = (salary) => {
        setSelectedSalary(salary);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedSalary(null);
    };

    const handleSave = async () => {
        try {
            await api.put(`/api/employeesalary/update/${selectedSalary._id}`, selectedSalary);
            setSalaries(salaries.map(salary => salary._id === selectedSalary._id ? selectedSalary : salary));
            setFilteredSalaries(filteredSalaries.map(salary => salary._id === selectedSalary._id ? selectedSalary : salary));
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to update salary:', error);
        }
    };

    const removeSalary = async (id) => {
        try {
            await api.delete(`/api/employeesalary/delete/${id}`);
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
            {Array.isArray(filteredSalaries) && filteredSalaries.length === 0 ? (
                <p className="text-center dark:text-white dark:bg-black text-2xl">No salary entries available.</p>
            ) : (
                <>
                    <div className='flex items-center w-11/12 mb-3'>
                        <div className='w-1/4 text-center text-xl font-bold text-white'>Salary ID</div>
                        <div className='w-1/4 text-center text-xl font-bold text-white'>User ID</div>
                        <div className='w-1/4 text-center text-xl font-bold text-white'>Total Salary</div>
                        <div className='w-1/4 text-center text-xl font-bold text-white'>Allowance</div>
                    </div>
                    <ul>
                        {filteredSalaries.map((salary) => (
                            <li key={salary._id} className="flex items-center justify-between mb-4 p-4 bg-[#75A47F] border border-[#BACD92] rounded-md">
                                <div className="flex-1 text-white flex items-center">
                                    <div className="w-1/4 px-2 text-center text-2xl">{salary.salaryID}</div>
                                    <div className="w-1/4 px-2 text-center text-2xl">{salary.userID}</div>
                                    <div className="w-1/4 px-2 text-center text-2xl">Rs.{salary.totalSalary}</div>
                                    <div className="w-1/4 px-2 text-center text-2xl">Rs.{salary.allowance}</div>
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

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-5 rounded-md shadow-lg">
                        <h2 className="text-2xl font-bold mb-4">Edit Salary Entry</h2>
                        {selectedSalary && (
                            <>
                                {Object.keys(selectedSalary).map((key) => (
                                    <div className="mb-2" key={key}>
                                        <label className="block font-bold mb-1">{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                                        <input
                                            type="text"
                                            name={key}
                                            value={selectedSalary[key]}
                                            onChange={handleChange}
                                            className="border p-2 w-full"
                                        />
                                    </div>
                                ))}
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
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewSalary;
