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
        // Create a black-and-white style for the PDF generation
        const pdfStyle = `
            #orders-pdf {
                font-family: Arial, sans-serif;
                font-size: 13px; /* Decreased font size for PDF */
            }
            #orders-pdf table {
                width: 100%;
                border-collapse: collapse;
                margin: 10px 0; /* Add margin for spacing between rows */
            }
            #orders-pdf th, #orders-pdf td {
                border: 1px solid black; /* Add a border around table cells */
                padding: 12px 20px; /* Adjust padding (top-bottom 12px, left-right 20px) */
                text-align: center;
                font-size: 13px; /* Decrease font size for table cells */
                background-color: white; /* Ensure background is white */
                color: black; /* Set text color to black */
            }
            #orders-pdf th {
                color: black; /* Keep text color */
            }
            #orders-pdf tr:nth-child(even) {
                /* No background color for even rows */
            }
            #orders-pdf .pdf-title {
                font-size: 30px; /* Title font size */
                text-align: center;
                margin-bottom: 20px; /* Space between title and table */
                font-weight: bold; /* Make the title bold */
                color: black; /* Set text color to black */
            }
        `;
    
        // Temporarily apply black-and-white styles only for the PDF generation
        const styleElement = document.createElement('style');
        styleElement.innerHTML = pdfStyle;
        document.head.appendChild(styleElement);
    
        // Clone the ordersRef content to avoid affecting the actual page
        const clonedOrders = ordersRef.current.cloneNode(true);
        clonedOrders.id = 'orders-pdf'; // Change the ID to apply PDF-specific styles
    
        // Create a title element
        const titleElement = document.createElement('div');
        titleElement.className = 'pdf-title';
        titleElement.textContent = 'Orders'; // Set the title text
    
        // Prepend the title to the cloned orders
        clonedOrders.insertBefore(titleElement, clonedOrders.firstChild);
    
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
            <h2 className="font-bold text-black mb-4 text-center text-4xl">Orders</h2> {/* Decrease title font size */}
            
            {/* Use ref on this div to capture it for PDF */}
            <div ref={ordersRef}>
                <table className="w-full border-collapse mb-3">
                    <thead>
                        <tr className="bg-[#BACD92] text-black text-xl"> {/* Decrease header font size */}
                            <th className="text-left">Order ID</th>
                            <th className="text-left">Receiver Name</th>
                            <th className="text-left">Receiver Address</th>
                            <th className="text-left">Receiver Contact No</th>
                            <th className="text-left">Sender Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, index) => (
                            <tr key={index} className={index % 2 === 0 ? "bg-[#75A47F]" : "bg-[#BACD92]"}>
                                <td className="text-left text-lg py-3 px-4">{order.orderID}</td> {/* Add left and right padding */}
                                <td className="text-left text-lg py-3 px-4">{order.receiverName}</td>
                                <td className="text-left text-lg py-3 px-4">{order.receiverAddress}</td>
                                <td className="text-left text-lg py-3 px-4">{order.receiverContact}</td>
                                <td className="text-left text-lg py-3 px-4">{order.userEmail}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
