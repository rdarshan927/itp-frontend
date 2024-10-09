import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../config/api'; // Using your custom API utility

function ForgetPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex
        if (!emailPattern.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        // Clear any previous errors
        setError('');

        try {
            const res = await api.post('/api/forgot-password', { email });
            if (res.data.Status === 'Success') {
                navigate('/login');
            } else {
                // Handle error response from the API if necessary
                setError('Failed to send email. Please try again.');
            }
        } catch (err) {
            console.log(err);
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div
            className="flex justify-center items-center bg-cover bg-center min-h-screen backdrop-blur-xl"
            style={{
                backgroundImage: `url('./Images/bg5.jpg')`,
                backdropFilter: 'blur(40px)',
            }}
        >
            <div className="bg-white p-12 rounded-lg w-1/3 shadow-lg h-76 bg-opacity-90">
                <h4 className="text-2xl font-semibold mb-7 text-gray-800">Forgot Password</h4>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-2xl font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            autoComplete="off"
                            name="email"
                            className="mt-1 block w-full px-3 py-3 border border-lightG rounded-md shadow-sm focus:outline-none focus:ring-lightG-500 focus:border-lightG-500 sm:text-lg mt-4"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </div>
                    <div className="w-full flex justify-center">
                        <button
                            type="submit"
                            className="w-1/3 py-3 px-4 bg-darkG text-black font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 mx-auto mt-3"
                        >
                            Send
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ForgetPassword;
