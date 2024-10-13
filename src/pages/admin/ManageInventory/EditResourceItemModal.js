import React from "react";

const EditResourceItemModal = ({
  editData,
  setEditData,
  handleModalSave,
  setIsModalOpen,
}) => {
  // Handle change for input fields with validation
  const handleModalChange = (e) => {
    const { name, value } = e.target;

    // Validate quantity input for positive whole numbers only, up to 4 digits
    if (name === "quantity") {
      const quantityPattern = /^[1-9][0-9]*$/;
      if (value === "" || (quantityPattern.test(value) && value.length <= 4)) {
        setEditData({
          ...editData,
          [name]: value,
        });
      }
    } else {
      // Limit name and category inputs to 20 characters
      if (value.length <= 20) {
        setEditData({
          ...editData,
          [name]: value,
        });
      }
    }
  };

  // Prevent unwanted characters in the quantity input field
  const handleModalKeyDown = (e) => {
    if (["e", "E", "+", "-", ".", "/"].includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 dark:bg-bOne">
        <h2 className="text-2xl font-bold mb-4">Edit Item</h2>
        <div className="mb-4">
          <label className="block mb-1">Item Name</label>
          <input
            type="text"
            name="name"
            value={editData.name}
            onChange={handleModalChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Item Category</label>
          <input
            type="text"
            name="category"
            value={editData.category}
            onChange={handleModalChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={editData.quantity}
            onChange={handleModalChange}
            onKeyDown={handleModalKeyDown} // Prevent unwanted characters
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:text-black"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => setIsModalOpen(false)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg mr-2 dark:bg-cTwo"
          >
            Cancel
          </button>
          <button
            onClick={handleModalSave}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg dark:bg-cTwo"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditResourceItemModal;
