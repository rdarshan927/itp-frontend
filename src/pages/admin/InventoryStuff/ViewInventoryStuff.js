import React, { useState, useEffect } from 'react';
import { api } from '../../../config/api'; // Importing the api

const ViewInventoryStuff = () => {
    const [stuffEntries, setStuffEntries] = useState([]);

    useEffect(() => {
        const fetchInventoryStuff = async () => {
            try {
                const response = await api.get('/api/inventorystuff/getall');
                setStuffEntries(response.data);
            } catch (error) {
                console.error('Failed to fetch inventory stuff:', error);
            }
        };

        fetchInventoryStuff();
    }, []);

    const handleEdit = (index) => {
        const stuffEntry = stuffEntries[index];
        // Implement logic to populate the form in AddInventoryStuff.js with this data
        removeStuff(stuffEntry._id);
    };

    const removeStuff = async (id) => {
        try {
            await api.delete(`/inventorystuff/delete/${id}`);
            setStuffEntries(stuffEntries.filter(stuff => stuff._id !== id));
        } catch (error) {
            console.error('Failed to delete inventory stuff:', error);
        }
    };

    return (
        <div className="bg-[#BACD92] mt-5 p-3">
            <h2 className="font-bold text-white mb-4 text-center text-5xl">Inventory Stuff Entries</h2>
            <div className='flex items-center w-11/12 mb-3'>
                <div className='w-1/5 text-center text-xl font-bold text-white'>Stuff ID</div>
                <div className='w-1/5 text-center text-xl font-bold text-white'>Stuff Name</div>
                <div className='w-1/5 text-center text-xl font-bold text-white'>Price</div>
                <div className='w-1/5 text-center text-xl font-bold text-white'>Amount</div>
                <div className='w-1/5 text-center text-xl font-bold text-white'>Total Price</div>
            </div>
            <ul>
                {stuffEntries.map((stuff, index) => (
                    <li key={stuff._id} className="flex items-center justify-between mb-4 p-4 bg-[#75A47F] border border-[#BACD92] rounded-md">
                        <div className="flex-1 text-white flex items-center">
                            <div className="w-1/5 px-2 text-center text-2xl">{stuff.staffId}</div>
                            <div className="w-1/5 px-2 text-center text-2xl">{stuff.staffName}</div>
                            <div className="w-1/5 px-2 text-center text-2xl">{stuff.price}</div>
                            <div className="w-1/5 px-2 text-center text-2xl">{stuff.amount}</div>
                            <div className="w-1/5 px-2 text-center text-2xl">{stuff.totalPrice}</div>
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
                                onClick={() => removeStuff(stuff._id)}
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ViewInventoryStuff;
