import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Orders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/orders'); // Ensure backend route works
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const downloadPDF = () => {
        window.open('http://localhost:5000/api/orders/download-pdf', '_blank');
    };

    return (
        <div className="bg-[#BACD92] mt-10 p-6">
            <h2 className="font-bold text-black mb-4 text-center text-5xl">Orders</h2>

            <div className="grid grid-cols-5 gap-4 w-11/12 mx-auto mb-3">
                <div className="text-center text-2xl font-bold text-black">Order ID</div>
                <div className="text-center text-2xl font-bold text-black">Receiver Name</div>
                <div className="text-center text-2xl font-bold text-black">Receiver Address</div>
                <div className="text-center text-2xl font-bold text-black">Receiver Contact No</div>
                <div className="text-center text-2xl font-bold text-black">Sender Email</div>
            </div>

            <ul>
                {orders.map((order, index) => (
                    <li key={index} className="grid grid-cols-5 gap-4 mb-4 p-4 bg-[#75A47F] border border-[#BACD92] rounded-md w-11/12 mx-auto">
                        <div className="text-center text-xl text-black">{order.orderID}</div>
                        <div className="text-center text-xl text-black">{order.receiverName}</div>
                        <div className="text-center text-xl text-black">{order.receiverAddress}</div>
                        <div className="text-center text-xl text-black">{order.receiverContact}</div>
                        <div className="text-center text-xl text-black">{order.userEmail}</div>
                    </li>
                ))}
            </ul>

            <div className="flex justify-center mt-6">
                <button
                    onClick={downloadPDF}
                    className="bg-[#75A47F] hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
                >
                    DOWNLOAD
                </button>
            </div>
        </div>
    );
}

export default Orders;
