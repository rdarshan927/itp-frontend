import React, { useRef, useState } from "react";
import { api } from "../../../config/api";

const FlowerForm = ({ getItems }) => {
  const [flowerFormData, setFlowerFormData] = useState({
    productID: "",
    name: "",
    quantity: "",
    price: "",
    image: "",
  });
  const [flowerErrors, setFlowerErrors] = useState({});
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        // Update the form state with the Base64 encoded string
        setFlowerFormData({
          ...flowerFormData,
          image: reader.result,
        });
      };
      reader.readAsDataURL(file);
    } else {
      setFlowerFormData({
        ...flowerFormData,
        [name]: value,
      });
    }
  };

  const validateForm = (formData) => {
    let errors = {};
    if (!formData.productID) errors.productID = "Item Code is required";
    if (!formData.name) errors.name = "Name is required";
    if (!formData.quantity || isNaN(formData.quantity)) {
      errors.quantity = "Quantity must be a number";
    }
    if (!formData.price || isNaN(formData.price)) {
      errors.price = "Price must be a number";
    }
    return errors;
  };

  const handleFlowerAdd = async (e) => {
    e.preventDefault();
    const errors = validateForm(flowerFormData);
    console.log(flowerFormData);
    if (Object.keys(errors).length === 0) {
      try {
        const response = await api.post("/api/inventory/addsalesitem", {
          productID: flowerFormData.productID,
          name: flowerFormData.name,
          category: "flower",
          quantity: parseInt(flowerFormData.quantity),
          price: parseFloat(flowerFormData.price),
          imageData: flowerFormData.image,
        });
        console.log(response);
        getItems();
        setFlowerFormData({
          productID: "",
          name: "",
          quantity: "",
          price: "",
          image: "",
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Reset the file input
        }
        setFlowerErrors({});
      } catch (error) {
        console.error("Error adding flower item:", error);
      }
    } else {
      setFlowerErrors(errors);
    }
  };

  return (
    <form onSubmit={handleFlowerAdd} className="grid grid-cols-3 gap-4 mb-6">
      <div>
        <label className="block mb-1">Item Code</label>
        <input
          type="text"
          name="productID"
          value={flowerFormData.productID}
          onChange={handleInputChange}
          className="w-full px-3 py-2 rounded-lg bg-lightG text-black"
        />
        {flowerErrors.name && (
          <p className="text-red-500 text-sm">{flowerErrors.productID}</p>
        )}
      </div>
      <div>
        <label className="block mb-1">Flower Name</label>
        <input
          type="text"
          name="name"
          value={flowerFormData.name}
          onChange={handleInputChange}
          className="w-full px-3 py-2 rounded-lg bg-lightG text-black"
        />
        {flowerErrors.name && (
          <p className="text-red-500 text-sm">{flowerErrors.name}</p>
        )}
      </div>
      <div>
        <label className="block mb-1">Quantity</label>
        <input
          type="number"
          name="quantity"
          value={flowerFormData.quantity}
          onChange={handleInputChange}
          className="w-full px-3 py-2 rounded-lg bg-lightG text-black"
        />
        {flowerErrors.quantity && (
          <p className="text-red-500 text-sm">{flowerErrors.quantity}</p>
        )}
      </div>
      <div>
        <label className="block mb-1">Price</label>
        <input
          type="text"
          name="price"
          value={flowerFormData.price}
          onChange={handleInputChange}
          className="w-full px-3 py-2 rounded-lg bg-lightG text-black"
        />
        {flowerErrors.price && (
          <p className="text-red-500 text-sm">{flowerErrors.price}</p>
        )}
      </div>
      <div>
        <label className="block mb-1">Add Image</label>
        <input
          type="file"
          name="image"
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

export default FlowerForm;
