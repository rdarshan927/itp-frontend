import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../config/api'; // Using your custom API utility

function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const { id, token } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if passwords match
        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        // Validate password strength (example criteria: at least 8 characters, 1 uppercase, 1 lowercase, 1 number)
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordPattern.test(password)) {
            setError("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.");
            return;
        }

        // Clear error message
        setError('');

        try {
            const res = await api.post(`/api/reset-password`, { password, id, token });
            if (res.data.Status === 'Success') {
                setSuccessMessage("Password reset successfully! Redirecting to login...");
                setTimeout(() => navigate('/login'), 2000); // Redirect after 2 seconds
            } else {
                setError("Failed to reset password. Please try again.");
            }
        } catch (err) {
            console.log(err);
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <div
            className="flex justify-center items-center bg-cover bg-center min-h-screen"
            style={{ backgroundImage: `url('/Images/bg5.jpg')` }} // Use correct path
        >
            <div className="bg-white bg-opacity-90 p-6 rounded-lg w-1/3 shadow-lg h-90">
                <h4 className="text-2xl font-semibold mb-7 text-gray-800">Reset Password</h4>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="password" className=" mb-2 text-gray-800">
                            <strong>New Password</strong>
                        </label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            autoComplete="off"
                            name="password"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className=" mb-2 text-gray-800">
                            <strong>Confirm Password</strong>
                        </label>
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            autoComplete="off"
                            name="confirmPassword"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}

                    <div className="w-full flex justify-center">
                        <button
                            type="submit"
                            className="w-1/3 py-3 px-4 bg-darkG text-black font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 mx-auto mt-3"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;
