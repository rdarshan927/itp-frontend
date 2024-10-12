import React from "react";
// import { useNavigate } from "react-router-dom";
import AddCartBtn from "../cart/AddCartBtn";

const ItemCard = ({ item }) => {
  // const navigate = useNavigate();

  // const handleClick = () => {
  //   navigate(`./${item.productID}`, { state: { item } });
  // };

  return (
    <div
      className="bg-darkG rounded-lg shadow-md p-4 w-80 transform transition-all duration-300 hover:scale-105 cursor-pointer"
      // onClick={handleClick}
    >
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
      <div className="text-center mt-5">
          <AddCartBtn addedCart={item} />
        </div>
    </div>
  );
};

export default ItemCard;
