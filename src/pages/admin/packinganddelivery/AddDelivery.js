import React, { useState } from 'react';
import axios from 'axios';
import Search from './Search';

const AddDelivery = () => {
    const [orderId, setOrderId] = useState("");
    const [receiverContactNo, setReceiverContactNo] = useState("");
    const [receiverName, setReceiverName] = useState("");
    const [senderEmail, setSenderEmail] = useState("");
    const [receiverAddress, setReceiverAddress] = useState("");
    const [delivererName, setDelivererName] = useState("");
    const [currentStatus, setCurrentStatus] = useState("");
    const [deliveryDate, setdeliveryDate] = useState("");
    const [isFormVisible, setIsFormVisible] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [noResults, setNoResults] = useState(false);

    const handleSearch = (packingData) => {
     
        setOrderId(packingData.orderId);
        setReceiverContactNo(packingData.receivercontact);
        setReceiverName(packingData.receivername);
        setSenderEmail(packingData.senderemail);
        setReceiverAddress(packingData.receiveraddress);
        setdeliveryDate(packingData.deliveryDate);
        setIsFormVisible(true);
    };

    const handleAddDelivery = async () => {
        const newDelivery = {
            orderId,
            senderEmail,
            deliveryDate,
            delivererName,
            currentStatus
        };

        try {
            await axios.post('/api/deliveries', newDelivery);
            console.log("Delivery added successfully");
            alert("Delivery added");
        } catch (error) {
            console.error("Error adding delivery:", error);
        }
    };

    return (
        <div>
            <Search onSearch={handleSearch} />
            {isFormVisible && (
                <form className="relative left-56 mt-6">
                    <div className="flex mb-4">
                        <div className="w-1/3 pr-2">
                            <label htmlFor="orderId" className="block text-2xl text-white font-bold mb-2">Order ID:</label>
                            <input
                                type="text"
                                id="orderId"
                                className="w-full rounded-md px-3 py-2 bg-lightG text-white text-3xl"
                                value={orderId}
                                disabled
                            />
                        </div>
                        <div className="w-1/3 pl-2">
                            <label htmlFor="receiverContactNo" className="block text-2xl text-white font-bold mb-2">Receiver Contact No:</label>
                            <input
                                type="text"
                                id="receiverContactNo"
                                className="w-full rounded-md px-3 py-2 bg-lightG text-white text-3xl"
                                value={receiverContactNo}
                                disabled
                            />
                        </div>
                    </div>

                    <div className="flex mb-4">
                        <div className="w-1/3 pr-2">
                            <label htmlFor="receiverName" className="block text-2xl text-white font-bold mb-2">Receiver Name:</label>
                            <input
                                type="text"
                                id="receiverName"
                                className="w-full rounded-md px-3 py-2 bg-lightG text-white text-3xl"
                                value={receiverName}
                                disabled
                            />
                        </div>
                        <div className="w-1/3 pl-2">
                            <label htmlFor="senderEmail" className="block text-2xl text-white font-bold mb-2">Sender Email:</label>
                            <input
                                type="email"
                                id="senderEmail"
                                className="w-full rounded-md px-3 py-2 bg-lightG text-white text-3xl"
                                value={senderEmail}
                                disabled
                            />
                        </div>
                    </div>

                    <div className="flex mb-4">
                        <div className="w-1/3 pr-2">
                            <label htmlFor="receiverAddress" className="block text-2xl text-white font-bold mb-2">Receiver Address:</label>
                            <input
                                type="text"
                                id="receiverAddress"
                                className="w-full rounded-md px-3 py-2 bg-lightG text-white text-3xl"
                                value={receiverAddress}
                                disabled
                            />
                        </div>
                        <div className="w-1/3 pl-2">
                            <label htmlFor="delivererName" className="block text-2xl text-white font-bold mb-2">Deliverer's Name:</label>
                            <input
                                type="text"
                                id="delivererName"
                                className="w-full rounded-md px-3 py-2 bg-lightG text-white text-3xl"
                                value={delivererName}
                                onChange={(e) => setDelivererName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex mb-4">

                    <div className="w-1/3 pl-2">
                            <label htmlFor="deliveryDate" className="block text-2xl text-black font-bold mb-2">Delivery Date:</label>
                            <input
                                type="date"
                                id="deliveryDate"
                                className="w-full rounded-md px-3 py-2 bg-lightG text-black text-3xl"
                                value={deliveryDate}
                                onChange={(e) => setdeliveryDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className="w-1/3 pr-2">
                            <label htmlFor="currentStatus" className="block text-2xl text-white font-bold mb-2">Delivery Status:</label>
                            <select
                                id="currentStatus"
                                className="w-full rounded-md px-3 py-2 bg-lightG text-white text-3xl"
                                value={currentStatus}
                                onChange={(e) => setCurrentStatus(e.target.value)}
                               >
                                <option value="Packing">Delivered</option>
                                <option value="Hand Over to Delivery">Order is on the way</option>
                               </select>
                            
                        </div>
                    </div>

                  

                    <button
                        type="button"
                        className="bg-lightG text-white font-bold py-2 px-12 rounded text-2xl mt-5 hover:bg-[#c9d5b0]"
                        onClick={handleAddDelivery}
                    >
                        Add Delivery
                    </button>
                </form>
            )}
        </div>
    );
}

export default AddDelivery;
