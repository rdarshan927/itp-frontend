
import React, { useEffect, useState } from "react";
import { api } from "../../../config/api";

const ViewDelivery = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [editDelivery, setEditDelivery] = useState(null); // For the popup form
    const [deliveryStatus, setDeliveryStatus] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');

    useEffect(() => {
        fetchDeliveries();
    }, []);

    const fetchDeliveries = async () => {
        try {
            const response = await api.get('/api/deliveries/get');
            setDeliveries(response.data);
        } catch (error) {
            console.error('Error fetching deliveries:', error);
        }
    };

    const handleEditClick = (delivery) => {
        setEditDelivery(delivery); // Set the selected delivery for editing
        setDeliveryStatus(delivery.currentStatus);
        setDeliveryDate(delivery.deliveryDate);
    };

    const handleDeleteClick = async (id) => {
        try {
            await api.delete(`/api/deliveries/${id}`);
            fetchDeliveries(); // Refresh the deliveries after deletion
        } catch (error) {
            console.error('Error deleting delivery:', error);
        }
    };

    const handleUpdate = async () => {
        try {
            const updatedData = {
                currentStatus: deliveryStatus,
                deliveryDate
            };
            await api.put(`/api/deliveries/${editDelivery._id}`, updatedData);
            setEditDelivery(null); // Close the popup
            fetchDeliveries(); // Refresh the list
        } catch (error) {
            console.error('Error updating delivery:', error);
        }
    };

    return (
        <div className="bg-[#BACD92] mt-10 p-6">
            <h2 className="font-bold text-black mb-4 text-center text-5xl">Delivered Orders</h2>
            <div className='flex items-center w-11/12 mb-3'>
                <div className='w-1/5 text-left text-xl font-bold text-black'>Order ID</div>
                <div className='w-1/5 text-left text-xl font-bold text-black'>Delivery Status</div>
                <div className='w-1/5 text-left text-xl font-bold text-black'>Sender Email</div>
                <div className='w-1/5 text-left text-xl font-bold text-black'>Download Receipt</div>
                <div className='w-1/5 text-left text-xl font-bold text-black'>Send Email</div>
            </div>
            <ul>
                {deliveries.map((delivery) => (
                    <li key={delivery._id} className="flex items-center justify-between mb-4 p-4 bg-[#75A47F] border border-[#BACD92] rounded-md">
                        <div className="flex-1 flex items-center">
                            <div className="w-1/5 text-left px-2 text-2xl">{delivery.orderId}</div>
                            <div className="w-1/5 text-left px-2 text-2xl">{delivery.currentStatus}</div>
                            <div className="w-1/5 text-left px-2 text-2xl">{delivery.senderEmail}</div>
                            <div className="w-1/5 text-left px-2 text-2xl">
                                <button className="bg-[#BACD92] text-black text-sm px-4 py-2 rounded-full hover:bg-green-700">
                                    <i className="fas fa-download"></i> Download
                                </button>
                            </div>
                            <div className="w-1/5 text-left px-2 text-2xl">
                                <button className="bg-[#BACD92] text-black text-sm px-4 py-2 rounded-full hover:bg-green-700">
                                    <i className="fas fa-paper-plane"></i> Send Email
                                </button>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <button 
                                className="bg-yellow-400 text-black text-sm px-3 py-1 rounded hover:bg-yellow-500"
                                onClick={() => handleEditClick(delivery)}
                            >
                                Edit
                            </button>
                            <button 
                                className="bg-red-400 text-black text-sm px-3 py-1 rounded hover:bg-red-500"
                                onClick={() => handleDeleteClick(delivery._id)}
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Popup Form for Editing */}
            {editDelivery && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-md">
                        <h3 className="text-2xl mb-4">Edit Delivery</h3>

                        {/* Order ID (Disabled) */}
                        <div>
                            <label className="block mb-2">Order ID:</label>
                            <input 
                                type="text" 
                                value={editDelivery.orderId} 
                                disabled // Disable this field
                                className="border p-2 mb-4 w-full bg-gray-100"
                            />
                        </div>

                        {/* Delivery Status (Dropdown) */}
                        <div>
                            <label className="block mb-2">Delivery Status:</label>
                            <select 
                                value={deliveryStatus} 
                                onChange={(e) => setDeliveryStatus(e.target.value)} 
                                className="border p-2 mb-4 w-full"
                            >
                                <option value="Delivered">Delivered</option>
                                <option value="Order is on the way">Order is on the way</option>
                            </select>
                        </div>

                        {/* Delivery Date */}
                        <div>
                            <label className="block mb-2">Delivery Date:</label>
                            <input 
                                type="date" 
                                value={deliveryDate} 
                                onChange={(e) => setDeliveryDate(e.target.value)} 
                                className="border p-2 mb-4 w-full"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end">
                            <button 
                                className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                                onClick={handleUpdate}
                            >
                                Update
                            </button>
                            <button 
                                className="bg-red-500 text-white px-4 py-2 rounded"
                                onClick={() => setEditDelivery(null)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ViewDelivery;
