// src/components/OrderTable.js
import React, { useEffect, useState } from "react";

const order = () => {
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
        <div className="bg-[#BACD92] mt-10 p-6">
                <h2 className=" font-bold text-white mb-4 text-center text-5xl"> Orders</h2>
                <div className='flex items-center  w-11/12 mb-3'>
                    <div className='w-1/3 text-center text-xl font-bold text-white'>Product ID</div>
                    <div className='w-1/3 text-center text-xl font-bold text-white'>Product Name</div>
                    <div className='w-1/3 text-center text-xl font-bold text-white'>Order ID</div>
                    <div className='w-1/3 text-center text-xl font-bold  text-white'>Receiver <br />
                    <span className="block">Name</span></div>
                    <div className='w-1/3 text-center text-xl font-bold text-white'>Receiver <br />
                    <span className="block">Address</span></div>
                    <div className='w-1/3 text-center text-xl font-bold text-white'>Receiver <br />
                    <span className="block">Contact No</span></div>
                    <div className='w-1/3 text-center text-xl font-bold text-white'>Sender <br />
                    <span className="block">Email</span></div>
                   
                </div>
                <ul>
                    {/* {salaries.map((salary, index) => ( */}
                        <li className="flex items-center justify-between mb-4 p-4 bg-[#75A47F] border border-[#BACD92] rounded-md">
                            <div className="flex-1 text-white flex items-center">
                                <div className="w-1/4 px-2 text-center text-2xl"> </div>
                                <div className="w-1/4 px-2 text-center text-2xl"> </div>
                                <div className="w-1/4 px-2 text-center text-2xl"> </div>
                                <div className="w-1/4 px-2 text-center text-2xl"> </div>
                                <div className="w-1/4 px-2 text-center text-2xl"> </div>
                                <div className="w-1/4 px-2 text-center text-2xl"> </div>
                               
                            </div>
                            
                        </li>
                    {/* ))} */}
                </ul>
            </div>
    );
}

export default order;

