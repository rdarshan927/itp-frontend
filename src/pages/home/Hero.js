import React from "react";

const Hero = () => {
    const storedEmail = localStorage.getItem('useremail');


    return (
        <div className="text-center w-screen text-red-600 dark:text-green-400">
           <p className="text-center"> hi </p> Hello World!
           <br />
           <button className="primary-btn">client 1</button>
           <button className="secondary-btn">client 2</button>
           <button className="adminprime-btn"><a href="manageemprole">admin 2</a></button>
           {storedEmail}
        </div>
    )
}

export default Hero;