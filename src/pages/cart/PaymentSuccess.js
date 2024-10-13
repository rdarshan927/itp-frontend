import React, { useEffect } from 'react';
// import { api } from '../../config/api';

const PaymentSuccess = () => {
    useEffect(() => {
        const fetchPaymentDetails = async () => {
            // Extract session_id from URL
            // const urlParams = new URLSearchParams(window.location.search);
            // const sessionId = urlParams.get('session_id');

            // if (sessionId) {
            //     try {
            //         // Call your backend to handle the payment
            //         const response = await api.post('/api/paymentsuccess', { sessionId });

            //         if (response.status === 200) {
            //             console.log('Payment completed successfully');
            //         } else {
            //             console.error('Failed to complete payment', response.status, response.data);
            //         }
            //     } catch (error) {
            //         console.error('Error completing payment', error);
            //     }
            // }
        };

        fetchPaymentDetails();
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-bOne">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center dark:bg-cTwo dark:text-white">
                <a href='/' className="text-gray-500 hover:text-red-500 text-xl absolute top-4 right-4">
                    X
                </a>
                <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
                <p className="text-lg mb-6">Thank you for your purchase. Your order is being processed.</p>
                <a href="/" className="bg-darkG text-white px-4 py-2 rounded ">
                    Return to Home
                </a>
            </div>
        </div>
    );
};

export default PaymentSuccess;
