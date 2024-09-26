import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';

function Orders() {
    const [orders, setOrders] = useState([]);
    const ordersRef = useRef(); // Reference for the orders section

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
    // Create a black-and-white style for the PDF generation with smaller font size
    const pdfStyle = `
        #orders-pdf div {
            background-color: white !important;
            color: black !important;
            border: 0px solid black !important;
            padding: 10px; /* Add padding for spacing */
            font-size: 10px; /* Make font smaller */
        }
        #orders-pdf {
            font-family: Arial, sans-serif;
            font-size: 10px; /* Make font smaller */
        }
        #orders-pdf ul {
            border: 0px solid black;
            border-collapse: collapse;
            margin: 10px 0; /* Add margin for spacing between rows */
        }
        #orders-pdf li {
            border: 0px solid black;
            padding: 10px; /* Add padding to individual items */
            font-size: 10px; /* Make font smaller */
        }
    `;
    
    // Temporarily apply black-and-white styles only for the PDF generation
    const styleElement = document.createElement('style');
    styleElement.innerHTML = pdfStyle;
    document.head.appendChild(styleElement);

    // Clone the ordersRef content to avoid affecting the actual page
    const clonedOrders = ordersRef.current.cloneNode(true);
    clonedOrders.id = 'orders-pdf'; // Change the ID to apply PDF-specific styles

    // Remove background colors from cloned orders
    const clonedOrdersList = clonedOrders.querySelector('ul');
    clonedOrdersList.style.background = 'none';
    const clonedOrdersItems = clonedOrdersList.querySelectorAll('li');
    clonedOrdersItems.forEach(item => {
        item.style.background = 'none';
    });

    const opt = {
        margin: 1,
        filename: 'orders.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Generate the PDF from the cloned, styled section
    html2pdf().from(clonedOrders).set(opt).save().finally(() => {
        // Remove the style element after PDF is generated
        document.head.removeChild(styleElement);
    });
};


    return (
        <div className="bg-[#BACD92] mt-10 p-6">
            <h2 className="font-bold text-black mb-4 text-center text-5xl">Orders</h2>

            {/* Use ref on this div to capture it for PDF */}
            <div ref={ordersRef}>
                <div className="grid grid-cols-5 gap-4 w-11/12 mx-auto mb-3">
                    <div className="text-center text-2xl font-bold">Order ID</div>
                    <div className="text-center text-2xl font-bold">Receiver Name</div>
                    <div className="text-center text-2xl font-bold">Receiver Address</div>
                    <div className="text-center text-2xl font-bold">Receiver Contact No</div>
                    <div className="text-center text-2xl font-bold">Sender Email</div>
                </div>

                <ul>
                    {orders.map((order, index) => (
                        <li key={index} className="grid grid-cols-5 gap-4 mb-4 p-4 bg-[#75A47F] border border-[#BACD92] rounded-md w-11/12 mx-auto">
                            <div className="text-center text-xl">{order.orderID}</div>
                            <div className="text-center text-xl">{order.receiverName}</div>
                            <div className="text-center text-xl">{order.receiverAddress}</div>
                            <div className="text-center text-xl">{order.receiverContact}</div>
                            <div className="text-center text-xl">{order.userEmail}</div>
                        </li>
                    ))}
                </ul>
            </div>

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
