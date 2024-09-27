import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { api } from '../../../config/api'; // Importing the api

function AddInventoryStuff() {
    const [stuffID, setStuffID] = useState('');
    const [stuffName, setStuffName] = useState('');
    const [price, setPrice] = useState('');
    const [amount, setAmount] = useState('');
    const [totalPrice, setTotalPrice] = useState('');

    useEffect(() => {
        if (!isNaN(price) && !isNaN(amount) && price && amount) {
            const total = parseFloat(price) * parseInt(amount);
            setTotalPrice(total.toFixed(2));
        } else {
            setTotalPrice('');
        }
    }, [price, amount]);

    // Validate inputs
    const validateInputs = () => {
        const validationErrors = {};

        const stuffIDPattern = /^[A-Za-z]{2}\d{3}$/; // Example : AB123
        const stuffNamePattern = /^[A-Za-z\s]{10,20}$/; //  10-20 letters
        const pricePattern = /^\d+(\.\d{1,2})?$/; // Only numbers with 2 decimal places
        const amountPattern = /^\d+$/; // Only positive integers

        // Validate stuffID
        if (!stuffID.match(stuffIDPattern)) {
            validationErrors.stuffID = 'Stuff ID must be 5-10 alphanumeric characters.';
        }

        // Validate stuffName
        if (!stuffName.match(stuffNamePattern)) {
            validationErrors.stuffName = 'Stuff name must be 2-50 letters.';
        }

        // Validate price
        if (!price.match(pricePattern)) {
            validationErrors.price = 'Price must be a valid number with up to 2 decimal places.';
        }

        // Validate amount
        if (!amount.match(amountPattern)) {
            validationErrors.amount = 'Amount must be a valid positive integer.';
        }

        return validationErrors;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateInputs();

        if (Object.keys(validationErrors).length > 0) {
            // check if there are any validation error in the form
            for (const error in validationErrors) {
                toast.error(validationErrors[error]);
            }
            return;
        }

        const newInventoryStuff = {
            stuffID,
            stuffName,
            price: parseFloat(price),
            amount: parseInt(amount),
            totalPrice: parseFloat(totalPrice),
        };

        try {
            await api.post('/api/inventorystuff/create', newInventoryStuff);
            toast.success('Inventory stuff added successfully!');
            
            // clear the form after adding the salary record
            setStuffID('');
            setStuffName('');
            setPrice('');
            setAmount('');
            setTotalPrice('');
        } catch (error) {
            console.error('Failed to add inventory stuff:', error);
            toast.error('Error adding inventory stuff.');
        }
    };

    return (
        <div className="bg-darkG p-6">
            
            <Toaster position="top-right" reverseOrder={false} />
            <h1 className="text-5xl font-bold text-white mb-6 text-center">Add Inventory Stuff</h1>
            <form className="mx-auto max-w-3xl" onSubmit={handleSubmit}>
                <div className="flex flex-wrap mb-4">
                    <div className="w-full md:w-1/2 pr-2 mb-4 md:mb-0">
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
                    <div className="w-full md:w-1/2 pl-2">
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

                <div className="flex flex-wrap mb-4">
                    <div className="w-full md:w-1/2 pr-2 mb-4 md:mb-0">
                        <label htmlFor="price" className="block text-2xl text-white font-bold mb-2">Price:</label>
                        <input
                            type="number"
                            step="0.01"
                            id="price"
                            className="w-full rounded-md px-3 py-2 bg-lightG text-white text-3xl"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </div>
                    <div className="w-full md:w-1/2 pl-2">
                        <label htmlFor="amount" className="block text-2xl text-white font-bold mb-2">Amount:</label>
                        <input
                            type="number"
                            id="amount"
                            className="w-full rounded-md px-3 py-2 bg-lightG text-white text-3xl"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="totalPrice" className="block text-2xl text-white font-bold mb-2">Total Price:</label>
                    <input
                        type="text"
                        id="totalPrice"
                        className="w-full rounded-md px-3 py-2 bg-lightG text-white text-3xl"
                        value={totalPrice}
                        readOnly
                    />
                </div>

                <button
                    type="submit"
                    className="bg-lightG text-white font-bold py-2 px-12 rounded text-2xl mt-5 hover:bg-[#c9d5b0]"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}

export default AddInventoryStuff;
