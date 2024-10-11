import React, { useRef, useState } from "react";
import { api } from "../../../config/api";

const BouquetForm = ({ getItems, saveRecord }) => {
  const [bouquetFormData, setBouquetFormData] = useState({
    productID: "",
    name: "",
    quantity: "",
    price: "",
    image: null,
  });
  const [bouquetErrors, setBouquetErrors] = useState({});
  const fileInputRef = useRef(null);

  // Handle input changes with validation
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    // Handle image input
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        // Update the form state with the Base64 encoded string
        setBouquetFormData({
          ...bouquetFormData,
          image: reader.result,
        });
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
          setBouquetFormData({
            ...bouquetFormData,
            [name]: value,
          });
        }
      } else if (name === "price") {
        // Ensure price is a valid number and not longer than 20 characters
        const pricePattern = /^[0-9]+(\.[0-9]{1,2})?$/; // Allow up to 2 decimal places
        if (value === "" || (pricePattern.test(value) && value.length <= 20)) {
          setBouquetFormData({
            ...bouquetFormData,
            [name]: value,
          });
        }
      } else {
        // Limit productID, name to 20 characters
        if (value.length <= 20) {
          setBouquetFormData({
            ...bouquetFormData,
            [name]: value,
          });
        }
      }
    }
  };

  // Prevent unwanted characters in the quantity and price fields
  const handleKeyDown = (e) => {
    if (["e", "E", "+", "-", ".", "/"].includes(e.key)) {
      e.preventDefault();
    }
  };

  // Validate the form before submission
  const validateForm = async (formData) => {
    let errors = {};
    if (!formData.productID) errors.productID = "Item Code is required";
    if (!formData.name) errors.name = "Bouquet Name is required";
    if (!formData.quantity || isNaN(formData.quantity)) {
      errors.quantity = "Quantity must be a number";
    }
    if (!formData.price || isNaN(formData.price)) {
      errors.price = "Price must be a valid number";
    }
    return errors;
  };

  const handleBouquetAdd = async (e) => {
    e.preventDefault();
    const errors = await validateForm(bouquetFormData);
    console.log(bouquetFormData);
    if (Object.keys(errors).length === 0) {
      try {
        const response = await api.post("/api/inventory/addsalesitem", {
          productID: bouquetFormData.productID,
          name: bouquetFormData.name,
          category: "bouquet",
          quantity: parseInt(bouquetFormData.quantity),
          price: parseFloat(bouquetFormData.price),
          imageData: bouquetFormData.image,
        });
        console.log(response);
        saveRecord(bouquetFormData, "Add", "bouquet");
        getItems();
        setBouquetFormData({
          productID: "",
          name: "",
          quantity: "",
          price: "",
          image: "",
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Reset the file input
        }
        setBouquetErrors({});
      } catch (error) {
        console.error("Error adding bouquet item:", error);
      }
    } else {
      setBouquetErrors(errors);
    }
  };

  return (
    <form onSubmit={handleBouquetAdd} className="grid grid-cols-3 gap-4 mb-6">
      <div>
        <label className="block mb-1">Item Code</label>
        <input
          type="text"
          name="productID"
          value={bouquetFormData.productID}
          onChange={handleInputChange}
          className="w-full px-3 py-2 rounded-lg bg-lightG text-black"
          maxLength="20"
        />
        {bouquetErrors.productID && (
          <p className="text-red-500 text-sm">{bouquetErrors.productID}</p>
        )}
      </div>
      <div>
        <label className="block mb-1">Bouquet Name</label>
        <input
          type="text"
          name="name"
          value={bouquetFormData.name}
          onChange={handleInputChange}
          className="w-full px-3 py-2 rounded-lg bg-lightG text-black"
          maxLength="20"
        />
        {bouquetErrors.name && (
          <p className="text-red-500 text-sm">{bouquetErrors.name}</p>
        )}
      </div>
      <div>
        <label className="block mb-1">Quantity</label>
        <input
          type="number"
          name="quantity"
          value={bouquetFormData.quantity}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown} // Prevent unwanted characters
          className="w-full px-3 py-2 rounded-lg bg-lightG text-black"
        />
        {bouquetErrors.quantity && (
          <p className="text-red-500 text-sm">{bouquetErrors.quantity}</p>
        )}
      </div>
      <div>
        <label className="block mb-1">Price</label>
        <input
          type="number"
          name="price"
          value={bouquetFormData.price}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown} // Prevent unwanted characters
          className="w-full px-3 py-2 rounded-lg bg-lightG text-black"
        />
        {bouquetErrors.price && (
          <p className="text-red-500 text-sm">{bouquetErrors.price}</p>
        )}
      </div>
      <div>
        <label className="block mb-1">Add Image</label>
        <input
          type="file"
          name="image"
          ref={fileInputRef}
          onChange={handleInputChange}
          className="w-full px-3 py-2 rounded-lg bg-lightG text-black"
        />
      </div>
      <div className="flex justify-center items-end">
        <button
          type="submit"
          className="bg-lightG text-black px-4 py-2 rounded-3xl w-40 hover:bg-[#a3c5aa] transition"
        >
          ADD
        </button>
      </div>
    </form>
  );
};

export default BouquetForm;
