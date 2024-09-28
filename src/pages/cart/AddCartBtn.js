import React from "react";

const AddCartBtn =({addedCart}) => {
    const handleCreate = () => {
        console.log(addedCart);
        
    }

    return (
        <>
            <button onClick={()=> handleCreate()}>
                Add to Cart
            </button>
        </>
    )
}

export default AddCartBtn;