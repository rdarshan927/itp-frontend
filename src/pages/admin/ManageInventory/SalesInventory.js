import React, { useState } from "react";

const SalesInventory = () => {
  // State for Flower Bouquets
  const [bouquets, setBouquets] = useState([]);
  const [bouquetFormData, setBouquetFormData] = useState({
    name: "",
    quantity: "",
    price: "",
    image: null,
  });
  const [bouquetErrors, setBouquetErrors] = useState({});

  // State for Flowers
  const [flowers, setFlowers] = useState([]);
  const [flowerFormData, setFlowerFormData] = useState({
    name: "",
    quantity: "",
    price: "",
    image: null,
  });
  const [flowerErrors, setFlowerErrors] = useState({});

  // Common handler for input changes
  const handleInputChange = (e, formType) => {
    const { name, value, files } = e.target;
    if (formType === "bouquet") {
      setBouquetFormData({
        ...bouquetFormData,
        [name]: files ? files[0] : value,
      });
    } else if (formType === "flower") {
      setFlowerFormData({
        ...flowerFormData,
        [name]: files ? files[0] : value,
      });
    }
  };

  // Validation function
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

  // Handle add for Flower Bouquets
  const handleBouquetAdd = (e) => {
    e.preventDefault();
    const errors = validateForm(bouquetFormData);
    if (Object.keys(errors).length === 0) {
      setBouquets([
        ...bouquets,
        {
          ...bouquetFormData,
          quantity: parseInt(bouquetFormData.quantity),
          price: parseFloat(bouquetFormData.price),
        },
      ]);
      setBouquetFormData({ name: "", quantity: "", price: "", image: null });
      setBouquetErrors({});
    } else {
      setBouquetErrors(errors);
    }
  };

  // Handle add for Flowers
  const handleFlowerAdd = (e) => {
    e.preventDefault();
    const errors = validateForm(flowerFormData);
    if (Object.keys(errors).length === 0) {
      setFlowers([
        ...flowers,
        {
          ...flowerFormData,
          quantity: parseInt(flowerFormData.quantity),
          price: parseFloat(flowerFormData.price),
        },
      ]);
      setFlowerFormData({ name: "", quantity: "", price: "", image: null });
      setFlowerErrors({});
    } else {
      setFlowerErrors(errors);
    }
  };

  return (
    <>
      <div className="p-6 bg-darkG text-white rounded-lg">
        {/* Flower Bouquets Section */}
        <div className="mb-6">
          <div className="text-2xl font-semibold mb-4">Sales Inventory</div>
          <div className="text-xl font-semibold mb-2 text-center">Flower Bouquets</div>
          <form
            onSubmit={handleBouquetAdd}
            className="grid grid-cols-3 gap-4 mb-6"
          >
            <div>
              <label className="block mb-1">Bouquet Name</label>
              <input
                type="text"
                name="name"
                value={bouquetFormData.name}
                onChange={(e) => handleInputChange(e, "bouquet")}
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
                onChange={(e) => handleInputChange(e, "bouquet")}
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
                onChange={(e) => handleInputChange(e, "bouquet")}
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
                onChange={(e) => handleInputChange(e, "bouquet")}
                className="w-full px-3 py-2 rounded-lg bg-lightG text-black"
              />
            </div>
            <div className="flex justify-center items-end">
              <button
                type="submit"
                className="bg-lightG text-white px-4 py-2 rounded-3xl w-40 hover:bg-[#a3c5aa] transition"
              >
                ADD
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Flowers Section */}
      <div className="p-6 bg-darkG text-white rounded-lg mt-3">
        <div>
          <div className="text-xl font-semibold mb-2 text-center">Flowers</div>
          <form
            onSubmit={handleFlowerAdd}
            className="grid grid-cols-3 gap-4 mb-6"
          >
            <div>
              <label className="block mb-1">Flower Name</label>
              <input
                type="text"
                name="name"
                value={flowerFormData.name}
                onChange={(e) => handleInputChange(e, "flower")}
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
                onChange={(e) => handleInputChange(e, "flower")}
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
                onChange={(e) => handleInputChange(e, "flower")}
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
                onChange={(e) => handleInputChange(e, "flower")}
                className="w-full px-3 py-2 rounded-lg bg-lightG text-black"
              />
            </div>
            <div className="flex justify-center items-end">
              <button
                type="submit"
                className="bg-lightG text-white px-4 py-2 rounded-3xl w-40 hover:bg-[#a3c5aa] transition"
              >
                ADD
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SalesInventory;
