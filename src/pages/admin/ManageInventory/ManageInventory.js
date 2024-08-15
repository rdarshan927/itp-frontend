import React, { useState } from "react";

const ManageInventory = () => {
  const [inventory, setInventory] = useState([
    { productID: 1, name: "Product 1", quantity: 10 },
    { productID: 2, name: "Product 2", quantity: 5 },
    // Add more products as needed
  ]);

  const handleEdit = (index) => {
    // Handle edit functionality here
    console.log("Edit item at index:", index);
  };

  const handleDelete = (index) => {
    // Handle delete functionality here
    setInventory(inventory.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6">
      <div className="text-2xl font-semibold mb-6">Inventory Management</div>

      <div className="display-flex justify-content-space-between">
        <div className="text-lg font-semibold mb-3">
          Current Stock - Sales Inventory
        </div>
        <button>Add New</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-zinc-800 border border-gray-300 rounded">
          <thead>
            <tr className="bg-[#75A47F] text-left">
              <th className="px-4 py-2 border-b">#</th>
              <th className="px-4 py-2 border-b">Product ID</th>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Quantity</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item, index) => (
              <tr
                key={index}
                className="hover:bg-[#c9d5b0] dark:hover:bg-[#a3c5aa]"
              >
                <td className="px-4 py-2 border-b">{index + 1}</td>
                <td className="px-4 py-2 border-b">{item.productID}</td>
                <td className="px-4 py-2 border-b">{item.name}</td>
                <td className="px-4 py-2 border-b">{item.quantity}</td>
                <td className="px-4 py-2 border-b">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded-md mr-2 hover:bg-blue-600"
                    onClick={() => handleEdit(index)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                    onClick={() => handleDelete(index)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageInventory;
