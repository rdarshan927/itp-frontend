import React, { useState } from "react";

const FlowerForm = ({ addFlower }) => {
  const [flowerFormData, setFlowerFormData] = useState({
    name: "",
    quantity: "",
    price: "",
    image: null,
  });
  const [flowerErrors, setFlowerErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFlowerFormData({
      ...flowerFormData,
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

  const handleFlowerAdd = (e) => {
    e.preventDefault();
    const errors = validateForm(flowerFormData);
    if (Object.keys(errors).length === 0) {
      addFlower({
        ...flowerFormData,
        quantity: parseInt(flowerFormData.quantity),
        price: parseFloat(flowerFormData.price),
      });
      setFlowerFormData({ name: "", quantity: "", price: "", image: null });
      setFlowerErrors({});
    } else {
      setFlowerErrors(errors);
    }
  };

  return (
    <form onSubmit={handleFlowerAdd} className="grid grid-cols-3 gap-4 mb-6">
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
      <div></div>
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
