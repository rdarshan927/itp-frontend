
import React, { useState } from 'react';
import axios from 'axios';

function Search({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get(`/api/packings/${searchTerm}`);
            onSearch(response.data);
        } catch (error) {
            setError('Order not found');
            console.error('Error fetching packing data:', error);
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
    );
}

export default Search;
