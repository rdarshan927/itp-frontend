import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf"; // Import jsPDF
import { api } from "../../../config/api";

const ViewDelivery = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [editDelivery, setEditDelivery] = useState(null);
    const [deliveryStatus, setDeliveryStatus] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');

    useEffect(() => {
        fetchDeliveries();
    }, []);

    const fetchDeliveries = async () => {
        try {
            const response = await api.get('/api/deliveries/get');
            setDeliveries(response.data);

            console.log(response.data);
        } catch (error) {
            console.error('Error fetching deliveries:', error);
        }
    };

    const handleEditClick = (delivery) => {
        setEditDelivery(delivery);
        setDeliveryStatus(delivery.currentStatus);
        setDeliveryDate(delivery.deliveryDate);
    };

    const handleDeleteClick = async (id) => {
        // Show confirmation alert before deleting
        const confirmDelete = window.confirm("Are you sure you want to delete this delivery?");
        
        if (confirmDelete) {
            try {
                await api.delete(`/api/deliveries/${id}`);
                fetchDeliveries(); // Refresh the list after deletion
            } catch (error) {
                console.error('Error deleting delivery:', error);
            }
        } else {
            console.log("Deletion canceled.");
        }
    };
    
    const handleUpdate = async () => {
        try {
            const updatedData = {
                currentStatus: deliveryStatus,
                deliveryDate,
            };
            await api.put(`/api/deliveries/${editDelivery._id}`, updatedData);
            setEditDelivery(null);
            fetchDeliveries();
        } catch (error) {
            console.error('Error updating delivery:', error);
        }
    };

    // New function to download the receipt as a PDF
    const handleDownloadReceipt = (delivery) => {
        const doc = new jsPDF();
        
        // Get the PDF's page width
    const pageWidth = doc.internal.pageSize.getWidth();

    // Set font size for the title
    doc.setFontSize(18);

    // Calculate the center position for the text
    const text = 'Order Receipt';
    const textWidth = doc.getTextWidth(text);
    const textX = (pageWidth - textWidth) / 2;

    // Add the centered text
    doc.text(text, textX, 20); // Adjust Y-position as needed   

    
    // Purchased By Section
    doc.setFontSize(12);
    doc.text('Purchased By', 14, 35);
    doc.setFontSize(10);
    doc.text(`Buyer Name: ${delivery.receivername || 'N/A'}`, 14, 40);
    doc.text(`Buyer E-Mail: ${delivery.senderEmail || 'N/A'}`, 14, 45);
    doc.text(`Order ID: ${delivery.orderId || 'N/A'}`, 14, 50);
    doc.text(`Order Time: ${new Date(delivery.deliveryDate).toLocaleString()}`, 14, 55);
    doc.text('Order Type: Web-Online', 14, 60);  // Customize this text if needed
    
    // Purchased From Section
    doc.setFontSize(12);
    doc.text('Purchased From', 120, 35);
    doc.setFontSize(10);
    doc.text('Organization Name: Shepora Flowers', 120, 40);
    doc.text('Organization Address: 123, Nuwara Eliye', 120, 45);
    
    // Horizontal Line
    doc.setLineWidth(0.5);
    doc.line(14, 65, 200 - 14, 65);
    
    // Receiver Information
    doc.setFontSize(12);
    doc.text('Receiver Information', 14, 75);
    doc.setFontSize(10);
    doc.text(`Receiver Name: ${delivery.receivername || 'N/A'}`, 14, 80);
    doc.text(`Receiver Address: ${delivery.receiveraddress || 'N/A'}`, 14, 85);
    doc.text(`Receiver Contact: ${delivery.receivercontact || 'N/A'}`, 14, 90);

    // Deliverer Information
    doc.text(`Deliverer Name: ${delivery.delivererName || 'N/A'}`, 14, 100);
    
    
    // Billing Section
    doc.text('Billed To:', 14, 150);
    doc.text(`${delivery.receivername || 'N/A'}`, 14, 155);
    doc.text(`Payment Method: VISA}`, 14, 160);
    
    

    // Set font size and color for the footer
    doc.setFontSize(10);
    doc.setTextColor(150);

    // Calculate the center position for the footer text
    const footerText = 'Thank you for your business!';
    const footerTextWidth = doc.getTextWidth(footerText);
    const footerTextX = (pageWidth - footerTextWidth) / 2;

    // Add the centered footer text
    doc.text(footerText, footerTextX, 180); // Adjust Y-position as needed

            // Save the PDF with a unique name
            doc.save(`receipt_${delivery.orderId}.pdf`);
        };
        

    const handleSendEmail = async (id, senderEmail) => {
        try {
            await api.post(`/api/deliveries/${id}/send-email`);
            alert('Email sent successfully!');
        } catch (error) {
            console.error('Error sending email:', error);
            alert('Error sending email.');
        }
    };

    return (
        <div className="bg-[#BACD92] mt-10 p-6 dark:bg-cTwo dark:text-white">
            <h2 className="font-bold mb-4 text-center text-5xl">Delivered Orders</h2>
            <div className='flex items-center w-11/12 mb-3'>
                <div className='w-1/5 text-left text-xl font-bold'>Order ID</div>
                <div className='w-1/5 text-left text-xl font-bold'>Delivery Status</div>
                <div className='w-1/5 text-left text-xl font-bold'>Sender Email</div>
                <div className='w-1/5 text-left text-xl font-bold'>Order Details</div>
                <div className='w-1/5 text-left text-xl font-bold'>Send Email</div>
            </div>
            <ul>
                {deliveries.map((delivery) => (
                    <li key={delivery._id} className="flex items-center justify-between mb-4 p-4 bg-[#75A47F] border border-[#BACD92] rounded-md dark:bg-bOne">
                        <div className="flex-1 flex items-center">
                            <div className="w-1/5 text-left px-2 text-sm">{delivery.orderId}</div>
                            <div className="w-1/5 text-left px-2 text-sm">{delivery.currentStatus || 'N/A'}</div>
                            <div className="w-1/5 text-left px-2 text-sm">{delivery.senderEmail || 'N/A'}</div>
                            <div className="w-1/5 text-left px-2 text-sm">
                                <button 
                                    className="bg-[#BACD92] text-sm px-4 py-2 rounded-full hover:bg-green-700 dark:bg-cOne"
                                    onClick={() => handleDownloadReceipt(delivery)} // Call new function
                                >
                                    <i className="fas fa-download"></i> Download
                                </button>
                            </div>
                            <div className="w-1/5 text-left px-2 text-2xl">
                                <button 
                                    className="bg-[#BACD92]  text-sm px-4 py-2 rounded-full hover:bg-green-700 dark:bg-cOne"
                                    onClick={() => handleSendEmail(delivery._id, delivery.senderEmail)}
                                >
                                    <i className="fas fa-paper-plane"></i> Send Email
                                </button>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <button 
                                className="bg-yellow-400  text-sm px-3 py-1 rounded hover:bg-yellow-500 dark:bg-cOne"
                                onClick={() => handleEditClick(delivery)}
                            >
                                Edit
                            </button>
                            <button 
                                className="bg-red-400  text-sm px-3 py-1 rounded hover:bg-red-500 dark:bg-cOne"
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
                    <div className="bg-white p-6 rounded-md dark:bg-cTwo">
                        <h3 className="text-2xl mb-4">Edit Delivery</h3>
                        <div>
                            <label className="block mb-2">Order ID:</label>
                            <input 
                                type="text" 
                                value={editDelivery.orderId} 
                                disabled 
                                className="border p-2 mb-4 w-full bg-gray-100 dark:text-black"
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Delivery Status:</label>
                            <select 
                                value={deliveryStatus} 
                                onChange={(e) => setDeliveryStatus(e.target.value)} 
                                className="border p-2 mb-4 w-full dark:text-black"
                            >
                                <option value="was delivered">was delivered</option>
                                <option value="is on the way">is on the way</option>
                               
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2">Delivery Date:</label>
                            <input 
                                type="date" 
                                value={deliveryDate} 
                                onChange={(e) => setDeliveryDate(e.target.value)} 
                                className="border p-2 mb-4 w-full dark:text-black"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button 
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 dark:bg-bOne"
                                onClick={handleUpdate}
                            >
                                Save Changes
                            </button>
                            <button 
                                className="bg-gray-400 text-white px-4 py-2 rounded ml-2 hover:bg-gray-500 dark:bg-bOne"
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
};

export default ViewDelivery;
