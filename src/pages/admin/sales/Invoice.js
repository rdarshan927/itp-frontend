import React, { useEffect, useState } from "react";
import { api } from '../../../config/api';
import { MdEdit, MdDelete } from "react-icons/md";
import jsPDF from 'jspdf';

const Invoice = () => {
    const [invoices, setInvoices] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(null);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await api.get('/api/sales/invoice/get');
                if (Array.isArray(response.data.Invoices)) {
                    setInvoices(response.data.Invoices);
                } else {
                    console.error("Expected an array but got:", response.data.Invoices);
                }
            } catch (error) {
                console.error("Error fetching invoices:", error);
            }
        };

        fetchInvoices();
    }, []);

    const handleDelete = async (invoiceID) => {
        const id = invoiceID._id;
        console.log(id);
        try {
            const response = await api.delete(`/api/sales/invoice/delete/${id}`);
            setInvoices(prevInvoices => prevInvoices.filter(invoice => invoice._id !== id));
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };

    const filteredInvoices = invoices.filter(inv => 
        inv.invoiceID.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.orderID.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (inv.userInfo && inv.userInfo.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const toggleDropdown = (invoiceId) => {
        if (isDropdownOpen === invoiceId) {
            setIsDropdownOpen(null);
        } else {
            setIsDropdownOpen(invoiceId);
        }
    };

    const updateValidity = async (invoiceID, validity) => {
        try {
            console.log(invoiceID, validity);
            const response = await api.patch(`/api/sales/invoice/update/${invoiceID}`, { validity });

            if (response.status === 200) {
                console.log(`Validity updated to ${validity}`);
                setInvoices(prevInvoices =>
                    prevInvoices.map(inv =>
                        inv._id === invoiceID ? { ...inv, validity } : inv
                    )
                );
            } else {
                console.error('Error updating validity:', response.data);
            }
        } catch (error) {
            console.error('Error while updating validity:', error);
        }
        setIsDropdownOpen(null);
    };

    const downloadReport = (invoice) => {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'letter',
    });

    // Set font and styles
    doc.setFont('helvetica', 'normal');
    
    // Add Company Logo (Optional, assuming you have a base64 logo or any method to add an image)
    // doc.addImage('base64LogoHere', 'PNG', 40, 40, 50, 50); // X, Y, Width, Height

    // Invoice Title
    doc.setFontSize(30);
    doc.text('Shephora Flowers', doc.internal.pageSize.getWidth() - 120, 80, { align: 'right' });

    // Billed To Section
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('BILLED TO:', 40, 120);

    doc.setFont('helvetica', 'normal');
    doc.text(invoice.userInfo || 'Unknown', 40, 140); // Dynamically using userInfo from the invoice
    // doc.text(invoice.contact || 'Unknown Contact', 40, 160); // Assuming you have a contact field
    // doc.text(invoice.address || 'Unknown Address', 40, 180); // Assuming you have an address field

    // Invoice Info (Number and Date)
    doc.setFont('helvetica', 'bold');
    doc.text(`Invoice No. ${invoice.invoiceID}`, doc.internal.pageSize.getWidth() - 160, 120);
    doc.text(new Date(invoice.paidOn).toLocaleDateString(), doc.internal.pageSize.getWidth() - 160, 140);

    // Item Section Header
    doc.setLineWidth(0.5);
    doc.line(40, 210, doc.internal.pageSize.getWidth() - 40, 210); // Top line
    doc.text('Item', 40, 230);
    doc.text('Quantity', 220, 230);
    doc.text('Unit Price', 320, 230);
    doc.text('Total', doc.internal.pageSize.getWidth() - 100, 230, { align: 'right' });
    doc.line(40, 240, doc.internal.pageSize.getWidth() - 40, 240); // Bottom line

    // Dynamically rendering items from invoice
    let yOffset = 260; // Starting Y position for items
    invoice.items.forEach((item) => {
        doc.text(item.productID, 40, yOffset);
        doc.text(item.quantity.toString(), 220, yOffset);
        doc.text(`Rs. ${item.price}`, 320, yOffset);
        doc.text(`Rs. ${item.quantity * item.price}`, doc.internal.pageSize.getWidth() - 100, yOffset, { align: 'right' });
        yOffset += 20;
    });

    // Subtotal, Tax, and Total (Using dynamic values from the invoice)
    doc.setFont('helvetica', 'bold');
    yOffset += 20;
    doc.line(40, yOffset, doc.internal.pageSize.getWidth() - 40, yOffset); // Line before totals
    yOffset += 20;

    const totalAmount = invoice.items.reduce((acc, item) => acc + item.quantity * item.price, 0);

    doc.text('Subtotal', 320, yOffset);
    doc.text(`Rs. ${totalAmount}`, doc.internal.pageSize.getWidth() - 100, yOffset, { align: 'right' });
    
    yOffset += 20;
    doc.text('Tax (0%)', 320, yOffset); // If you have tax, update it dynamically
    doc.text('Rs. 0', doc.internal.pageSize.getWidth() - 100, yOffset, { align: 'right' });

    yOffset += 30;
    doc.setFontSize(16);
    doc.text('Total', 320, yOffset);
    doc.text(`Rs. ${totalAmount}`, doc.internal.pageSize.getWidth() - 100, yOffset, { align: 'right' });

    // Thank You Message
    yOffset += 100;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text('Thank you!', 40, yOffset);

    // Payment Information (Add any dynamic payment details if available)
    yOffset += 30;
    doc.setFont('helvetica', 'bold');
    doc.text('PAYMENT INFORMATION', 40, yOffset);
    doc.setFont('helvetica', 'normal');
    yOffset += 20;
    // doc.text(invoice.paymentInfo || 'No Payment Info', 40, yOffset); // Assuming you have paymentInfo

    // Example: base64 signature image (replace with your own base64 image string)
    const signatureBase64 = '';  // Truncated base64 string of the image

    // Add the signature image
    doc.addImage('https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Signature_of_Maithripala_Sirisena.svg/640px-Signature_of_Maithripala_Sirisena.svg.png', 'PNG', doc.internal.pageSize.getWidth() - 160, yOffset, 100, 50);  // X, Y, Width, Height



    // Footer: Signature/Address
    doc.text('Authorized Signature', doc.internal.pageSize.getWidth() - 160, yOffset + 100);
    doc.text(invoice.signatureAddress || 'Sales Manager', doc.internal.pageSize.getWidth() - 160, yOffset + 120);

    // Save the generated PDF
    doc.save(`invoice_${invoice.invoiceID}.pdf`);
};



    return (
        <div className="p-4">
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by Invoice, Order, or Sender Info"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border border-gray-300 p-2 rounded w-1/4"
                />
                <button onClick={downloadReport} className="ml-2 p-2 bg-lightG text-white rounded">Download Report</button>
            </div>
            {filteredInvoices.length > 0 ? (
                <table id="invoice-table" className="w-full bg-green-200 text-green-900">
                    <thead>
                        <tr className="text-left bg-darkG">
                            <th className="py-2 px-4">Invoice ID</th>
                            <th className="py-2 px-4">Order ID</th>
                            <th className="py-2 px-4">Sender Info</th>
                            <th className="py-2 px-4">Description</th>
                            <th className="py-2 px-4">Amount Paid</th>
                            <th className="py-2 px-4">Paid On</th>
                            <th className="py-2 px-4">Validity</th>
                            <th className="py-2 px-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
    {filteredInvoices.map((inv, index) => (
        <tr key={index} className="odd:bg-green-100 even:bg-green-200">
            <td className="py-2 px-4">{inv.invoiceID}</td>
            <td className="py-2 px-4">{inv.orderID}</td>
            <td className="py-2 px-4" style={{ width: '200px' }}>{inv.userInfo || 'N/A'}</td>
            <td className="py-2 px-4">
                <ul>
                    {inv.items.map((item, i) => (
                        <li key={i}>
                            {item.productID} - Qty: {item.quantity}, Rs. {item.price}
                        </li>
                    ))}
                </ul>
            </td>
            <td className="py-2 px-4">Rs. {inv.amountPaid}</td>
            <td className="py-2 px-4">{new Date(inv.paidOn).toLocaleString()}</td>
            <td className="py-2 px-4">{inv.validity}</td>
            <td className="py-2 px-4 flex items-center space-x-2 relative">
                <button 
                    className="p-2 rounded bg-green-400 text-white hover:bg-green-500"
                    onClick={() => toggleDropdown(inv._id)}
                >
                    <MdEdit size={20} />
                </button>

                {isDropdownOpen === inv._id && (
                    <div className="absolute z-10 mt-32 w-32 bg-white border border-gray-300 rounded-md shadow-lg">
                        <ul className="py-1">
                            <li 
                                onClick={() => updateValidity(inv._id, 'Valid')}
                                className="cursor-pointer px-4 py-2 hover:bg-gray-200"
                            >
                                Valid
                            </li>
                            <li 
                                onClick={() => updateValidity(inv._id, 'Invalid')}
                                className="cursor-pointer px-4 py-2 hover:bg-gray-200"
                            >
                                Invalid
                            </li>
                        </ul>
                    </div>
                )}

                <button className="p-2 rounded bg-green-400 text-white hover:bg-green-500" onClick={() => handleDelete(inv)}>
                    <MdDelete size={20} />
                </button>

                {/* Add download button inside the .map() loop */}
                <button 
                    onClick={() => downloadReport(inv)} 
                    className="p-2 bg-lightG text-white rounded"
                >
                    Download Report
                </button>
            </td>
        </tr>
    ))}
</tbody>

                </table>
            ) : (
                <p>No invoices available</p>
            )}
        </div>
    );
};

export default Invoice;
