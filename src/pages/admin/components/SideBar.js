import React from "react";

const Sidebar = () => {


    return (
        
        <div className="bg-lightG p-3 ">
            <div className="inline-grid relative top-20">
                 <button className="text-2xl bg-darkG text-white font-bold py-2 text rounded-b-lg mt-10 w-72 rounded hover:bg-[#c9d5b0]">Dashboard</button>
                <button className="text-2xl bg-darkG text-white font-bold py-2 text rounded-b-lg mt-10 w-72 rounded hover:bg-[#c9d5b0]">Salary</button>
                <button className="text-2xl bg-darkG text-white font-bold py-2 text rounded-b-lg mt-10 w-72 rounded hover:bg-[#c9d5b0]">Inventory Stuff</button>
                <button className="text-2xl bg-darkG text-white font-bold py-2 text rounded-b-lg mt-10 w-72 rounded hover:bg-[#c9d5b0]">Logout</button>

            
            </div>
        </div>
    )
}

export default Sidebar; 