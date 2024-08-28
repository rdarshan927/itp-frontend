import React, { useState, useEffect } from 'react';
import { api } from '../../../config/api'; // Importing the api

function AddInventoryStuff() {
    const [stuffID, setStuffID] = useState('');
    const [stuffName, setStuffName] = useState('');
    const [price, setPrice] = useState('');
    const [amount, setAmount] = useState('');
    const [totalPrice, setTotalPrice] = useState('');

    useEffect(() => {
        if (price && amount) {
            const total = parseFloat(price) * parseInt(amount);
            setTotalPrice(total.toFixed(2));
        } else {
            setTotalPrice('');
        }
    }, [price, amount]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newInventoryStuff = {
            stuffID,
            stuffName,
            price,
            amount,
            totalPrice
        };

        try {
            await api.post('/api/inventorystuff/create', newInventoryStuff);
            alert('Inventory stuff added successfully!');
            // Reset the form
            setStuffID('');
            setStuffName('');
            setPrice('');
            setAmount('');
            setTotalPrice('');
        } catch (error) {
            console.error('Failed to add inventory stuff:', error);
            alert('Error adding inventory stuff.');
        }
    };

    return (
        <>
            <div className="bg-darkG p-6">
                <h1 className="text-5xl font-bold text-white mb-6 text-center">Add Inventory Stuff</h1>
                <form className='relative left-56' onSubmit={handleSubmit}>
                    <div className="flex mb-4">
                        <div className="w-1/3 pr-2">
                            <label htmlFor="stuffID" className="block text-2xl text-white font-bold mb-2">Stuff ID:</label>
                            <input 
                                type="text" 
                                id="stuffID" 
                                className="w-full rounded-md px-3 py-2 bg-lightG text-white text-3xl" 
                                value={stuffID}
                                onChange={(e) => setStuffID(e.target.value)}
                                required
                            />
                        </div>
                        <div className="w-1/3 pl-2">
                            <label htmlFor="stuffName" className="block text-2xl text-white font-bold mb-2">Stuff Name:</label>
                            <input 
                                type="text" 
                                id="stuffName" 
                                className="w-full rounded-md px-3 py-2 bg-lightG text-white text-3xl" 
                                value={stuffName}
                                onChange={(e) => setStuffName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex mb-4">
                        <div className="w-1/3 pr-2">
                            <label htmlFor="price" className="block text-2xl text-white font-bold mb-2">Price:</label>
                            <input 
                                type="text" 
                                id="price" 
                                className="w-full rounded-md px-3 py-2 bg-lightG text-white text-3xl" 
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                            />
                        </div>
                        <div className="w-1/3 pl-2">
                            <label htmlFor="amount" className="block text-2xl text-white font-bold mb-2">Amount:</label>
                            <input 
                                type="text" 
                                id="amount" 
                                className="w-full rounded-md px-3 py-2 bg-lightG text-white text-3xl" 
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex mb-4">
                        <div className="w-1/3 pr-2">
                            <label htmlFor="totalPrice" className="block text-2xl text-white font-bold mb-2">Total Price:</label>
                            <input 
                                type="text" 
                                id="totalPrice" 
                                className="w-full rounded-md px-3 py-2 bg-lightG text-white text-3xl" 
                                value={totalPrice}
                                readOnly
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="bg-lightG text-white font-bold py-2 px-12 rounded text-2xl mt-5 hover:bg-[#c9d5b0]"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </>
    );
}

export default AddInventoryStuff;
