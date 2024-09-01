import React, { useEffect, useState } from "react";
import { api } from '../../config/api';
import {loadStripe} from '@stripe/stripe-js'
import { MdDelete } from 'react-icons/md';
import AddCartBtn from "./AddCartBtn";

const Cart = () => {
    const [carts, setCarts] = useState([]);
    const [total, setTotal] = useState(0);
    const [deliveryAddress, setDeliveryAddress] = useState('No address have been set!')
    const [receiverPhone, setReceiverPhone] = useState('No receiver phone number set!')

    const userEmail = localStorage.getItem('useremail')

    useEffect(() => {
        const fetchCarts = async () => {
            try {
                const response = await api.get(`/api/cart/get/${userEmail}`);
                setCarts(response.data);
                console.log('Fetched carts:', response.data);
            } catch(error) {
                console.error('There was an error while fetching data!', error);
            }

            try {
                const response = await api.get(`/api/cart/get/delivery/${userEmail}`);
                setDeliveryAddress(response.data[0].deliveryAddress);
                setReceiverPhone(response.data[0].receiverPhoneNumber);
                console.log(deliveryAddress);
                console.log(receiverPhone)
            } catch(error) {
                console.log(error)
            }
        }

        fetchCarts();
    }, []);

    useEffect(() => {
        // Calculate the total price whenever the carts state changes
        const newTotal = carts.reduce((acc, cart) => acc + (cart.price * cart.quantity), 0);
        setTotal(newTotal);
    }, [carts]);

    const handleIncrease = async(cart) => {
        console.log("came here")
        if (cart.quantity >= 1) {
            try {
                const updatedQuantity = ++cart.quantity;
                console.log('Increasing quantity to:', updatedQuantity);
                const response = await api.patch(`/api/cart/update/${cart._id}`, { quantity: updatedQuantity });

                if (response.status === 200) {
                    console.log('Quantity updated');
                    setCarts(prevCarts =>
                        prevCarts.map(item =>
                            item._id === cart._id ? { ...item, quantity: updatedQuantity } : item
                        )
                    );
                } else {
                    console.error('Failed to update quantity', response.status, response.data);
                }
            } catch (error) {
                console.error('Error updating quantity', error);
            }
        }
    };

    const handleDecrease = async(cart) => {
        if (cart.quantity > 1) {
            try {
                const updatedQuantity = cart.quantity - 1;
                console.log('Decreasing quantity to:', updatedQuantity);
                const response = await api.patch(`/api/cart/update/${cart._id}`, { quantity: updatedQuantity });

                if (response.status === 200) {
                    console.log("Quantity updated");
                    setCarts(prevCarts => 
                        prevCarts.map(item => 
                            item._id === cart._id ? { ...item, quantity: updatedQuantity } : item
                        )
                    );
                } else {
                    console.error('Failed to update quantity', response.status, response.data);
                }
            } catch (error) {
                console.error('Error updating quantity', error);
            }
        }
    };

    const handleDelete = async(cart) => {
        try {
            const response = await api.delete(`/api/cart/delete/${cart._id}`);

            if(response.status === 200){
                console.log('deleted');
                setCarts(prevCarts =>
                prevCarts.filter(item => item._id !== cart._id)
            );
            } else{
                console.log('failed to remove');
            }
        } catch (error){
            console.error('Error deleting cart', error);
        }
    }

    const makePayment = async() => {
        const stripe = await loadStripe('pk_test_51Pi8DoFEujboZPsPDslDFvGmwOsAHFIdTuTPxB5VuPnNpWoWwk1W64rvX79kxiSVeA8sPQy3Di2a0AQNJYvyY4gs00TSGbrgDt');
    
        console.log(carts)
        const body = {
            products: carts
        }

        try{
            const response = await api.post(`/api/paid/${userEmail}`, body)
            if (!response.status || response.status < 200 || response.status >= 300) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }


            // const session = await response.json();
            let session;
            try {
                session = await response.data;
                console.log("Session received:", session);
            } catch (jsonError) {
                console.error("Failed to parse JSON response", jsonError);
                throw new Error("Invalid JSON response from the server");
            }

            if (!session.id) {
                throw new Error("Session ID not found in the response");
            }
            sessionStorage.setItem('stripeSessionId', session.id);  // until login page is done

            const result = await stripe.redirectToCheckout({
                sessionId:session.id
            });

            if(result.error){
                console.log("error while making payment inside ", result.error)
            }
        } catch(error){
            console.log("error while making payment ", error)
        }
    }

    return (
        <section className="m-[1%]">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="lg:order-2 col-span-1 lg:col-span-1">
                    {/* Order Summary */}
                    <div className="bg-darkG p-4 rounded-lg lg:min-h-[250px] lg:h-auto my-4">
                        <h2 className="font-semibold text-lg">Order Summary</h2>
                        <p className="flex justify-between mt-4">
                            <span>Sub Total:</span>
                            <span>Rs. {total}</span>
                        </p>
                        <p className="flex justify-between">
                            <span>Flat Discount:</span>
                            <span>00.00</span>
                        </p>
                        <hr className="my-4" />
                        <p className="flex justify-between font-semibold">
                            <span>Total:</span>
                            <span>Rs. {total}</span>
                        </p>
                        <div className="lg:flex-col flex items-center justify-center">
                            <button className="w-full bg-lightG py-2 rounded-md mt-4 md:mx-4 mx-1 h-fit" onClick={() => {makePayment()}}>CHECKOUT</button>
                            <button className="w-full bg-lightG py-2 md:px-5 px-2 rounded-md mt-4 lg:mt-2 md:mx-4 mx-1 w0">CONTINUE SHOPPING</button>
                        </div>
                    </div>

                    <div className="bg-darkG p-4 rounded-lg lg:min-h-[250px] lg:h-auto my-4">
                        <h2 className="font-semibold text-lg"> Receiver Details </h2>
                        <p> Default Receiver Mobile No </p>
                        <p> {receiverPhone} </p>
                        <p> Default Delivery Address </p>
                        <p> {deliveryAddress} </p>
                        
                    </div>
                </div>

                {/* Cart Items */}
                <div className="lg:order-1 col-span-1 lg:col-span-3 p-4 rounded-lg sm:flex hidden">
                    <table className="w-full">
                    <thead>
                        <tr className="text-left text-lg font-bold" colSpan={4}>
                            <th className="px-4">Product</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            <th className="mm:w-16 w-28 lg:w-28"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {carts.map((cart) => (
                        <tr key={cart._id} className="text-xs  text-center">
                            <td colSpan={4}>
                                <div className="flex justify-between items-center bg-darkG p-4 rounded-md">
                                    <div className="flex items-center">
                                        <img src="https://avatars.githubusercontent.com/u/64832773?v=4" alt="Product" className="w-16 h-16 mr-4 rounded-md flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold">{cart.productName}</p>
                                        <p>Rs. {cart.price}</p>
                                    </div>
                                    </div>
                                    <div className="flex items-center justify-center bg-clientWhite rounded-xl w-18 py-1 px-2 font-semibold">
                                        <button className="text-black px-2 rounded-l-md" onClick={() => handleDecrease(cart)}>-</button>
                                        <span className="px-1 text-black">{cart.quantity}</span>
                                        <button className="text-black px-2 rounded-r-md" onClick={() => handleIncrease(cart)}>+</button>
                                    </div>
                                    <p>Rs. {cart.price * cart.quantity}</p>
                                    <button className="text-white-600" onClick={() => handleDelete(cart)}><MdDelete size={30} /></button>
                                </div>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>

                </div>

                <div className="lg:order-1 col-span-1 lg:col-span-3 p-1 rounded-lg sm:hidden flex w-full">
                    <div className="p-1 rounded-lg w-full">
                        {carts.map((cart) => (
                            <div className="flex justify-between items-center bg-darkG p-4 rounded-md mb-4 w-full" key={cart._id}>
                                <div className="flex items-center ">
                                    <img src="https://avatars.githubusercontent.com/u/64832773?v=4" alt="Product" className="w-16 h-16 mr-4 rounded-md flex-shrink-0" />
                                    <div className="flex-grow">
                                        <p className="font-semibold truncate">{cart.productName}</p>
                                        <p className="text-xs">Rs. {cart.price}</p>
                                        <p>Rs. {cart.price * cart.quantity}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center bg-clientWhite rounded-xl sm:mx-4 text-sm"> 
                                    <button className="text-black px-2 rounded-l-md" onClick={() => handleDecrease(cart)}> - </button>
                                    <span className="px-2 py-1 text-black">{cart.quantity}</span>
                                    <button className="text-black px-2 rounded-r-md" onClick={() => handleIncrease(cart)}> + </button>
                                </div>
                                <button className="text-red-600 sm:ml-4" onClick={() => handleDelete(cart)}> <MdDelete size={30} /> </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <AddCartBtn addedCart={"hello"} />
        </section>
    )
}

export default Cart;
