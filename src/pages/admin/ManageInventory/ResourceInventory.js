import React, { useEffect, useState } from "react";
import EditResourceItemModal from "./EditResourceItemModal";
import { api } from "../../../config/api";

const ResourceInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [formData, setFormData] = useState({
    itemCode: "",
    itemName: "",
    itemCategory: "",
    quantity: "",
  });
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditIndex, setCurrentEditIndex] = useState(null);
  const [editData, setEditData] = useState({
    productID: "",
    name: "",
    category: "",
    quantity: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    let formErrors = {};
    if (!formData.itemCode) formErrors.itemCode = "Item Code is required";
    if (!formData.itemName) formErrors.itemName = "Item Name is required";
    if (!formData.itemCategory)
      formErrors.itemCategory = "Item Category is required";
    if (!formData.quantity || isNaN(formData.quantity))
      formErrors.quantity = "Quantity must be a number";
    return formErrors;
  };

  const getItems = async () => {
    try {
      const response = await api.get("/api/inventory/getresourceitems");
      setInventory(response.data);
      console.log("Fetched Resource Items:", response.data);
    } catch (error) {
      console.error("There was an error while fetching data!", error);
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      try {
        const response = await api.post("/api/inventory/addresourceitem", {
          productID: formData.itemCode,
          name: formData.itemName,
          category: formData.itemCategory,
          quantity: parseInt(formData.quantity),
        });
        getItems();
        setFormData({
          itemCode: "",
          itemName: "",
          itemCategory: "",
          quantity: "",
        });
        setErrors({});
      } catch (error) {
        console.error("Error adding resource item:", error);
      }
    } else {
      setErrors(formErrors);
    }
  };

  const handleEdit = (index) => {
    setCurrentEditIndex(index);
    setEditData(inventory[index]);
    setIsModalOpen(true);
  };

  const handleDelete = async (index) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmDelete) {
      try {
        const itemID = inventory[index].productID;
        await api.delete(`/api/inventory/deleteresourceitem/${itemID}`);
        getItems();
      } catch (error) {
        console.error("Error deleting resource item:", error);
      }
    }
  };

  const handleModalSave = async () => {
    try {
      await api.patch(
        `/api/inventory/updateresourceitem/${editData.productID}`,
        {
          name: editData.name,
          category: editData.category,
          quantity: parseInt(editData.quantity),
        }
      );
      getItems();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating resource item:", error);
    }
  };

  return (
    <div>
      <div className="p-6 bg-darkG text-white rounded-lg">
        <div>
          <div className="text-2xl font-semibold mb-6">Resource Inventory</div>
          <form onSubmit={handleAdd} className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block mb-1">Item Code</label>
              <input
                type="text"
                name="itemCode"
                value={formData.itemCode}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-lightG text-black"
              />
              {errors.itemCode && (
                <p className="text-red-500 text-sm">{errors.itemCode}</p>
              )}
            </div>
            <div>
              <label className="block mb-1">Item Name</label>
              <input
                type="text"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-lightG text-black"
              />
              {errors.itemName && (
                <p className="text-red-500 text-sm">{errors.itemName}</p>
              )}
            </div>
            <div></div>
            <div>
              <label className="block mb-1">Item Category</label>
              <input
                type="text"
                name="itemCategory"
                value={formData.itemCategory}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-lightG text-black"
              />
              {errors.itemCategory && (
                <p className="text-red-500 text-sm">{errors.itemCategory}</p>
              )}
            </div>
            <div>
              <label className="block mb-1">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-lightG text-black"
              />
              {errors.quantity && (
                <p className="text-red-500 text-sm">{errors.quantity}</p>
              )}
            </div>
            <div className="flex justify-center items-end">
              <button
                type="submit"
                className="col-span-2 bg-lightG text-white px-4 py-2 rounded-3xl w-40 hover:bg-[#a3c5aa] transition"
              >
                ADD
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="text-lg font-semibold mb-3 mt-5">
        Current Stock - Resource Inventory
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-3">
          <thead>
            <tr className="text-left">
              <th className="px-4 py-2 border-b">#</th>
              <th className="px-4 py-2 border-b">Item Code</th>
              <th className="px-4 py-2 border-b">Item Name</th>
              <th className="px-4 py-2 border-b">Item Category</th>
              <th className="px-4 py-2 border-b">Quantity</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border-b bg-lightG rounded-s-xl">
                  {index + 1}
                </td>
                <td className="px-4 py-2 border-b bg-lightG">
                  {item.productID}
                </td>
                <td className="px-4 py-2 border-b bg-lightG">{item.name}</td>
                <td className="px-4 py-2 border-b bg-lightG">
                  {item.category}
                </td>
                <td className="px-4 py-2 border-b bg-lightG">
                  {item.quantity}
                </td>
                <td className="px-4 py-2 border-b bg-lightG rounded-e-xl">
                  <button
                    className="text-[16px] uppercase rounded-[16px] font-semibold tracking-wide bg-[#F5DAD2] hover:bg-[#f1c0b1] py-1 px-4 text-[#FCFFE0] font-sans dark:text-[#000000]"
                    onClick={() => handleEdit(index)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-[16px] uppercase rounded-[16px] font-semibold tracking-wide bg-[#F5DAD2] hover:bg-[#f1c0b1] py-1 px-4 text-[#FCFFE0] font-sans dark:text-[#000000] ml-2"
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
      {isModalOpen && (
        <EditResourceItemModal
          editData={editData}
          setEditData={setEditData}
          handleModalSave={handleModalSave}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </div>
  );
};

export default ResourceInventory;
