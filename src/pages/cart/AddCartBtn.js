import React, { useState } from "react";
import { api } from '../../config/api';

const AddCartBtn = ({ addedCart }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const userEmail = localStorage.getItem('useremailc')

    const handleCreate = async () => {
        if (!addedCart || Object.keys(addedCart).length === 0) {
            console.error("Cart is empty");
            return; 
        }

        setLoading(true);
        setError(null); 

        try {
            console.log(addedCart, "hello");
            const response = await api.post(`/api/cart/add/${userEmail}`, addedCart);
            console.log(response.data); 

            if (response.status === 201){
                setSuccess("Added to cart.")
            }
        } catch (err) {
            if(err.status === 401){
                setError("Login first!")
            } else {
                setError("Failed to Add.");
            }
            console.error("Error adding to cart:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button 
                onClick={handleCreate} 
                disabled={loading} 
                className={`${
                    loading ? "bg-gray-400 cursor-not-allowed" : "bg-lightG hover:bg-green-600"
                } text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out`}
            >
                {loading ? "Adding..." : "Add to Cart"}
            </button>

            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-white">{success}</p>}
        </>
    );
}

export default AddCartBtn;