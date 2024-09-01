import React, { useEffect, useState } from "react";
import { api } from '../../../config/api';
import { MdEdit, MdDelete } from "react-icons/md";

const Invoice = () => {
    const [invoices, setInvoices] = useState([]);

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

    const handleDelete = async(invoiceID) => {
        const id = invoiceID._id;
        console.log(id)
        try {
            const response = await api.delete(`/api/sales/invoice/delete/${id}`);
            setInvoices(prevInvoices => prevInvoices.filter(invoice => invoice._id !== id));
            console.log(response);
        } catch(error) {
            console.log(error);
        }
    }

    return (
        <div className="p-4">
            {invoices.length > 0 ? (
                <table className="min-w-full bg-green-200 text-green-900">
                    <thead>
                        <tr className="text-left bg-green-300">
                            <th className="py-2 px-4">Invoice ID</th>
                            <th className="py-2 px-4">Order ID</th>
                            <th className="py-2 px-4">Sender Info</th>
                            {/* <th className="py-2 px-4">Sender Address</th> */}
                            <th className="py-2 px-4">Description</th>
                            <th className="py-2 px-4">Amount Paid</th>
                            <th className="py-2 px-4">Paid On</th>
                            <th className="py-2 px-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((inv, index) => (
                            <tr key={index} className="odd:bg-green-100 even:bg-green-200">
                                <td className="py-2 px-4">{inv.invoiceID}</td>
                                <td className="py-2 px-4">{inv.orderID}</td>
                                <td className="py-2 px-4" style={{ width: '200px' }}>{inv.userInfo}</td>
                                {/* <td className="py-2 px-4 text-justify text-wrap break-all whitespace-normal w-12" style={{ width: '500px' }}>ghggggj kukkkkkkkkkkkkkkkkkkkhhhhhhhhh hhhhhhhgggggggggggggggggggggggggggggggggggggggggggg</td> */}
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
                                <td className="py-2 px-4 flex items-center space-x-2">
                                    <button className="p-2 rounded bg-green-400 text-white hover:bg-green-500">
                                        <MdEdit size={20} />
                                    </button>
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
}

export default Invoice;
