import React, { useEffect, useState } from "react";
import { api } from "../../../config/api";

const ViewPacking = () => {
    const [orderId, setOrderId] = useState('');
    const [receiverContact, setReceiverContact] = useState('');
    const [receiverName, setReceiverName] = useState('');
    const [senderEmail, setSenderEmail] = useState('');
    const [receiverAddress, setReceiverAddress] = useState('');
    const [packingDate, setPackingDate] = useState('');
    const [currentStatus, setCurrentStatus] = useState('Packing'); // Default status
    const [packing, setPacking] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPacking();
    }, []);

    const fetchPacking = async () => {
        try {
            const response = await api.get('/api/packing/get');
            setPacking(response.data);
        } catch (error) {
            console.error('Error fetching packing:', error);
        }
    };

    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(senderEmail)) {
            setError("Please enter a valid email address.");
            return false;
        }
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(receiverContact)) {
            setError("Receiver contact number must be 10 digits.");
            return false;
        }
        if (!orderId) {
            setError("Order ID is required.");
            return false;
        }
        setError('');
        return true;
    };

    const handleUpdatePacking = async () => {
        if (!validateForm()) {
            return;
        }

        const updatedPacking = {
            orderId,
            receivername: receiverName,
            receivercontact: receiverContact,
            receiveraddress: receiverAddress,
            senderemail: senderEmail,
            packingdate: packingDate,
            currentstatus: currentStatus,
        };

        try {
            await api.put(`/api/packing/update/${editId}`, updatedPacking);
            fetchPacking(); // Refresh the packing list after updating
            clearForm(); // Clear the form fields after updating
            setIsEditing(false); // Close the modal
        } catch (error) {
            console.error('Error updating packing:', error);
        }
    };

    const handleEdit = (index) => {
        const selectedPacking = packing[index];
        setOrderId(selectedPacking.orderId);
        setReceiverContact(selectedPacking.receivercontact);
        setReceiverName(selectedPacking.receivername);
        setSenderEmail(selectedPacking.senderemail);
        setReceiverAddress(selectedPacking.receiveraddress);
        setPackingDate(selectedPacking.packingdate.split('T')[0]);
        setCurrentStatus(selectedPacking.currentstatus);
        setIsEditing(true);
        setEditId(selectedPacking._id);
    };

    const clearForm = () => {
        setOrderId('');
        setReceiverContact('');
        setReceiverName('');
        setSenderEmail('');
        setReceiverAddress('');
        setPackingDate('');
        setCurrentStatus('Packing'); // Reset to default
        setIsEditing(false);
        setEditId(null);
        setError(''); // Clear error on form reset
    };

    const handleQRCodeDownload = async (id) => {
        try {
            const response = await api.get(`/api/packing/qrcode/${id}`, {
                responseType: 'blob', // Important to specify the response type
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'packing-qrcode.pdf'); // Filename to download
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading QR Code PDF:', error);
        }
    };

    // New handleDelete function
    const handleDelete = async (index) => {
        const selectedPacking = packing[index];
        if (window.confirm("Are you sure you want to delete this packing entry?")) {
            try {
                await api.delete(`/api/packing/delete/${selectedPacking._id}`);
                fetchPacking(); // Refresh the packing list after deleting
            } catch (error) {
                console.error('Error deleting packing:', error);
            }
        }
    };

    return (
        <div className="bg-[#BACD92] mt-10 p-6 dark:bg-cTwo dark:text-white">
            <h2 className="font-bold  mb-4 text-center text-5xl">Packed Orders</h2>
            <div className="grid grid-cols-8 gap-4 mb-3 text-center font-bold ">
                <div>Order ID</div>
                <div>Receiver Name</div>
                <div>Receiver Contact</div>
                <div>Receiver Address</div>
                <div>Sender Email</div>
                <div>Packing Date</div>
                <div>Current Status</div>
                <div>Actions</div>
            </div>
            <ul>
                {packing.map((selectedPacking, index) => (
                    <li key={index} className="grid grid-cols-8 gap-4 mb-4 p-4 bg-[#75A47F] border border-[#BACD92] rounded-md dark:bg-bOne">
                        <div className="text-left">{selectedPacking.orderId}</div>
                        <div className="text-left">{selectedPacking.receivername}</div>
                        <div className="text-left">{selectedPacking.receivercontact}</div>
                        <div className="text-left">{selectedPacking.receiveraddress}</div>
                        <div className="text-left">{selectedPacking.senderemail}</div>
                        <div className="text-left">{selectedPacking.packingdate.split('T')[0]}</div>
                        <div className="text-left">{selectedPacking.currentstatus}</div>
                        <div className="text-left flex flex-col space-y-2">
                            <button
                                className="bg-[#BACD92] text-sm px-4 py-2 rounded-full hover:bg-green-700 dark:bg-cOne"
                                onClick={() => handleQRCodeDownload(selectedPacking._id)}
                            >
                                QR
                            </button>
                            <button
                                className="bg-yellow-400 text-sm px-2 py-1 rounded hover:bg-yellow-500 dark:bg-cOne"
                                onClick={() => handleEdit(index)}
                            >
                                Edit
                            </button>
                            <button
                                className="bg-red-400 text-sm px-2 py-1 rounded hover:bg-red-500 dark:bg-cOne"
                                onClick={() => handleDelete(index)} // Now correctly references handleDelete
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            {isEditing && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-darkG p-6 rounded-lg w-1/2 dark:bg-cTwo">
                        <h2 className="text-3xl font-bold mb-4">Edit Packing Details</h2>
                        <form>
                            <div className="mb-4">
                                <label className="block text-xl font-bold mb-2">Order ID</label>
                                <input
                                    type="text"
                                    className="w-full p-2 rounded-md bg-lightG dark:bg-bOne"
                                    value={orderId}
                                    disabled
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-xl font-bold mb-2">Receiver Name</label>
                                <input
                                    type="text"
                                    className="w-full p-2 rounded-md bg-lightG dark:bg-bOne"
                                    value={receiverName}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        // Allow only letters and restrict numbers/special characters
                                        if (/^[a-zA-Z\s]*$/.test(value)) {
                                            setReceiverName(value);
                                        }
                                    }}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-xl font-bold mb-2">Receiver Contact</label>
                                <input
                                    type="text"
                                    className="w-full p-2 rounded-md bg-lightG dark:bg-bOne"
                                    value={receiverContact}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        // Allow only digits and restrict length to 10
                                        if (/^\d*$/.test(value) && value.length <= 10) {
                                            setReceiverContact(value);
                                        }
                                    }}
                                    maxLength={10} // Ensures no more than 10 characters can be entered
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-xl font-bold mb-2">Receiver Address</label>
                                <input
                                    type="text"
                                    className="w-full p-2 rounded-md bg-lightG dark:bg-bOne"
                                    value={receiverAddress}
                                    onChange={(e) => setReceiverAddress(e.target.value)}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-xl font-bold mb-2">Sender Email</label>
                                <input
                                    type="email"
                                    className="w-full p-2 rounded-md bg-lightG dark:bg-bOne"
                                    value={senderEmail}
                                    onChange={(e) => setSenderEmail(e.target.value)}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-xl font-bold mb-2">Packing Date</label>
                                <input
                                    type="date"
                                    className="w-full p-2 rounded-md bg-lightG dark:bg-bOne"
                                    value={packingDate}
                                    onChange={(e) => setPackingDate(e.target.value)}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-xl font-bold mb-2">Current Status</label>
                                <select
                                    className="w-full p-2 rounded-md bg-lightG dark:bg-bOne"
                                    value={currentStatus}
                                    onChange={(e) => setCurrentStatus(e.target.value)}
                                >
                                    <option value="Packing">Packing</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                            {error && <div className="text-red-600">{error}</div>}
                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 dark:bg-cOne"
                                    onClick={handleUpdatePacking}
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 dark:bg-cOne"
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
};

export default ViewPacking;
