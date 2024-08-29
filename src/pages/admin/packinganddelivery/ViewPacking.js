import React, { useEffect, useState } from "react";
import { api } from "../../../config/api";

const ViewPacking = () => {
    const [orderId, setOrderId] = useState('');
    const [receivercontact, setReceiverContact] = useState('');
    const [receivername, setReceiverName] = useState('');
    const [senderemail, setSenderEmail] = useState('');
    const [receiveraddress, setReceiverAddress] = useState('');
    const [packingdate, setPackingDate] = useState('');
    const [currentstatus, setCurrentStatus] = useState('');
    //const [qrcode, setQRCode] = useState('');
    const [packing, setPacking] = useState([]);

    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(null);


    useEffect(() => {
        fetchPacking();
    }, []);

    const fetchPacking = async () => {
        try {
            const response = await api.get('/api/packing/get');
            console.log('Packing Data:', response.data);
            setPacking(response.data);
        } catch (error) {
            console.error('Error fetching packing:', error);
        }
    };


    const handleUpdatePacking = async () => {
        const updatedPacking = {
            orderId,
            receivercontact,
            receivername,
            senderemail,
            receiveraddress,
            packingdate,
            currentstatus,
        };

        try {
            await api.put(`/api/packing/update/${editIndex}`, updatedPacking);
            fetchPacking();
            clearForm();
            setIsEditing(false); // Close modal
        } catch (error) {
            console.error('Error updating packing:', error);
        }
    };

    function handleEdit(index) { 
        const selectedPacking = packing[index];
        setOrderId(selectedPacking.orderId);
        setReceiverContact(selectedPacking.receivercontact);
        setReceiverName(selectedPacking.receivername);
        setSenderEmail(selectedPacking.senderemail);
        setReceiverAddress(selectedPacking.receiveraddress);
        setPackingDate(selectedPacking.packingdate.split('T')[0]);
        setCurrentStatus(selectedPacking.currentstatus || "");
        setIsEditing(true);
        setEditIndex(selectedPacking._id);
        
    };

    const handleDelete = async (index) => {
        try {
            await api.delete(`/api/packing/delete/${packing[index]._id}`);
            fetchPacking();
        } catch (error) {
            console.error('Error deleting order:', error);
        }
    };

    
    


    const clearForm = () => {
        setOrderId('');
        setReceiverContact('');
        setReceiverName('');
        setSenderEmail('');
        setReceiverAddress('');
        setPackingDate('');
        setCurrentStatus('');
        setIsEditing(false);
        setEditIndex(null);
    };

    return (
        <div className="bg-[#BACD92] mt-10 p-6">
            <h2 className="font-bold text-white mb-4 text-center text-5xl">Packed Orders</h2>
            <div className="flex items-center w-11/12 mb-3">
                
                <div className="w-1/4 text-center text-xl font-bold text-white">Order ID</div>
                <div className="w-1/4 text-center text-xl font-bold text-white">Packing Date</div>
                <div className="w-1/4 text-center text-xl font-bold text-white">Current Status</div>
                <div className="w-1/4 text-center text-xl font-bold text-white">Download QR</div>
            </div>
            <ul>
                {packing.map((selectedPacking, index) => (
                    <li key={index} className="flex items-center justify-between mb-4 p-4 bg-[#75A47F] border border-[#BACD92] rounded-md">
                        <div className="flex-1 text-white flex items-center">
                            <div className="w-1/4 px-2 text-center text-2xl">{selectedPacking.orderId}</div>
                            <div className="w-1/4 px-2 text-center text-2xl">{selectedPacking.packingdate.split('T')[0]}</div>
                            <div className="w-1/4 px-2 text-center text-2xl">
                                {selectedPacking.currentstatus}</div>
                            <div className="w-1/4 px-2 text-center text-2xl">
                                {selectedPacking.qrcode} 
                                <button className="bg-[#BACD92] text-black text-sm px-4 py-2 rounded-full hover:bg-green-700">
                                    <i className="fas fa-check"></i> QR
                                </button>
                            </div>
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
                                onClick={() => handleDelete(index)}
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            {/* Popup Modal for Editing */}
            {isEditing && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-darkG p-6 rounded-lg w-1/2">
                        <h2 className="text-3xl font-bold mb-4">Edit Packing Details</h2>
                        <form>
                            <div className="mb-4">
                                <label className="block text-xl font-bold mb-2 ">Order ID</label>
                                <input 
                                    type="text"
                                    className="w-full p-2  rounded-md bg-lightG"
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                    disabled
                                />
                            </div>
                            <div className="mb-4">
                            <label className="block text-xl font-bold mb-2">Packing Date</label>
                            <input
                                type="date"
                                className="w-full p-2   rounded-md bg-lightG"
                                value={packingdate}
                                onChange={(e) => setPackingDate(e.target.value)}
                               
                            />
                        </div>
                            {/* Add other input fields similarly */}
                            <div className="mb-4">
                                <label className="block text-xl font-bold mb-2">Current Status</label>
                                <select
                                    className="w-full p-2  rounded-md bg-lightG"
                                    value={currentstatus}
                                    onChange={(e) => setCurrentStatus(e.target.value)}
                                >
                                    <option value="Packing">Packing</option>
                                    <option value="Hand Over to Delivery">Hand Over to Delivery</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    className="bg-lightG text-white px-4 py-2 rounded hover:bg-green-600"
                                    onClick={handleUpdatePacking}
                                >
                                    Update
                                </button>
                                <button
                                    type="button"
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                    onClick={clearForm}
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
}

export default ViewPacking;
