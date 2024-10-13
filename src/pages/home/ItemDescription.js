import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AddCartBtn from "../cart/AddCartBtn";

const ItemDescription = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { item } = location.state || {};

  if (!item) {
    navigate("../");
  }

  return (
    <div className="flex items-center justify-center h-screen ">
      <div className="bg-darkG rounded-lg shadow-md p-4 w-80 -mt-40">
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
    </div>
  );
};

export default ItemDescription;
