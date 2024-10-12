import React, { useEffect, useState } from "react";
import { api } from "../../config/api";
import ItemCard from "./ItemCard";

const Flower = () => {
  const [flowers, setFlowers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const getItems = async () => {
    try {
      const response = await api.get("/api/inventory/getsalesitems");
      const items = response.data;
      setFlowers(items.filter((item) => item.category === "flower"));
    } catch (error) {
      console.error("There was an error while fetching data!", error);
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  // Filter flowers and bouquets by search query
  const filteredFlowers = flowers.filter(
    (item) =>
      item.productID.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="text-2xl font-semibold text-darkG text-center pt-5 mt-20">
        Flowers
      </div>
      <div className="flex justify-between mb-4 ml-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 h-10 mt-4"
        />
      </div>
      <hr />
      <div className="grid grid-cols-4 gap-4 mx-4 my-10">
        {filteredFlowers.map((flower) => (
          <div className="flex justify-center w-full" key={flower.productID}>
            <ItemCard item={flower} getItems={getItems} />
          </div>
        ))}
      </div>
    </>
  );
};

export default Flower;
