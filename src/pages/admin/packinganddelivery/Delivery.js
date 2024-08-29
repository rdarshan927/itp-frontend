import React from "react";


import AddDelivery from "./AddDelivery";
import ViewDelivery from "./ViewDelivery";
import Search from "./Search";


const Delivery =() => {
    return (
        <div>
             <Search />
             <AddDelivery />
             <ViewDelivery />
        </div>
    )
}

export default Delivery;