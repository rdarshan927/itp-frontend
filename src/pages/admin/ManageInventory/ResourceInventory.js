import React, { useEffect, useState } from "react";
import EditResourceItemModal from "./EditResourceItemModal";
import { api } from "../../../config/api";
import html2pdf from "html2pdf.js";
import emailjs from "@emailjs/browser";
import { handleError, handleSuccess } from "../../../utils";
import { ToastContainer } from "react-toastify";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [lowStockItems, setLowStockItems] = useState([]); // Track low stock items
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Validate quantity input for positive whole numbers only, up to 4 digits
    if (name === "quantity") {
      // Allow only positive integers greater than 0 using RegEx and limit to 4 digits
      const quantityPattern = /^[1-9][0-9]*$/;
      if (value === "" || (quantityPattern.test(value) && value.length <= 4)) {
        setFormData({
          ...formData,
          [name]: value,
        });
      }
    } else {
      // Limit other input fields to 20 characters
      if (value.length <= 20) {
        setFormData({
          ...formData,
          [name]: value,
        });
      }
    }
  };

  const handleKeyDown = (e) => {
    if (
      ["e", "E", "+", "-", ".", "/"].includes(e.key) // Block these characters
    ) {
      e.preventDefault();
    }
  };

  //after clicking the add button
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
      const items = response.data;
      setInventory(items);

      // Find items with quantity less than 5
      const lowStock = items.filter((item) => item.quantity < 5);
      setLowStockItems(lowStock); // Set low stock items
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
        await api.post("/api/inventory/addinventoryrecord", {
          //report
          productID: formData.itemCode,
          name: formData.itemName,
          category: formData.itemCategory,
          quantity: formData.quantity,
          action: "Add",
          dateTime: new Date().toISOString(),
        });
        setFormData({
          itemCode: "",
          itemName: "",
          itemCategory: "",
          quantity: "",
        });
        setErrors({});
        getItems();
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
      const response = await api.get("/api/inventory/getallrecords/resource");
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

  //report
  const generatePrintableContent = (records) => {
    const element = document.createElement("div");
    element.innerHTML = `
      <div style="text-align: center; margin-bottom: 50px;">
        <h1 style="font-size: 20px; font-weight: bold;">Resource Inventory Records</h1>
      </div>
      <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
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

  const handleEmailNotification = () => {
    const templateParams = {
      lowStockItems: lowStockItems
        .map(
          (item, index) =>
            `${index + 1}. ${item.name} (Code: ${item.productID}) - Quantity: ${
              item.quantity
            }`
        )
        .join("\n"),
    };

    emailjs
      .send(
        "service_suk6vfa", // Replace with your EmailJS service ID
        "template_ijd4f75", // Replace with your EmailJS template ID
        templateParams,
        "ADcp2FigtWrnqkX8i" // Replace with your EmailJS user ID
      )
      .then(
        (response) => {
          console.log(
            "Email sent successfully!",
            response.status,
            response.text
          );
          handleSuccess("Email sent successfully!");
          togglePopup();
        },
        (error) => {
          console.error("Failed to send email.", error);
          handleError("Failed to send email.");
        }
      );
  };

  //--------Search----------//
  const filteredInventory = inventory.filter(
    (item) =>
      item.productID.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  return (
    <div>
      <div className="p-6 bg-darkG text-black dark:bg-cTwo dark:text-white rounded-lg">
        <div>
          <div className="mb-6 flex justify-between">
            <div className="text-2xl font-semibold">Resource Inventory</div>
            <div className="flex items-center">
              <div className="relative">
                <button
                  className="bg-lightG font-bold py-2 px-4 rounded-lg hover:bg-[#c9d5b0]"
                  onClick={togglePopup}
                >
                  <span role="img" aria-label="notification">
                    🔔
                  </span>
                </button>

                {/* Popup menu for low stock items */}
                {isPopupVisible && (
                  <div className="absolute right-0 w-96 mt-2 bg-white shadow-lg rounded-lg p-4">
                    <div className="flex justify-between align-center mb-6">
                      <strong className="mt-2">Low Stock Items</strong>
                      <button
                        className="bg-lightG font-bold py-2 px-4 rounded-lg hover:bg-[#c9d5b0] dark:bg-bOne"
                        onClick={handleEmailNotification}
                      >
                        Notify with an Email
                      </button>
                    </div>
                    <ul>
                      {lowStockItems?.length > 0 ? (
                        lowStockItems.map((item, index) => (
                          <li key={index}>
                            {index + 1}. {item.name} (Code: {item.productID}) -
                            Quantity: {item.quantity}
                          </li>
                        ))
                      ) : (
                        <li>No low stock items</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
              <button
                className="bg-lightG font-bold py-2 text rounded-lg w-52 hover:bg-[#c9d5b0] ml-4 dark:bg-bOne"
                onClick={handleDownload}
              >
                Report Download
              </button>
            </div>
          </div>

          <form onSubmit={handleAdd} className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block mb-1">Item Code</label>
              <input
                type="text"
                name="itemCode"
                value={formData.itemCode}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-lightG dark:bg-bOne"
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
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only letters (a-z, A-Z)
                  if (/^[A-Za-z]*$/.test(value)) {
                    handleChange(e);
                  }
                }}
                className="w-full px-3 py-2 rounded-lg bg-lightG dark:bg-bOne"
                title="Please enter letters only" // Tooltip message for invalid input
                required // Optional: makes the field required
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
                className="w-full px-3 py-2 rounded-lg bg-lightG dark:bg-bOne"
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
                className="w-full px-3 py-2 rounded-lg bg-lightG dark:bg-bOne"
                onKeyDown={handleKeyDown}
              />
              {errors.quantity && (
                <p className="text-red-500 text-sm">{errors.quantity}</p>
              )}
            </div>

            <div className="flex justify-center items-end">
              <button
                type="submit"
                className="col-span-2 bg-lightG text-black px-4 py-2 rounded-3xl w-40 hover:bg-[#a3c5aa] transition dark:bg-bOne"
              >
                ADD
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="text-lg font-semibold mb-3 mt-5">
          Current Stock - Resource Inventory
        </div>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 h-10 mt-5"
        />
      </div>

      <div className="overflow-x-auto ">
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
            {filteredInventory.map((item, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border-b bg-lightG dark:bg-bOne rounded-s-xl">
                  {index + 1}
                </td>
                <td className="px-4 py-2 border-b bg-lightG dark:bg-bOne">
                  {item.productID}
                </td>
                <td className="px-4 py-2 border-b bg-lightG dark:bg-bOne">{item.name}</td>
                <td className="px-4 py-2 border-b bg-lightG dark:bg-bOne">
                  {item.category}
                </td>
                <td className="px-4 py-2 border-b bg-lightG dark:bg-bOne">
                  {item.quantity}
                </td>
                <td className="px-4 py-2 border-b bg-lightG dark:bg-bOne rounded-e-xl">
                  <button
                    className="text-[16px] uppercase rounded-[16px] font-semibold tracking-wide bg-[#F5DAD2] hover:bg-[#f1c0b1] py-1 px-4 font-sans dark:text-white dark:bg-cOne"
                    onClick={() => handleEdit(index)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-[16px] uppercase rounded-[16px] font-semibold tracking-wide bg-[#F5DAD2] hover:bg-[#f1c0b1] py-1 px-4  font-sans dark:text-white dark:bg-cOne ml-2"
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
      <ToastContainer />
    </div>
  );
};

export default ResourceInventory;
