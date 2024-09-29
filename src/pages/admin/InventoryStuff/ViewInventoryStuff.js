import React, { useState, useEffect } from 'react';
import Search from './Search'; // Import the Search component
import { api } from '../../../config/api'; // Importing the api

const ViewInventoryStuff = () => {
    const [stuffEntries, setStuffEntries] = useState([]);
    const [filteredStuffEntries, setFilteredStuffEntries] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStuff, setSelectedStuff] = useState(null); // State for the selected item
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

    useEffect(() => {
        const fetchInventoryStuff = async () => {
            try {
                const response = await api.get('/api/inventorystuff/getall'); // Ensure this matches your backend route
                setStuffEntries(response.data.inventoryStuffs || []); // Adjust based on backend response structure
                setFilteredStuffEntries(response.data.inventoryStuffs || []);
            } catch (error) {
                console.error('Failed to fetch inventory stuff:', error);
            }
        };

        fetchInventoryStuff();
    }, []);

    useEffect(() => {
        const results = stuffEntries.filter(stuff => {
            const stuffID = stuff.stuffID ? stuff.stuffID.toString().toLowerCase() : '';
            const stuffName = stuff.stuffName ? stuff.stuffName.toLowerCase() : '';
            return stuffID.includes(searchTerm.toLowerCase()) || stuffName.includes(searchTerm.toLowerCase());
        });
        setFilteredStuffEntries(results);
    }, [searchTerm, stuffEntries]);

    const handleEdit = (stuff) => {
        setSelectedStuff(stuff);
        setIsModalOpen(true); // Open the modal
    };

    const handleModalClose = () => {
        setIsModalOpen(false); // Close the modal
        setSelectedStuff(null); // Clear selected stuff
    };

    const handleSave = async () => {
        try {
            await api.put(`/api/inventorystuff/update/${selectedStuff._id}`, selectedStuff);
            setStuffEntries(stuffEntries.map(stuff => stuff._id === selectedStuff._id ? selectedStuff : stuff));
            setFilteredStuffEntries(filteredStuffEntries.map(stuff => stuff._id === selectedStuff._id ? selectedStuff : stuff));
            setIsModalOpen(false); // Close the modal after saving
        } catch (error) {
            console.error('Failed to update inventory stuff:', error);
        }
    };

    const removeStuff = async (id) => {
        try {
            await api.delete(`/api/inventorystuff/delete/${id}`); // Ensure the route matches the backend
            setStuffEntries(stuffEntries.filter(stuff => stuff._id !== id));
            setFilteredStuffEntries(filteredStuffEntries.filter(stuff => stuff._id !== id));
        } catch (error) {
            console.error('Failed to delete inventory stuff:', error);
        }
    };

    const handleSearchChange = (term) => {
        setSearchTerm(term);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedStuff(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <div className="bg-[#BACD92] mt-5 p-3">
            <Search onSearchChange={handleSearchChange} />
            <h2 className="font-bold text-white mb-4 text-center text-5xl">Inventory Stuff Entries</h2>
            {filteredStuffEntries.length === 0 ? (
                <p className="text-center dark:text-white dark:bg-black text-2xl">No inventory items available.</p>
            ) : (
                <>
                    <div className='flex items-center w-full mb-3'>
                        <div className='w-1/5 text-center text-xl font-bold text-white'>StuffID</div>
                        <div className='w-1/6 text-center text-xl font-bold text-white'>Stuff Name</div> 
                        <div className='w-1/6 text-center text-xl font-bold text-white'>Price</div>
                        <div className='w-1/6 text-center text-xl font-bold text-white'>Amount</div>
                        <div className='w-1/6 text-center text-xl font-bold text-white'>Total Price</div>
                    </div>
                    <ul>
                        {filteredStuffEntries.map((stuff) => (
                            <li key={stuff._id} className="flex items-center justify-between mb-4 p-4 bg-[#75A47F] border border-[#BACD92] rounded-md">
                                <div className="flex-1 text-white flex items-center">
                                    <div className="w-1/5 px-2 text-center text-2xl">{stuff.stuffID}</div>
                                    <div className="w-1/5 px-2 text-center text-2xl">{stuff.stuffName}</div>
                                    <div className="w-1/5 px-2 text-center text-2xl">{stuff.price}</div>
                                    <div className="w-1/5 px-2 text-center text-2xl">{stuff.amount}</div>
                                    <div className="w-1/5 px-2 text-center text-2xl">{stuff.totalPrice}</div>
                                </div>
                                <div className="flex space-x-2">
                                    <button 
                                        className="bg-yellow-400 text-white text-sm px-3 py-1 rounded hover:bg-yellow-500"
                                        onClick={() => handleEdit(stuff)}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        className="bg-red-400 text-white text-sm px-3 py-1 rounded hover:bg-red-500"
                                        onClick={() => removeStuff(stuff._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </>
            )}

            {/* Modal for editing inventory stuff */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-5 rounded-md shadow-lg">
                        <h2 className="text-2xl font-bold mb-4">Edit Inventory Stuff</h2>
                        <div className="mb-2">
                            <label className="block font-bold mb-1">StuffID:</label>
                            <input
                                type="text"
                                name="stuffID"
                                value={selectedStuff.stuffID}
                                onChange={handleChange}
                                className="border p-2 w-full"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block font-bold mb-1">Stuff Name:</label>
                            <input
                                type="text"
                                name="stuffName"
                                value={selectedStuff.stuffName}
                                onChange={handleChange}
                                className="border p-2 w-full"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block font-bold mb-1">Price:</label>
                            <input
                                type="text"
                                name="price"
                                value={selectedStuff.price}
                                onChange={handleChange}
                                className="border p-2 w-full"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block font-bold mb-1">Amount:</label>
                            <input
                                type="text"
                                name="amount"
                                value={selectedStuff.amount}
                                onChange={handleChange}
                                className="border p-2 w-full"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block font-bold mb-1">Total Price:</label>
                            <input
                                type="text"
                                name="totalPrice"
                                value={selectedStuff.totalPrice}
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
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
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
}

export default ViewInventoryStuff;
