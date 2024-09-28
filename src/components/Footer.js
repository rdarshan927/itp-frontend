import React from "react";

const Footer = () => {
    return (
        <footer className="w-full py-4 bg-lightY">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                    <h1 className="text-4xl font-bold pl-2 text-darkG">Sephora Flowers</h1>
                </div>

                <div className="flex flex-col md:flex-row md:space-x-20 space-y-2 md:space-y-0 mb-4 md:mb-0">
                    <a href="#home" className="text-black hover:text-lightG text-[18px]">HOME</a>
                    <a href="#about" className="text-black hover:text-lightG text-[18px]">FLOWERS</a>
                    <a href="#services" className="text-black hover:text-lightG text-[18px]">BOUQUET</a>
                    <a href="#contact" className="text-black hover:text-lightG text-[18px]">CONTACT</a>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <div className="flex items-center space-x-2 pl-2">
                    <img src="./image/youtubeG.png" className="w-6" alt="YouTube" />
                    <img src="./image/facebookG.png" alt="Facebook" className="w-6" />
                    <img src="./image/instagramG.png" alt="Instagram" className="w-6" />
                </div>

                <div className="flex flex-col pl-2">
                    <span className="text-black">+94771987402</span>
                    <span className="text-black">sephoraflowers@gmail.com</span>
                </div>

                <div className="text-center md:text-left">
                    <h2 className="text-black text-[20px]">We accept</h2>
                    <div className="flex justify-center md:justify-start">
                        <img src="./image/visa.png" className="w-10 h-10 mr-2" alt="Visa" />
                        <img src="./image/amex.png" className="w-10 h-10 mr-2" alt="American Express" />
                        <img src="./image/mastercard.png" className="w-10 h-10 mr-2" alt="Mastercard" />
                    </div>
                </div>

                <div className="text-center md:text-left">
                    <h2 className="text-black text-base">Subscribe Us</h2>
                    <div className="flex justify-center md:justify-start">
                        <input type="text" placeholder="Enter Your Email" className="w-40 md:w-60 h-10 rounded-md pl-2 mr-2" />
                        <button className="bg-darkG text-white px-4 py-1 rounded-md">Subscribe</button>
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <p className="text-black text-center">
                    &copy; 2024. All Rights Reserved | Design by Group
                </p>
            </div>
        </footer>
    );
}

export default Footer;
 