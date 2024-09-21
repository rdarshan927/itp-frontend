import React, { useState } from "react";
import BouquetForm from "./BouquetForm";
import FlowerForm from "./FlowerForm";

const SalesInventory = () => {
  const [activeTab, setActiveTab] = useState("flowers");
  const [bouquets, setBouquets] = useState([
    { name: "Tulip Heaven", price: "Rs.2000", quantity: 20, image: "path/to/tulip-heaven.jpg" },
    { name: "Floral Fantacy", price: "Rs.5000", quantity: 10, image: "path/to/floral-fantacy.jpg" },
    { name: "Romance", price: "Rs.7000", quantity: 30, image: "path/to/romance.jpg" },
    { name: "Lousia", price: "Rs.15000", quantity: 20, image: "path/to/lousia.jpg" }
  ]);
  const [flowers, setFlowers] = useState([
    { name: "Pink Rose", price: "Rs.500", quantity: 20, image: "path/to/pink-rose.jpg" },
    { name: "White Daisy", price: "Rs.450", quantity: 15, image: "path/to/white-daisy.jpg" },
    { name: "Sunflower", price: "Rs.350", quantity: 30, image: "path/to/sunflower.jpg" },
    { name: "Purple Tulip", price: "Rs.1000", quantity: 40, image: "path/to/purple-tulip.jpg" }
  ]);

  const addBouquet = (bouquet) => {
    setBouquets([...bouquets, bouquet]);
  };

  const addFlower = (flower) => {
    setFlowers([...flowers, flower]);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div className="p-6 bg-darkG text-white rounded-lg">
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
          {activeTab === "flowers" && <FlowerForm addFlower={addFlower} />}
          {activeTab === "bouquets" && <BouquetForm addBouquet={addBouquet} />}
        </div>
      </div>

      <div className="text-2xl font-semibold mb-4 mt-4 ml-4">Current Sales Items</div>
      <div className="text-xl font-semibold mb-4 ml-8">Flowers</div>
      <div className="grid grid-cols-4 gap-4 ml-4">
        {flowers.map(flower => (
          <ItemCard key={flower.name} item={flower} />
        ))}
      </div>
      <div className="text-xl font-semibold mb-4 ml-8 mt-8">Bouquets</div>
      <div className="grid grid-cols-4 gap-4 ml-4">
        {bouquets.map(bouquet => (
          <ItemCard key={bouquet.name} item={bouquet} />
        ))}
      </div>
    </>
  );
};

export default SalesInventory;

const ItemCard = ({ item }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded-t-lg mb-4" />
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
        <p className="text-gray-500">{`Price: ${item.price}`}</p>
        <p className="text-gray-500">{`Available: ${item.quantity}`}</p>
      </div>
    </div>
  );
};


