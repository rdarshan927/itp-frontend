import React, { useState } from 'react';

function Search() {
    const [searchTerm, setSearchTerm] = useState('');


    function handleSearchChange(event) {
        setSearchTerm(event.target.value);
    }

    

    return (
        <div className='mt-1'>
            <div className="flex justify-end items-center space-x-2">
                <input
                    type="text"
                    placeholder="Enter search term..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-1/4 p-3 rounded-md border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    
                    className="p-3 bg-darkG text-white font-bold rounded-md shadow-md  focus:outline-none"
                >
                    Search
                </button>
            </div>
        </div>
    );
}

export default Search;


// etf-3% epf-15%