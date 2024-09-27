import React, { useEffect, useState } from "react";
import BouquetForm from "./BouquetForm";
import FlowerForm from "./FlowerForm";
import { api } from "../../../config/api";
import ItemCard from "./ItemCard";

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

  // const saveRecord = async (data, action) => {
  //   try {
  //     await api.post("/api/inventory/addinventoryrecord", {
  //       productID: data.itemCode,
  //       name: data.itemName,
  //       category: data.itemCategory,
  //       quantity: parseInt(data.quantity),
  //       action: action,
  //     });
  //   } catch (error) {
  //     console.error("Error recording inventory:", error);
  //   }
  // };

  return (
    <>
      <div className="p-6 bg-darkG text-black rounded-lg">
        <div className="mb-6">
          <div className="text-2xl font-semibold mb-4">Sales Inventory</div>
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
          {activeTab === "flowers" && <FlowerForm getItems={getItems} />}
          {activeTab === "bouquets" && <BouquetForm getItems={getItems} />}
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
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default SalesInventory;
