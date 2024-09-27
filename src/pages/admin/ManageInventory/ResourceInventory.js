import React, { useEffect, useState } from "react";
import EditResourceItemModal from "./EditResourceItemModal";
import { api } from "../../../config/api";
import html2pdf from "html2pdf.js";

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
  const [printData, setPrintData] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle quantity specifically to prevent negative numbers and zero
    if (name === "quantity") {
      const intValue = parseInt(value, 10);
      // Check if the value is a number and greater than 0
      if (!isNaN(intValue) && intValue > 0) {
        setFormData({
          ...formData,
          [name]: intValue.toString(), // Store it back as a string if needed
        });
      } else if (value === "") {
        // Allow clear to reset the field
        setFormData({
          ...formData,
          [name]: "",
        });
      }
      // Do nothing if conditions don't meet, effectively ignoring the input
    } else {
      // For other inputs, proceed as normal
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const validateForm = () => {
    let formErrors = {};
    if (!formData.itemCode) formErrors.itemCode = "Item Code is required";
    if (!formData.itemName) formErrors.itemName = "Item Name is required";
    if (!formData.itemCategory)
      formErrors.itemCategory = "Item Category is required";
    if (!formData.quantity) {
      formErrors.quantity = "Quantity is required";
    } else if (isNaN(formData.quantity)) {
      formErrors.quantity = "Quantity must be a number";
    } else if (parseInt(formData.quantity) < 1) {
      formErrors.quantity = "Quantity must be 1 or more";
    }
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
      const item = inventory[index];
      try {
        const response = await api.delete(
          `/api/inventory/deleteresourceitem/${item.productID}`
        );
        if (response.status === 200) {
          getItems();
          console.log("Item deleted successfully and record saved.");
          await api.post("/api/inventory/addinventoryrecord", {
            productID: item.productID,
            name: item.name,
            category: item.category,
            quantity: item.quantity,
            action: "Delete",
            dateTime: new Date().toISOString(),
          });
        } else {
          console.error("Failed to delete item from inventory.");
        }
      } catch (error) {
        console.error("Error deleting resource item:", error);
      }
    }
  };

  const handleModalSave = async () => {
    try {
      // Attempt to update the resource item with new data
      const updateResponse = await api.patch(
        `/api/inventory/updateresourceitem/${editData.productID}`,
        {
          name: editData.name,
          category: editData.category,
          quantity: parseInt(editData.quantity),
        }
      );
      if (updateResponse.status === 200) {
        // If the update is successful, record the update action
        await api.post("/api/inventory/addinventoryrecord", {
          productID: editData.productID,
          name: editData.name,
          category: editData.category,
          quantity: parseInt(editData.quantity),
          action: "Edit",
          dateTime: new Date().toISOString(),
        });
        console.log("Item updated and record saved.");
      } else {
        console.error("Failed to update item.");
      }
      getItems(); // Refresh the list after updating
      setIsModalOpen(false); // Close the modal after saving
    } catch (error) {
      console.error("Error updating resource item:", error);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await api.get("/api/inventory/getallrecords");
      const records = response.data; // Assume it's an array of items
      const printableContent = generatePrintableContent(records);
      downloadReport(printableContent);
    } catch (error) {
      console.error("Failed to fetch records for printing", error);
    }
  };

  const formatDateTime = (dateTime) => {
    return dateTime.replace("T", " ").substring(0, 16); // Format to "YYYY-MM-DD HH:MM"
  };

  const generatePrintableContent = (records) => {
    const element = document.createElement("div");
    element.innerHTML = `
      <div style="text-align: center; margin-bottom: 50px;">
        <h1 style="font-size: 25px; font-weight: bold;">Resource Inventory Records</h1>
      </div>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="border: 1px solid black; padding: 8px;">#</th>
            <th style="border: 1px solid black; padding: 8px;">Item Code</th>
            <th style="border: 1px solid black; padding: 8px;">Item Name</th>
            <th style="border: 1px solid black; padding: 8px;">Item Category</th>
            <th style="border: 1px solid black; padding: 8px;">Quantity</th>
            <th style="border: 1px solid black; padding: 8px;">Date & Time</th>
            <th style="border: 1px solid black; padding: 8px;">Action</th>
          </tr>
        </thead>
        <tbody>
          ${records
            .toReversed()
            .map(
              (item, index) => `
            <tr>
              <td style="border: 1px solid black; padding: 8px;">${
                index + 1
              }</td>
              <td style="border: 1px solid black; padding: 8px;">${
                item.productID
              }</td>
              <td style="border: 1px solid black; padding: 8px;">${
                item.name
              }</td>
              <td style="border: 1px solid black; padding: 8px;">${
                item.category
              }</td>
              <td style="border: 1px solid black; padding: 8px;">${
                item.quantity
              }</td>
              <td style="border: 1px solid black; padding: 8px;">${formatDateTime(
                item.dateTime
              )}</td>
              <td style="border: 1px solid black; padding: 8px;">${
                item.action
              }</td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>`;
    return element;
  };

  const downloadReport = (element) => {
    const options = {
      margin: 1,
      filename: "inventory_report.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf()
      .set(options)
      .from(element)
      .toPdf()
      .get("pdf")
      .then(function (pdf) {
        // Process if necessary
      })
      .save();
  };

  return (
    <div>
      <div className="p-6 bg-darkG text-black rounded-lg">
        <div>
          <div className="mb-6 flex justify-between">
            <div className="text-2xl font-semibold">Resource Inventory</div>
            <button
              className="bg-lightG font-bold py-2 text rounded-lg w-52 rounded hover:bg-[#c9d5b0]"
              onClick={handleDownload}
            >
              Report Download
            </button>
          </div>

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
                className="col-span-2 bg-lightG text-black px-4 py-2 rounded-3xl w-40 hover:bg-[#a3c5aa] transition"
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
                    className="text-[16px] uppercase rounded-[16px] font-semibold tracking-wide bg-[#F5DAD2] hover:bg-[#f1c0b1] py-1 px-4 font-sans dark:text-[#000000]"
                    onClick={() => handleEdit(index)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-[16px] uppercase rounded-[16px] font-semibold tracking-wide bg-[#F5DAD2] hover:bg-[#f1c0b1] py-1 px-4  font-sans dark:text-[#000000] ml-2"
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
