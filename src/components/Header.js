import React from "react";
import { useDarkMode } from "../config/darkMode";

const Header = () => {
    const { darkMode, toggleDarkMode } = useDarkMode();

    return (
        <>
            {/* Social Media and Contact Information */}
            <div className="bg-darkG w-full">
                <div className="flex flex-col sm:flex-row justify-between items-center p-2 space-y-2 sm:space-y-0">
                    {/* Social Media Icons */}
                    <div className="flex items-center space-x-4">
                        <img src="./image/youtube.png" className="w-6" alt="YouTube" />
                        <img src="./image/facebook.png" alt="Facebook" className="w-6" />
                        <img src="./image/instagram.png" alt="Instagram" className="w-6" />
                    </div>
                    {/* Contact Information */}
                    <div className="flex items-center space-x-2">
                        <span className="text-white">+94771987402</span>
                        <span className="text-white">sephoraflowers@gmail.com</span>
                        <button
                            onClick={toggleDarkMode}
                            className="bg-white text-black px-2 py-1 rounded"
                        >
                            {darkMode ? "Light Mode" : "Dark Mode"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation Bar */}
            <nav className="bg-white p-2 shadow-md w-full">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    {/* Logo */}
                    <div className="text-darkG text-3xl md:text-4xl font-bold text-center md:text-left">
                        Sephora Flowers
                    </div>

                    {/* Navigation Links */}
                    <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-10 mt-4 md:mt-0">
                        <a href="#home" className="text-black font-bold hover:text-lightG text-lg">HOME</a>
                        <a href="#about" className="text-black font-bold hover:text-lightG text-lg">FLOWERS</a>
                        <a href="#services" className="text-black font-bold hover:text-lightG text-lg">BOUQUET</a>
                        <a href="#contact" className="text-black font-bold hover:text-lightG text-lg">CONTACT</a>
                    </div>

                    {/* Login and Cart Icons */}
                    <div className="flex items-center space-x-4 mt-4 md:mt-0">
                        <img src="./image/login.png" className="w-8 md:w-10" alt="Login" />
                        <img src="./image/cart.png" className="w-8 md:w-10" alt="Cart" />
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Header;
