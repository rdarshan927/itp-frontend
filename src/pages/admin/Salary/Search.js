import React from 'react';

function Search({ searchTerm, onSearchChange }) {
    function handleSearchChange(event) {
        onSearchChange(event.target.value);
    }

    return (
        <div className='mt-1'>
            <div className="flex justify-end items-center space-x-2">
                <input
                    type="text"
                    placeholder="Enter search term..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-1/4 p-3 rounded-md border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-green-600"
                />
            </div>
        </div>
    );
}

export default Search;
