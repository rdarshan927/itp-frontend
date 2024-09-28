import React, { useState } from 'react';
import { api } from '../../config/api'

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        address: '',
        phoneNumber: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
 
        try {
            const response = await api.post('/api/sheporausers/create', formData);
            // const result = await response.json();

            if (response.status === 201) {
                alert('User created successfully!');
            }       
           
        } catch (error) {
            // console.error('Error:', error);
            if(error.response.status === 409){
                alert("Email already exists!")
            }else if (error.response.status === 408){
                alert("Phone number should contain 10 numbers!")
            }else if(error.response.status === 400){
                alert("Enter the valied Email!")
            }else if(error.response.status === 411){
                alert("Ivalid password, minimum length 8,minimum non alphanumaric characters: 1")
            }
            
        }
    };

    return (
        <div className="md:grid md:grid-cols-5 h-screen w-screen">
            {/* Image Section */}
            <div className="col-span-3 hidden md:flex">
                <img src="./Images/bg1.jpg" alt="Flower Garden" className="w-full h-full object-cover" />
            </div>
            {/* Form Section */}
            <div className="md:col-span-2 flex flex-col justify-center items-center p-10 ">
                <div className="w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-2 text-darkG">Welcome back</h2>
                    <p className="mb-5 text-darkG">Welcome back! Please enter your details</p>
                    <form onSubmit={handleSubmit} className="flex flex-col items-start">
                        <label className="mb-1 text-lightG">Email</label>
                        <input
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="mb-2 p-2 border border-darkG rounded text-black w-full"
                        />
    
                        <label className="mb-1 text-lightG">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="mb-2 p-2 border border-darkG rounded text-black w-full"
                        />
    
                        <label className="mb-1 text-lightG">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                            className="mb-3 p-2 border border-darkG rounded text-black w-full"
                        />
    
                        <label className="mb-1 text-lightG">Phone number</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                            className="mb-3 p-2 border border-darkG rounded text-black w-full"
                        />
    
                        <label className="mb-1 text-lightG">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="mb-3 p-2 border border-darkG rounded text-black w-full"
                        />
                        <div className="flex justify-center w-full p-2">
                            <button
                                type="submit"
                                className="py-2 px-4 bg-lightG text-clientWhite font-semibold uppercase rounded-lg tracking-wide hover:bg-lightP-500 m-3 w-full"
                            >
                                Register
                            </button>
                        </div>
                    </form>
                    <p className="mt-5 text-darkG text-center p-2">
                        Already have an account? <a href="/login" className="text-darkG hover:underline">Login</a>
                    </p>
                </div>
            </div>
        </div>
    );
    
    
}    
export default Register;
