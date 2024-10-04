import React, { useEffect, useState } from "react";
import BouquetForm from "./BouquetForm";
import FlowerForm from "./FlowerForm";
import { api } from "../../../config/api";
import ItemCard from "./ItemCard";
import html2pdf from "html2pdf.js";

const SalesInventory = () => {
  const [activeTab, setActiveTab] = useState("flowers");
  const [flowers, setFlowers] = useState([]);
  const [bouquets, setBouquets] = useState([]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const getItems = async () => {
    try {
      const response = await api.get("/api/inventory/getsalesitems");
      const items = response.data;
      setFlowers(items.filter((item) => item.category === "flower"));
      setBouquets(items.filter((item) => item.category === "bouquet"));
      console.log("Fetched Resource Items:", items);
    } catch (error) {
      console.error("There was an error while fetching data!", error);
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  const saveRecord = async (data, action, category) => {
    try {
      await api.post("/api/inventory/addinventoryrecord/", {
        productID: data.productID,
        name: data.name,
        category: category,
        quantity: parseInt(data.quantity),
        action: action,
        price: parseInt(data.price),
        dateTime: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error recording inventory:", error);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await api.get("/api/inventory/getallrecords/sales");
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
        <h1 style="font-size: 24px; font-weight: bold;">Resource Inventory Records</h1>
      </div>
      <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
        <thead>
          <tr>
            <th style="border: 1px solid black; padding: 8px;">#</th>
            <th style="border: 1px solid black; padding: 8px;">Item Code</th>
            <th style="border: 1px solid black; padding: 8px;">Item Name</th>
            <th style="border: 1px solid black; padding: 8px;">Item Category</th>
            <th style="border: 1px solid black; padding: 8px;">Quantity</th>
            <th style="border: 1px solid black; padding: 8px;">Price (Rs.)</th>
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
              <td style="border: 1px solid black; padding: 8px;">${
                item.price
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
      filename: "sales_inventory_report.pdf",
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
    <>
      <div className="p-6 bg-darkG text-black rounded-lg">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-semibold mb-4">Sales Inventory</div>
            <button
              className="bg-lightG font-bold py-2 text rounded-lg w-52 hover:bg-[#c9d5b0]"
              onClick={handleDownload}
            >
              Report Download
            </button>
          </div>

          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => handleTabClick("flowers")}
              className={`text-xl font-semibold px-4 py-2 rounded-lg hover:bg-[#a3c5aa] ${
                activeTab === "flowers" ? "bg-lightG" : "bg-transparent"
              }`}
            >
              Flowers
            </button>
            <button
              onClick={() => handleTabClick("bouquets")}
              className={`text-xl font-semibold px-4 py-2 rounded-lg hover:bg-[#a3c5aa] ${
                activeTab === "bouquets" ? "bg-lightG" : "bg-transparent"
              }`}
            >
              Bouquets
            </button>
          </div>
          {activeTab === "flowers" && (
            <FlowerForm getItems={getItems} saveRecord={saveRecord} />
          )}
          {activeTab === "bouquets" && (
            <BouquetForm getItems={getItems} saveRecord={saveRecord} />
          )}
        </div>
      </div>

      <div className="text-2xl font-semibold mb-4 mt-4 ml-4">
        Current Sales Items
      </div>
      <div className="text-xl font-semibold mb-4 ml-8">Flowers</div>
      <div className="grid grid-cols-4 gap-4 ml-4">
        {flowers.map((flower) => (
          <div className="flex justify-center w-full">
            <ItemCard
              key={flower.productID}
              item={flower}
              getItems={getItems}
              saveRecord={saveRecord}
            />
          </div>
        ))}
      </div>
      <hr className="mt-10"></hr>
      <div className="text-xl font-semibold mb-4 ml-8 mt-5">Bouquets</div>
      <div className="grid grid-cols-4 gap-4 ml-4">
        {bouquets.map((bouquet) => (
          <div className="flex justify-center w-full">
            <ItemCard
              key={bouquet.productID}
              item={bouquet}
              getItems={getItems}
              saveRecord={saveRecord}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default SalesInventory;
