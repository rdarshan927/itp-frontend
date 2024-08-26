import React from "react";

const EditResourceItemModal = ({ editData, setEditData, handleModalSave, setIsModalOpen }) => {
  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value,
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Edit Item</h2>
        <div className="mb-4">
          <label className="block mb-1">Item Name</label>
          <input
            type="text"
            name="name"
            value={editData.name}
            onChange={handleModalChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-300"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Item Category</label>
          <input
            type="text"
            name="category"
            value={editData.category}
            onChange={handleModalChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-300"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={editData.quantity}
            onChange={handleModalChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-300"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => setIsModalOpen(false)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleModalSave}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditResourceItemModal;
