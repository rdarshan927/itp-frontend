import React, { useState } from 'react';
import { api } from '../../../config/api';
import Search from './Search';

const AddDelivery = () => {
    const [orderId, setOrderId] = useState("");
    const [receiverContactNo, setReceiverContactNo] = useState("");
    const [receiverName, setReceiverName] = useState("");
    const [senderEmail, setSenderEmail] = useState("");
    const [receiverAddress, setReceiverAddress] = useState("");
    const [delivererName, setDelivererName] = useState("");
    const [currentStatus, setCurrentStatus] = useState("");
    const [deliveryDate, setDeliveryDate] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [delivererNameError, setDelivererNameError] = useState("");

    const handleSearch = (packingData) => {
        if (packingData) {
            setOrderId(packingData.orderId);
            setReceiverContactNo(packingData.receivercontact);
            setReceiverName(packingData.receivername);
            setSenderEmail(packingData.senderemail);
            setReceiverAddress(packingData.receiveraddress);
            setDeliveryDate(packingData.deliveryDate);
            setIsModalVisible(true); // Show modal when data is found
        } else {
            setIsModalVisible(false); // Hide modal if no data is found
        }
    };

    const validateDelivererName = () => {
        const regex = /^[A-Za-z\s]+$/; // Regex for letters and spaces only
        if (!regex.test(delivererName)) {
            setDelivererNameError("Deliverer Name should contain letters only.");
            return false;
        }
        setDelivererNameError(""); // Clear error if valid
        return true;
    };

    const handleAddDelivery = async () => {
        if (!validateDelivererName()) return; // Validate before proceeding

        const newDelivery = {
            orderId,
            senderEmail,
            receivername: receiverName,
            receiveraddress: receiverAddress,
            receivercontact: receiverContactNo,
            delivererName,
            currentStatus,
            deliveryDate,
        };

        try {
            await api.post('/api/deliveries/add', newDelivery); // Ensure the correct URL
            console.log("Delivery added successfully");
            alert("Delivery added");
            setIsModalVisible(false); // Close the modal after adding
        } catch (error) {
            console.error("Error adding delivery:", error);
            alert("Error adding delivery");
        }
    };

    return (
        <div>
            <Search onSearch={handleSearch} />

            {/* Modal */}
            {isModalVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-1/2">
                        <h2 className="text-2xl font-bold mb-4">Add Delivery</h2>
                        <form>
                            <div className="flex mb-4">
                                <div className="w-1/3 pr-2">
                                    <label htmlFor="orderId" className="block text-xl font-bold mb-2">Order ID:</label>
                                    <input
                                        type="text"
                                        id="orderId"
                                        className="w-full rounded-md px-3 py-2 border"
                                        value={orderId}
                                        disabled
                                    />
                                </div>
                                <div className="w-1/3 pl-2">
                                    <label htmlFor="receiverContactNo" className="block text-xl font-bold mb-2">Receiver Contact No:</label>
                                    <input
                                        type="text"
                                        id="receiverContactNo"
                                        className="w-full rounded-md px-3 py-2 border"
                                        value={receiverContactNo}
                                        disabled
                                    />
                                </div>
                            </div>

                            <div className="flex mb-4">
                                <div className="w-1/3 pr-2">
                                    <label htmlFor="receiverName" className="block text-xl font-bold mb-2">Receiver Name:</label>
                                    <input
                                        type="text"
                                        id="receiverName"
                                        className="w-full rounded-md px-3 py-2 border"
                                        value={receiverName}
                                        disabled
                                    />
                                </div>
                                <div className="w-1/3 pl-2">
                                    <label htmlFor="senderEmail" className="block text-xl font-bold mb-2">Sender Email:</label>
                                    <input
                                        type="text"
                                        id="senderEmail"
                                        className="w-full rounded-md px-3 py-2 border"
                                        value={senderEmail}
                                        disabled
                                    />
                                </div>
                            </div>

                            <div className="flex mb-4">
                                <div className="w-1/3 pr-2">
                                    <label htmlFor="receiverAddress" className="block text-xl font-bold mb-2">Receiver Address:</label>
                                    <input
                                        type="text"
                                        id="receiverAddress"
                                        className="w-full rounded-md px-3 py-2 border"
                                        value={receiverAddress}
                                        disabled
                                    />
                                </div>
                               <div className="w-1/3 pl-2">
                                    <label htmlFor="deliveryDate" className="block text-xl text-black font-bold mb-2">Delivery Date:</label>
                                    <input
                                        type="date"
                                        id="deliveryDate"
                                        className="w-full rounded-md px-3 py-2 border"
                                        value={deliveryDate}
                                        onChange={(e) => setDeliveryDate(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex mb-4">
                                <div className="w-1/3 pr-2">
                                    <label htmlFor="delivererName" className="block text-xl font-bold mb-2">Deliverer Name:</label>
                                    <input
                                        type="text"
                                        id="delivererName"
                                        className="w-full rounded-md px-3 py-2 border"
                                        value={delivererName}
                                        onChange={(e) => setDelivererName(e.target.value)}
                                    />
                                    {delivererNameError && <div className="text-red-600">{delivererNameError}</div>} {/* Error message */}
                                </div>
                                <div className="w-1/3 pl-2">
                                    <label htmlFor="currentStatus" className="block text-xl font-bold mb-2">Current Status:</label>
                                    <select
                                        id="currentStatus"
                                        className="w-full rounded-md px-3 py-2 border"
                                        value={currentStatus}
                                        onChange={(e) => setCurrentStatus(e.target.value)}
                                    >
                                        <option value="Delivered">Delivered</option>
                                        <option value="Order is on the way">Order is on the way</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700 mt-5"
                                onClick={handleAddDelivery}
                            >
                                Add Delivery
                            </button>

                            <button
                                type="button"
                                className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700 mt-5 ml-4"
                                onClick={() => setIsModalVisible(false)} // Close modal
                            >
                                Close
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddDelivery;
