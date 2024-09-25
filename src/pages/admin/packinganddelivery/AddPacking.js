import React, { useEffect, useState } from "react";
import { api } from "../../../config/api";

function AddPacking() {
    const [orderId, setOrderId] = useState('');
    const [receivercontact, setReceiverContact] = useState('');
    const [receivername, setReceiverName] = useState('');
    const [senderemail, setSenderEmail] = useState('');
    const [receiveraddress, setReceiverAddress] = useState('');
    const [packingdate, setPackingDate] = useState('');
    const [currentstatus, setCurrentStatus] = useState('Packing');
    const [packing, setPacking] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPacking();
    }, []);

    const fetchPacking = async () => {
        try {
            const response = await api.get('/api/packing/get');
            setPacking(response.data);
        } catch (error) {
            console.error('Error fetching packing:', error);
        }
    };

    const handleAddPacking = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setLoading(true);
        setError('');

        const PackingData = {
            orderId,
            receivercontact,
            receivername,
            senderemail,
            receiveraddress,
            packingdate,
            currentstatus,
        };

        try {
            const response = await api.post('/api/packing/add', PackingData);
            console.log(response.data);

            // Update the state with the new packing data
            setPacking([...packing, PackingData]);

            // Clear input fields after submission
            setOrderId('');
            setReceiverContact('');
            setReceiverName('');
            setSenderEmail('');
            setReceiverAddress('');
            setPackingDate('');
            setCurrentStatus('Packing');
        } catch (error) {
            console.error('There was an error!', error);
            setError('Failed to add packing details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="bg-darkG p-6">
                <h1 className="text-5xl font-bold text-black mb-6 text-center">
                    {isEditing ? "Edit Packing Details" : "Add Packing Details"}
                </h1>
                <form className="relative left-56" onSubmit={handleAddPacking}>
                    <div className="flex mb-4">
                        <div className="w-1/3 pr-2">
                            <label htmlFor="orderId" className="block text-2xl text-black font-bold mb-2">Order ID:</label>
                            <input
                                type="text"
                                id="orderId"
                                className="w-full rounded-md px-3 py-2 bg-lightG text-black text-3xl"
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                required
                            />
                        </div>
                        <div className="w-1/3 pl-2">
                            <label htmlFor="receivercontact" className="block text-2xl text-black font-bold mb-2">Receiver Contact No:</label>
                            <input
                                type="text"
                                id="receivercontact"
                                className="w-full rounded-md px-3 py-2 bg-lightG text-black text-3xl"
                                value={receivercontact}
                                onChange={(e) => setReceiverContact(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex mb-4">
                        <div className="w-1/3 pr-2">
                            <label htmlFor="receivername" className="block text-2xl text-black font-bold mb-2">Receiver Name:</label>
                            <input
                                type="text"
                                id="receivername"
                                className="w-full rounded-md px-3 py-2 bg-lightG text-black text-3xl"
                                value={receivername}
                                onChange={(e) => setReceiverName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="w-1/3 pl-2">
                            <label htmlFor="sendermail" className="block text-2xl text-black font-bold mb-2">Sender Email:</label>
                            <input
                                type="email"
                                id="sendermail"
                                className="w-full rounded-md px-3 py-2 bg-lightG text-black text-3xl"
                                value={senderemail}
                                onChange={(e) => setSenderEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex mb-4">
                        <div className="w-1/3 pr-2">
                            <label htmlFor="receiveraddress" className="block text-2xl text-black font-bold mb-2">Receiver Address:</label>
                            <input
                                type="text"
                                id="receiveraddress"
                                className="w-full rounded-md px-3 py-2 bg-lightG text-black text-3xl"
                                value={receiveraddress}
                                onChange={(e) => setReceiverAddress(e.target.value)}
                                required
                            />
                        </div>

                        <div className="w-1/3 pl-2">
                            <label htmlFor="packingdate" className="block text-2xl text-black font-bold mb-2">Packing Date:</label>
                            <input
                                type="date"
                                id="packingdate"
                                className="w-full rounded-md px-3 py-2 bg-lightG text-black text-3xl"
                                value={packingdate}
                                onChange={(e) => setPackingDate(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex mb-4">
                        <div className="w-1/3 pr-2">
                            <label htmlFor="currentstatus" className="block text-2xl text-black font-bold mb-2">Current Status:</label>
                            <select
                                id="currentstatus"
                                className="w-full rounded-md px-3 py-2 bg-lightG text-black text-3xl"
                                value={currentstatus}
                                onChange={(e) => setCurrentStatus(e.target.value)}
                            >
                                <option value="Packing">Packing</option>
                                <option value="Hand Over to Delivery">Hand Over to Delivery</option>
                            </select>
                        </div>
                    </div>

                    {error && <p className="text-red-500">{error}</p>} {/* Display error message */}

                    <button
                        type="submit" 
                        className="bg-lightG text-black font-bold py-2 px-12 rounded text-2xl mt-5 hover:bg-[#c9d5b0]"
                        disabled={loading}
                    >
                        {loading ? "Adding..." : "ADD"}
                    </button>
                </form>
            </div>
        </>
    );
}

export default AddPacking;
