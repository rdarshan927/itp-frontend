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
                font-size: 12px; /* Adjusted font size */
            }
            #orders-pdf table {
                width: 100%;
                border-collapse: collapse;
                margin: 10px 0; /* Add margin for spacing between rows */
            }
            #orders-pdf th, #orders-pdf td {
                border: 1px solid black; /* Add a border around table cells */
                padding: 8px 10px; /* Adjust padding */
                text-align: left; /* Align text to left for better readability */
                background-color: white; /* Ensure background is white */
                color: black; /* Set text color to black */
            }
            #orders-pdf th {
                background-color: #BACD92; /* Header background color */
                color: black; /* Keep text color */
            }
            #orders-pdf tr:nth-child(even) {
                background-color: #F7F7F7; /* Light gray for even rows */
            }
            #orders-pdf .pdf-title {
                font-size: 32px; /* Title font size */
                text-align: center;
                margin: 20px 0; /* Space between title and table */
                font-weight: bold; /* Make the title bold */
                color: black; /* Set text color to black */
            }
            #orders-pdf .pdf-logo {
                text-align: center;
                margin-bottom: 10px; /* Space between logo and title */
                font-size: 18px; /* Adjust font size for the logo text */
                font-weight: bold; /* Make the logo text bold */
                color: black; /* Set logo text color */
            }
            #orders-pdf .pdf-footer {
                font-size: 8px; /* Adjusted font size for footer */
                color: gray; /* Text color for footer */
                position: absolute; /* Position at the bottom */
                bottom: 10px; /* Space from the bottom */
                right: 10px; /* Space from the right */
                text-align: right; /* Align text to the right */
            }
        `;
    
        // Temporarily apply styles for PDF generation
        const styleElement = document.createElement('style');
        styleElement.innerHTML = pdfStyle;
        document.head.appendChild(styleElement);
    
        // Clone the ordersRef content to avoid affecting the actual page
        const clonedOrders = ordersRef.current.cloneNode(true);
        clonedOrders.id = 'orders-pdf'; // Change the ID to apply PDF-specific styles
    
        // Create and prepend the logo element
        const logoElement = document.createElement('div');
        logoElement.className = 'pdf-logo';
        logoElement.textContent = 'Orders Report'; // Replace with your logo text
        clonedOrders.insertBefore(logoElement, clonedOrders.firstChild);
    
        // Create and prepend the title element
        const titleElement = document.createElement('div');
        titleElement.className = 'pdf-title';
        titleElement.textContent = 'Sephora Flowers'; // Set the title text
        clonedOrders.insertBefore(titleElement, clonedOrders.firstChild);
    
        // Create a temporary div for generating the PDF
        const pdfDiv = document.createElement('div');
        pdfDiv.appendChild(clonedOrders);
    
        const opt = {
            margin: 0.5,
            filename: 'orders.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: {
                unit: 'in',
                format: 'letter',
                orientation: 'portrait',
                putOnlyUsedFonts: true,
                autoPaging: true
            },
            pagebreak: { mode: 'avoid-all', before: '.pdf-footer' } // Avoid page break before footer
        };
    
        // Generate the PDF from the cloned, styled section
        html2pdf().from(pdfDiv).set(opt).toPdf().get('pdf').then((pdf) => {
            const totalPages = pdf.internal.getNumberOfPages();
    
            // Add the footer with page numbers and date to each page
            for (let i = 1; i <= totalPages; i++) {
                pdf.setPage(i);
                pdf.text(`Generated on: ${new Date().toLocaleDateString()} | Page ${i} of ${totalPages}`, 
                         pdf.internal.pageSize.getWidth() - 1, // Right-aligned
                         pdf.internal.pageSize.getHeight() - 0.5, { 
                             align: 'right' 
                         });
            }
    
            pdf.save('orders.pdf'); // Save the PDF file
        }).finally(() => {
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
