import React from "react";

const Sidebar = () => {


    return (
        <div className="bg-lightG p-3 ">
            <div className="inline-grid relative top-48">
                <button className="text-2xl bg-darkG text-white font-bold py-2 text rounded-b-lg mt-10 w-72 rounded hover:bg-[#c9d5b0]">HarvestAdd</button>
                <button className="text-2xl bg-darkG text-white font-bold py-2 text rounded-b-lg mt-10 w-72 rounded hover:bg-[#c9d5b0]">Report</button>

            
            </div>

            <div className="relative top-96">
            <button className="text-2xl bg-darkG text-white font-bold py-2 text rounded-b-lg mt-10 w-72 rounded hover:bg-[#c9d5b0]">Logout</button>

            </div>
        </div>
    )
}

export default Sidebar; 