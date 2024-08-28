import React, { useEffect, useState } from "react";
import Search from "./Search";  


const ViewSalary = () => {
    const [salaryId, setSalaryId] = useState('');
    const [userId, setUserId] = useState('');
    const [baseSalary, setBaseSalary] = useState('');
    const [allowances, setAllowances] = useState('');
    const [epf, setEpf] = useState('');
    const [etf, setEtf] = useState('');
    const [otHours, setOtHours] = useState('10');
    const [totalSalary, setTotalSalary] = useState('');
    const [salaries, setSalaries] = useState([]);

    useEffect(() => {
        const epfValue = (baseSalary * 0.15).toFixed(2);
        const etfValue = (baseSalary * 0.03).toFixed(2);
        const otPay = (otHours * 500).toFixed(2); // OT pay at 500 LKR per hour
        const total = (
            parseFloat(baseSalary) +
            parseFloat(allowances) +
            parseFloat(epfValue) +
            parseFloat(etfValue) +
            parseFloat(otPay)
        ).toFixed(2);

        setEpf(epfValue);
        setEtf(etfValue);
        setTotalSalary(total);
    }, [otHours]);
    
    function handleEdit(index) {
        const salary = salaries[index];
        setSalaryId(salary.salaryId);
        setUserId(salary.userId);
        setBaseSalary(salary.baseSalary);
        setAllowances(salary.allowances);
        setEpf(salary.epf);
        setEtf(salary.etf);
        setOtHours(salary.otHours);
        setTotalSalary(salary.totalSalary);
        removeSalary(index);
    }

    function removeSalary(indexToRemove) {
        setSalaries(salaries.filter((_, index) => index !== indexToRemove));
    }

    return (
        
        <div className="bg-[#BACD92] mt-5 p-3">
                    <Search />
                    <h2 className=" font-bold text-white mb-4 text-center text-5xl ">Salary Entries</h2>
                <div className='flex items-center  w-11/12 mb-3'>
                    <div className='w-1/3 text-center text-xl font-bold text-white'>Salary ID</div>
                    <div className='w-1/3 text-center text-xl font-bold  text-white'>User ID</div>
                    <div className='w-1/3 text-center text-xl font-bold text-white'>OT Hours</div>
                    <div className='w-1/3 text-center text-xl font-bold text-white'>Total Salary</div>
                </div>
                <ul>
                    {/* {salaries.map((salary, index) => ( */}
                        <li  className="flex items-center justify-between mb-4 p-4 bg-[#75A47F] border border-[#BACD92] rounded-md">
                            <div className="flex-1 text-white flex items-center">
                                <div className="w-1/4 px-2 text-center text-2xl"> 001</div>
                                <div className="w-1/4 px-2 text-center text-2xl"> IT121</div>
                                <div className="w-1/4 px-2 text-center text-2xl"> 20.4h</div>
                                <div className="w-1/4 px-2 text-center text-2xl"> Rs.570000</div>
                            </div>
                            <div className="flex space-x-2">
                                <button 
                                    className="bg-yellow-400 text-white text-sm px-3 py-1 rounded hover:bg-yellow-500"
                                    // onClick={() => handleEdit(index)}
                                >
                                    Edit
                                </button>
                                <button 
                                    className="bg-red-400 text-white text-sm px-3 py-1 rounded hover:bg-red-500"
                                    // onClick={() => removeSalary(index)}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    {/* ))} */}
                </ul>
            </div>
    );
}

export default ViewSalary;