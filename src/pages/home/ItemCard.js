import React from "react";

const ItemCard = ({ item }) => {
  return (
    <div className="bg-darkG rounded-lg shadow-md p-4 w-80">
      <img
        src={item.imageData || ""}
        alt={item.name}
        className="w-full h-60 object-cover rounded-lg mb-4"
      />
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
        <p>{`Rs: ${item.price}`}</p>
        <p>{`In Stock: ${item.quantity}`}</p>
      </div>
    </div>
  );
};

export default ItemCard;
