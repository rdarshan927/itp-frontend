import React, { useEffect, useState } from "react";

function adddelivery() {
    // State hooks for each input field and salary list
    const [orderId, setOrderId] = useState("");
    const [receiverContactNo, setReceiverContactNo] = useState("");
    const [receiverName, setReceiverName] = useState("");
    const [senderEmail, setSenderEmail] = useState("");
    const [receiverAddress, setReceiverAddress] = useState("");
    const [delivererName, setDelivererName] = useState("");

    const handleAddDelivery = async () => {
        const newDelivery = {
            orderId,
            receiverContactNo,
            receiverName,
            senderEmail,
            receiverAddress,
            delivererName,
        };

        try {
            const response = await axios.post("http://localhost:5000/api/deliveries", newDelivery);
            console.log("Delivery added:", response.data);
            // Clear the form or show a success message
        } catch (error) {
            console.error("There was an error adding the delivery:", error);
        }
    };
    return (
        <>
            <div className="bg-darkG p-6">
                <h1 className="text-5xl font-bold text-white mb-6 text-center">Add Delivery Details</h1>
                <form className='relative left-56'>
                    
                    <div className="flex mb-4">
                        <div className="w-1/3 pr-2">
                            <label htmlFor="salaryId" className="block text-2xl text-white font-bold mb-2">Order ID:</label>
                            <input 
                                type="text" 
                                id="salaryId" 
                                className="w-full rounded-md px-3 py-2 bg-lightG text-white text-3xl" 
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                required
                            />
                        </div>
                        <div className="w-1/3 pl-2">
                            <label htmlFor="userId" className="block text-2xl text-white font-bold mb-2">Receiver Contact No:</label>
                            <input 
                                 type="text" 
                                 id="orderId" 
                                 className="w-full rounded-md px-3 py-2 bg-lightG text-white text-3xl" 
                                 value={orderId}
                                 onChange={(e) => setReceiverContactNo(e.target.value)}
                                 required
                            />
                        </div>
                    </div>

                    {/* Flex container to align Base Salary and Allowances side by side */}
                    <div className="flex mb-4">
                        <div className="w-1/3 pr-2">
                            <label htmlFor="baseSalary" className="block text-2xl text-white font-bold mb-2">Receiver Name:</label>
                            <input 
                                type="text" 
                                id="receiverContactNo" 
                                className="w-full rounded-md px-3 py-2 bg-lightG text-white text-3xl" 
                                value={receiverName}
                                onChange={(e) => setReceiverName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="w-1/3 pl-2">
                            <label htmlFor="allowances" className="block text-2xl text-white font-bold mb-2">Sender Email:</label>
                            <input 
                                type="text" 
                                id="receiverName" 
                                className="w-full rounded-md px-3 py-2 bg-lightG text-white text-3xl" 
                                value={receiverName}
                                onChange={(e) => setSenderEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Flex container to align EPF and ETF side by side */}
                    <div className="flex mb-4">
                        <div className="w-1/3 pr-2">
                            <label htmlFor="epf" className="block text-2xl text-white font-bold mb-2">Receiver Address:</label>
                            <input 
                                 type="text" 
                                 id="senderEmail" 
                                 className="w-full rounded-md px-3 py-2 bg-lightG text-white text-3xl" 
                                 value={senderEmail}
                                 onChange={(e) => setReceiverAddress(e.target.value)}
                                 required
                            />
                        </div>
                        <div className="w-1/3 pl-2">
                            <label htmlFor="etf" className="block text-2xl text-white font-bold mb-2">Deliverer's Name:</label>
                            <input 
                                type="text" 
                                id="receiverAddress" 
                                className="w-full rounded-md px-3 py-2 bg-lightG text-white text-3xl" 
                                value={receiverAddress}
                                onChange={(e) => setDeliverersName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button 
                        type="button" 
                        className="bg-lightG text-white font-bold py-2 px-12 rounded text-2xl mt-5 hover:bg-[#c9d5b0] "
                        onClick={adddelivery}
                    >
                        ADD
                    </button>
                </form>
            </div>

            
        </>
    );

}
export default adddelivery;
