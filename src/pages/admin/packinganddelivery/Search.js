import React, { useState } from 'react';
import { api } from '../../../config/api';

function Search({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = async () => {
        try {
            const response = await api.get(`/api/packing/get/single/${searchTerm}`);
            if (response.data) {
                onSearch(response.data);  // Pass response data to parent component
                setError('');  // Clear error if data is found
            } else {
                setError('Order not found');
                onSearch(null);  // Pass null to hide the form if no data found
            }
        } catch (error) {
            setError('Error fetching packing data');
            console.error('Error fetching packing data:', error);
            onSearch(null);  // Pass null in case of error
        }
    };

    return (
        <div className='mt-1'>
            <div className="flex justify-start items-center space-x-2">
                <input
                    type="text"
                    placeholder="Enter order ID..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-1/4 p-3 rounded-md border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-black"
                />
                <button
                    onClick={handleSearch}
                    className="p-3 bg-darkG text-white font-bold rounded-md shadow-md focus:outline-none dark:bg-bOne"
                >
                    Search
                </button>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
}

export default Search;
