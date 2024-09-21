import React, { useState } from "react";

const BouquetForm = ({ addBouquet }) => {
  const [bouquetFormData, setBouquetFormData] = useState({
    name: "",
    quantity: "",
    price: "",
    image: null,
  });
  const [bouquetErrors, setBouquetErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setBouquetFormData({
      ...bouquetFormData,
      [name]: files ? files[0] : value,
    });
  };

  const validateForm = (formData) => {
    let errors = {};
    if (!formData.name) errors.name = "Name is required";
    if (!formData.quantity || isNaN(formData.quantity)) {
      errors.quantity = "Quantity must be a number";
    }
    if (!formData.price || isNaN(formData.price)) {
      errors.price = "Price must be a number";
    }
    return errors;
  };

  const handleBouquetAdd = (e) => {
    e.preventDefault();
    const errors = validateForm(bouquetFormData);
    if (Object.keys(errors).length === 0) {
      addBouquet({
        ...bouquetFormData,
        quantity: parseInt(bouquetFormData.quantity),
        price: parseFloat(bouquetFormData.price),
      });
      setBouquetFormData({ name: "", quantity: "", price: "", image: null });
      setBouquetErrors({});
    } else {
      setBouquetErrors(errors);
    }
  };

  return (
    <form onSubmit={handleBouquetAdd} className="grid grid-cols-3 gap-4 mb-6">
      <div>
        <label className="block mb-1">Bouquet Name</label>
        <input
          type="text"
          name="name"
          value={bouquetFormData.name}
          onChange={handleInputChange}
          className="w-full px-3 py-2 rounded-lg bg-lightG text-black"
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
          className="w-full px-3 py-2 rounded-lg bg-lightG text-black"
        />
        {bouquetErrors.quantity && (
          <p className="text-red-500 text-sm">{bouquetErrors.quantity}</p>
        )}
      </div>
      <div></div>
      <div>
        <label className="block mb-1">Price</label>
        <input
          type="text"
          name="price"
          value={bouquetFormData.price}
          onChange={handleInputChange}
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
