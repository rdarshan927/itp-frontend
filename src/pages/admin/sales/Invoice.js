import React, { useEffect, useState } from "react";
import { api } from '../../../config/api';
import { MdEdit, MdDelete } from "react-icons/md";
import html2pdf from 'html2pdf.js';

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

    const downloadReport = () => {
    const element = document.getElementById('invoice-table');
    const basicElement = element.cloneNode(true);

    // Override all styles for plain black and white PDF
    const styles = basicElement.querySelectorAll('*');
    styles.forEach(style => {
        style.style.fontSize = '8px';
        style.style.fontFamily = 'Arial';
        style.style.color = 'black';
        style.style.backgroundColor = 'white';
    });

    // Remove background colors from table rows
    const rows = basicElement.querySelectorAll('tr');
    rows.forEach(row => {
        row.style.background = 'none';
    });

    // Remove background colors from table cells
    const cells = basicElement.querySelectorAll('td, th');
    cells.forEach(cell => {
        cell.style.background = 'none';
    });

    // Add a basic border to the table
    basicElement.style.border = '1px solid black';
    basicElement.style.borderCollapse = 'collapse';

    // Add a basic border to table cells
    cells.forEach(cell => {
        cell.style.border = '1px solid black';
    });

    const options = {
        margin: 1,
        filename: 'invoice_report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf()
        .set(options)
        .from(basicElement)
        .toPdf()
        .get('pdf')
        .then(function (pdf) {
            // No need to set font size here
        })
        .save();
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
                <table id="invoice-table" className="min-w-full bg-green-200 text-green-900">
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