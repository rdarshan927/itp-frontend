import React, { useEffect } from 'react';
import { api } from '../../config/api';

const PaymentSuccess = () => {
    useEffect(() => {
        const fetchPaymentDetails = async () => {
            // Extract session_id from URL
            const urlParams = new URLSearchParams(window.location.search);
            const sessionId = urlParams.get('session_id');

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
        <div>
            <a href='/'>X</a>
            <h1>Payment Successful!</h1>
            <p>Thank you for your purchase. Your order is being processed.</p>
        </div>
    );
};

export default PaymentSuccess;
