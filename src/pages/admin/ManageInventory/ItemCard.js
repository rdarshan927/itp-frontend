import React, { useState } from "react";
import { api } from "../../../config/api";

const ItemCard = ({ item, getItems, saveRecord }) => {
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    imageData: item.imageData,
  });

  // Handle input changes with validation
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    // Handle image input
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        // Update the form state with the Base64 encoded string
        setEditData((prev) => ({ ...prev, imageData: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      // Validate and update form data for other inputs
      if (name === "quantity") {
        // Allow only positive integers greater than 0, up to 4 digits
        const quantityPattern = /^[1-9][0-9]*$/;
        if (
          value === "" ||
          (quantityPattern.test(value) && value.length <= 4)
        ) {
          setEditData((prev) => ({ ...prev, [name]: value }));
        }
      } else if (name === "price") {
        // Ensure price is a valid number and not longer than 20 characters
        const pricePattern = /^[0-9]+(\.[0-9]{1,2})?$/; // Allow up to 2 decimal places
        if (value === "" || (pricePattern.test(value) && value.length <= 20)) {
          setEditData((prev) => ({ ...prev, [name]: value }));
        }
      } else {
        // Limit name to 20 characters
        if (value.length <= 20) {
          setEditData((prev) => ({ ...prev, [name]: value }));
        }
      }
    }
  };

  // Prevent unwanted characters in the quantity and price fields
  const handleKeyDown = (e) => {
    if (["e", "E", "+", "-", "/", "."].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmDelete) {
      try {
        await api.delete(`/api/inventory/deletesalesitem/${item.productID}`);
        saveRecord(item, "Delete", item.category);
        getItems();
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await api.patch(
        `/api/inventory/updatesalesitem/${item.productID}`,
        {
          name: editData.name,
          quantity: parseInt(editData.quantity),
          price: parseFloat(editData.price),
          imageData: editData.imageData,
        }
      );
      saveRecord(
        {
          productID: item.productID,
          name: editData.name,
          quantity: parseInt(editData.quantity),
          price: parseFloat(editData.price),
        },
        "Update",
        item.category
      );
      console.log("Updated Item:", response.data);
      setEditMode(false);
      getItems(); // Refresh items to show updated data
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const editFields = (
    <>
      Name:
      <input
        type="text"
        name="name"
        value={editData.name}
        onChange={handleInputChange}
        className="w-full p-2 mb-2 rounded-lg"
      />
      Quantity:
      <input
        type="number"
        name="quantity"
        value={editData.quantity}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown} // Prevent unwanted characters
        className="w-full p-2 mb-2 rounded-lg"
      />
      Price:
      <input
        type="text"
        name="price"
        value={editData.price}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown} // Prevent unwanted characters
        className="w-full p-2 mb-2 rounded-lg"
      />
      Image:
      <input
        type="file"
        name="image"
        onChange={handleInputChange}
        className="w-full p-2 mb-2 rounded-lg"
      />
      <button
        onClick={handleUpdate}
        className="bg-lightG px-3 py-2 rounded-lg text-white"
      >
        Save
      </button>
      <button
        onClick={() => setEditMode(false)}
        className="bg-red-300 px-3 py-2 ml-2 rounded-lg text-white"
      >
        Cancel
      </button>
    </>
  );

  const itemView = (
    <>
      <img
        src={item.imageData || ""}
        alt={item.name}
        className="w-full h-60 object-cover rounded-lg mb-4"
      />
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
        <p>{`Item Code: ${item.productID}`}</p>
        <p>{`Rs: ${item.price}`}</p>
        <p>{`Available: ${item.quantity}`}</p>
        <div className="mt-4">
          <button
            className="bg-lightG px-6 py-2 mx-2 rounded-lg text-white"
            onClick={() => setEditMode(true)}
          >
            Edit
          </button>
          <button
            className="bg-red-300 px-3 py-2 mx-2 rounded-lg text-white"
            onClick={() => handleDelete(item.productID)}
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="bg-darkG rounded-lg shadow-md p-4 w-80">
      {editMode ? editFields : itemView}
    </div>
  );
};

export default ItemCard;
