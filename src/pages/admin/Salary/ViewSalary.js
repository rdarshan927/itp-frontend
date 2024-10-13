import React, { useEffect, useState } from "react";
import Search from "./Search";  // Assuming this is your search component
import { api } from "../../../config/api";  // Your configured API

const ViewSalary = () => {
    const [salaries, setSalaries] = useState([]);
    const [filteredSalaries, setFilteredSalaries] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSalary, setSelectedSalary] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expandedCards, setExpandedCards] = useState({});
    const [salaryDetails, setSalaryDetails] = useState({}); // To store salary details for expanded cards

    // Define EPF and ETF rates (example rates)
    const epfRate = 0.12;  // 12% EPF
    const etfRate = 0.03;  // 3% ETF

    // Fetch salaries from the backend
    useEffect(() => {
        const fetchSalaries = async () => {
            try {
                const response = await api.get('/api/employeesalary/getall');
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
        setSelectedSalary({ ...salary });  // Create a copy of the salary to edit
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedSalary(null);
    };

    const calculateEPF = (basicSalary) => {
        return basicSalary * epfRate;
    };

    const calculateETF = (basicSalary) => {
        return basicSalary * etfRate;
    };

    const calculateTotalSalary = (basicSalary) => {
        return basicSalary + calculateEPF(basicSalary) + calculateETF(basicSalary);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Update selectedSalary state
        setSelectedSalary(prevState => {
            const updatedSalary = {
                ...prevState,
                [name]: value,
            };

            // If the field being changed is basic salary, recalculate EPF, ETF, and total salary
            if (name === 'basicSalary') {
                const newBasicSalary = parseFloat(value) || 0;
                const epf = calculateEPF(newBasicSalary);
                const etf = calculateETF(newBasicSalary);
                updatedSalary.epf = epf;  // Assuming you have an epf field in your state
                updatedSalary.etf = etf;  // Assuming you have an etf field in your state
                updatedSalary.totalSalary = calculateTotalSalary(newBasicSalary);
            }

            return updatedSalary;
        });
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

    const toggleExpand = async (id) => {
        // Toggle the expanded state
        setExpandedCards(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));

        // If expanding, fetch the salary details
        if (!expandedCards[id]) {
            try {
                const response = await api.get(`/api/attendance/salaryattendance/${id}`); // Adjust the API endpoint as needed
                setSalaryDetails(prevDetails => ({
                    ...prevDetails,
                    [id]: response.data // Store fetched details for this salary ID
                }));
            } catch (error) {
                console.error('Failed to fetch salary details:', error);
            }
        }
    };

    const getDaysInMonth = () => {
        const date = new Date();
        const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        return Array.from({ length: daysInMonth }, (_, index) => index + 1);
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
                        <div className='w-1/5 text-center text-xl font-bold text-white'>User ID</div>
                        <div className='w-1/5 text-center text-xl font-bold text-white'>Total Salary</div>
                        <div className='w-1/4 text-center text-xl font-bold text-white'>Allowance</div>
                    </div>
                    <ul>
                        {filteredSalaries.map((salary) => (
                            <li key={salary._id} className="mb-4 p-4 bg-[#75A47F] border border-[#BACD92] rounded-md">
                                <div className="flex items-center justify-between">
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
                                        <button
                                            className="bg-blue-400 text-white text-sm px-3 py-1 rounded hover:bg-blue-500"
                                            onClick={() => toggleExpand(salary._id)}
                                        >
                                            {expandedCards[salary._id] ? 'Collapse' : 'Expand'}
                                        </button>
                                    </div>
                                </div>

                                {expandedCards[salary._id] && (
                                    <div className="mt-4 overflow-hidden transition-all duration-300 ease-in-out">
                                        <table className="table-auto w-full bg-white bg-opacity-50">
                                            <thead>
                                                <tr className="bg-gray-200">
                                                    <th className="px-4 py-2">Date</th>
                                                    <th className="px-4 py-2">Start Time</th>
                                                    <th className="px-4 py-2">End Time</th>
                                                    <th className="px-4 py-2">OT Hours</th>
                                                    <th className="px-4 py-2">OT Price</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {salaryDetails[salary._id]?.map((detail, index) => (
                                                    <tr key={index}>
                                                        <td className="border px-4 py-2">{detail.date}</td>
                                                        <td className="border px-4 py-2">{detail.startTime}</td>
                                                        <td className="border px-4 py-2">{detail.endTime}</td>
                                                        <td className="border px-4 py-2">{detail.otHours}</td>
                                                        <td className="border px-4 py-2">{detail.otPrice}</td>
                                                    </tr>
                                                )) || (
                                                    <tr>
                                                        <td className="border px-4 py-2" colSpan="5">Loading...</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </>
            )}
            {isModalOpen && selectedSalary && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-5 rounded-md shadow-lg">
                        <h2 className="text-2xl font-bold mb-4">Edit Salary Entry</h2>
                        <form>
                            {Object.keys(selectedSalary)
                                .filter(key => key !== '_id' && key !== '__v' && key !== 'salaryID' && key !== 'userID')  // Exclude _id, __v, salaryID, and userID
                                .map(key => (
                                    <div key={key} className="mb-4">
                                        <label className="block mb-1 font-bold capitalize">{key}</label>
                                        <input
                                            type="text"
                                            name={key}
                                            value={selectedSalary[key] || ''}
                                            onChange={handleChange}
                                            className="border p-2 w-full"
                                        />
                                    </div>
                                ))}
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="bg-green-400 text-white px-3 py-1 rounded hover:bg-green-500"
                                    onClick={handleSave}
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    className="bg-red-400 text-white px-3 py-1 rounded hover:bg-red-500 ml-2"
                                    onClick={handleModalClose}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewSalary;
