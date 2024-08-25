import React from "react";

const Hero = () => {

    return (
        <div className="relative">
            <div className="md:h-[600px] bg-darkG mm:grid grid-cols-1 mm:grid-cols-2 gap-4">
                <div className="lg:mx-28 xlg:mx-40 mm:mx-20 transition-colors duration-300 order-1 flex flex-col justify-center text-center pt-10 mm:text-left">
                    <p className="mm:text-3xl md:text-3xl text-2xl font-medium">Fresh Flowers</p>
                    <p className="mm:text-6xl md:text-5xl text-4xl font-semibold leading-tight">Find your own <br />Happiness</p>
                    <div className="my-8 mm:flex space-y-4 mm:space-y-0 mm:space-x-4 justify-center mm:justify-start items-center text-clientWhite font-semibold">
                        <a href='/'><button className="bg-lightG px-6 py-3 w-[150px] h-[50px] mx-2 rounded-2xl">FLOWERS</button></a>
                        <a href='/'><button className="bg-lightG px-6 py-3 w-[150px] h-[50px] mx-2 rounded-2xl">BOUQUET</button></a>
                    </div>
                </div>

                <div className="order-2 flex justify-center mm:h-[650px] md:h-[350px] h-[300px] z-10">
                    <img src="./Images/hero/hero.png" className="object-cover" alt="Flowers" />
                </div>
            </div>
            
            <div className="bg-white dark:bg-[#292828] flex mm:h-36 md:h-28 w-[90%] mx-[5%] justify-around items-center transition-colors duration-300 absolute bottom-0 transform translate-y-1/2 md:space-x-2 flex-wrap rounded-xl z-20">
                <div className="text-center flex-1 min-w-[80px]">
                    <img src="./Images/hero/free-shipping.png" alt="Free Shipping" className="md:h-16 sm:h-14 xs:h-8 h-8 mx-auto" />
                    <span className="mm:text-xl md:text-lg sm:text-base text-xs">Free Shipping</span>
                </div>
                <div className="text-center flex-1 min-w-[80px]">
                    <img src="./Images/hero/secure-payment.png" alt="Secure Payment" className="md:h-16 sm:h-14 xs:h-8 h-8 mx-auto" />
                    <span className="mm:text-xl md:text-lg sm:text-base text-xs">Payment</span>
                </div>
                <div className="text-center flex-1 min-w-[80px]">
                    <img src="./Images/hero/fresh.png" alt="Fresh Flowers" className="md:h-16 sm:h-14 xs:h-8 h-7 xs:mt-0 mt-1 mx-auto" />
                    <span className="mm:text-xl md:text-lg sm:text-base text-xs">Flowers</span>
                </div>
                <div className="text-center flex-1 min-w-[80px]">
                    <img src="./Images/hero/gift.png" alt="Offer and Gift" className="md:h-16 sm:h-14 xs:h-8 h-7 xs:mt-0 mt-1 mx-auto" />
                    <span className="mm:text-xl md:text-lg sm:text-base text-xs">Offers</span>
                </div>
            </div>
        </div>
    )
}

export default Hero;