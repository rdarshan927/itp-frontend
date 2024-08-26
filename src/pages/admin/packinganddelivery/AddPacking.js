import React, { useEffect, useState } from "react";


function addpacking() {
    // State hooks for each input field and salary list
    // const [salaryId, setSalaryId] = useState('');
    // const [userId, setUserId] = useState('');
    // const [baseSalary, setBaseSalary] = useState('');
    // const [allowances, setAllowances] = useState('');
    // const [epf, setEpf] = useState('');
    // const [etf, setEtf] = useState('');
    // const [otHours, setOtHours] = useState('10');
    // const [totalSalary, setTotalSalary] = useState('');
    // const [salaries, setSalaries] = useState([]);

    return (
        <>
            <div className="bg-darkG p-6">
                <h1 className="text-5xl font-bold text-white mb-6 text-center">Add Packing Details</h1>
                <form className='relative left-56'>
                    
                    <div className="flex mb-4">
                        <div className="w-1/3 pr-2">
                            <label htmlFor="salaryId" className="block text-2xl text-white font-bold mb-2">Order ID:</label>
                            <input 
                                type="text" 
                                id="salaryId" 
                                className="w-full rounded-md px-3 py-2 bg-lightG text-white text-3xl" 
                                // value=""
                                // onChange={handleSalaryIdChange} 
                                required
                            />
                        </div>
                        <div className="w-1/3 pl-2">
                            <label htmlFor="userId" className="block text-2xl text-white font-bold mb-2">Receiver Contact No:</label>
                            <input 
                                type="text" 
                                id="userId" 
                                className="w-full rounded-md px-3 py-2 bg-lightG text-white text-3xl" 
                                // value=""
                                // onChange={handleUserIdChange} 
                                required
                            />
                        </div>
                    </div>

                    {/* Flex container to align Base Salary and Allowances side by side */}
                    <div className="flex mb-4">
                        <div className="w-1/3 pr-2">
                            <label htmlFor="baseSalary" className="block text-2xl text-white font-bold mb-2">Receiver Name:</label>
                            <input 
                                type="text" 
                                id="baseSalary" 
                                className="w-full rounded-md px-3 py-2 bg-lightG text-white text-3xl" 
                                // value={baseSalary}
                                // onChange={handleBaseSalaryChange} 
                                required
                            />
                        </div>
                        <div className="w-1/3 pl-2">
                            <label htmlFor="allowances" className="block text-2xl text-white font-bold mb-2">Sender Email:</label>
                            <input 
                                type="text" 
                                id="allowances" 
                                className="w-full rounded-md px-3 py-2 bg-lightG text-white text-3xl" 
                                // value={allowances}
                                // onChange={handleAllowancesChange} 
                                required
                            />
                        </div>
                    </div>

                    {/* Flex container to align EPF and ETF side by side */}
                    <div className="flex mb-4">
                        <div className="w-1/3 pr-2">
                            <label htmlFor="epf" className="block text-2xl text-white font-bold mb-2">Receiver Address:</label>
                            <input 
                                type="text" 
                                id="epf" 
                                className="w-full rounded-md px-3 py-2 bg-lightG text-white text-3xl" 
                                // value={epf}
                                readOnly
                            />
                        </div>
                        <div className="w-1/3 pl-2">
                            <label htmlFor="etf" className="block text-2xl text-white font-bold mb-2">Packing Date:</label>
                            <input 
                                type="text" 
                                id="etf" 
                                className="w-full rounded-md px-3 py-2 bg-lightG text-white text-3xl" 
                                // value={etf}
                                readOnly
                            />
                        </div>
                    </div>

                    <button 
                        type="button" 
                        className="bg-lightG text-white font-bold py-2 px-12 rounded text-2xl mt-5 hover:bg-[#c9d5b0] "
                        onClick={addpacking}
                    >
                        ADD
                    </button>
                </form>
            </div>

            
        </>
    );

}
export default addpacking;
