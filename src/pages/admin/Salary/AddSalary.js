import React, { useState, useEffect } from 'react';
import { api } from "../../../config/api"; 

function AddSalary() {
    // State hooks for each input field and salary list
    const [salaryId, setSalaryId] = useState('');
    const [userId, setUserId] = useState('');
    const [baseSalary, setBaseSalary] = useState('');
    const [allowances, setAllowances] = useState('');
    const [epf, setEpf] = useState('');
    const [etf, setEtf] = useState('');
    const [otHours, setOtHours] = useState('10');
    const [totalSalary, setTotalSalary] = useState('');
    const [salaries, setSalaries] = useState([]); // Initialize salaries state

    // Calculate EPF, ETF, and Total Salary whenever baseSalary, allowances, or otHours change
    useEffect(() => {
        const parsedBaseSalary = parseFloat(baseSalary) || 0;
        const parsedAllowances = parseFloat(allowances) || 0;
        const parsedOtHours = parseFloat(otHours) || 0;

        // Calculating EPF, ETF, and OT pay
        const epfEmployer = (parsedBaseSalary * 0.15).toFixed(2);
        const epfEmployee = (parsedBaseSalary * 0.08).toFixed(2);
        const totalEpf = (parseFloat(epfEmployer) + parseFloat(epfEmployee)).toFixed(2);
        const etfValue = (parsedBaseSalary * 0.03).toFixed(2);
        const otPay = (parsedOtHours * 500).toFixed(2); // Assuming OT hours are paid 500 per hour

        // Calculate Total Salary
        const total = (
            parsedBaseSalary +
            parsedAllowances -
            parseFloat(epfEmployee) +
            parseFloat(otPay)
        ).toFixed(2);

        // Update state
        setEpf(totalEpf);
        setEtf(etfValue);
        setTotalSalary(total);

    }, [baseSalary, allowances, otHours]);

    // Handlers for each input field
    const handleSalaryIdChange = (event) => setSalaryId(event.target.value);
    const handleUserIdChange = (event) => setUserId(event.target.value);
    const handleBaseSalaryChange = (event) => setBaseSalary(event.target.value);
    const handleAllowancesChange = (event) => setAllowances(event.target.value);
    const handleOtHoursChange = (event) => setOtHours(event.target.value);

    const addSalary = async () => {
        if (salaryId && userId && baseSalary && allowances && epf && etf && totalSalary) {
            const salaryData = {
                salaryID: salaryId,
                userID: userId,
                basicSalary: baseSalary,
                allowance: allowances,
                epf,
                etf,
                totalSalary
            };

            try {
                await api.post('/api/employeesalary/create', salaryData); // Make API call
                alert('Salary added successfully!');

                // Clear input fields after successful submission
                setSalaryId('');
                setUserId('');
                setBaseSalary('');
                setAllowances('');
                setEpf('');
                setEtf('');
                setOtHours('10');
                setTotalSalary('');

            } catch (error) {
                console.error('Failed to add salary:', error);
                alert('Error adding salary.');
            }
        } else {
            alert('Please fill all the fields!');
        }
    };


    return (
        <>
            <div className="bg-darkG p-6">
                <h1 className="text-5xl font-bold text-white mb-6 text-center">Add Salary</h1>
                <form className='relative left-56'>
                    {/* Salary ID and User ID */}
                    <div className="flex mb-4">
                        <div className="w-1/3 pr-2">
                            <label htmlFor="salaryId" className="block text-2xl text-white font-bold mb-2">Salary ID:</label>
                            <input 
                                type="text" 
                                id="salaryId" 
                                className="w-full rounded-md px-3 py-2 bg-lightG text-white text-3xl" 
                                value={salaryId}
                                onChange={handleSalaryIdChange} 
                                required
                            />
                        </div>
                        <div className="w-1/3 pl-2">
                            <label htmlFor="userId" className="block text-2xl text-white font-bold mb-2">User ID:</label>
                            <input 
                                type="text" 
                                id="userId" 
                                className="w-full rounded-md px-3 py-2 bg-lightG text-white text-3xl" 
                                value={userId}
                                onChange={handleUserIdChange} 
                                required
                            />
                        </div>
                    </div>

                    {/* Base Salary and Allowances */}
                    <div className="flex mb-4">
                        <div className="w-1/3 pr-2">
                            <label htmlFor="baseSalary" className="block text-2xl text-white font-bold mb-2">Base Salary:</label>
                            <input 
                                type="text" 
                                id="baseSalary" 
                                className="w-full rounded-md px-3 py-2 bg-lightG text-white text-3xl" 
                                value={baseSalary}
                                onChange={handleBaseSalaryChange} 
                                required
                            />
                        </div>
                        <div className="w-1/3 pl-2">
                            <label htmlFor="allowances" className="block text-2xl text-white font-bold mb-2">Allowances:</label>
                            <input 
                                type="text" 
                                id="allowances" 
                                className="w-full rounded-md px-3 py-2 bg-lightG text-white text-3xl" 
                                value={allowances}
                                onChange={handleAllowancesChange} 
                                required
                            />
                        </div>
                    </div>

                    {/* EPF and ETF */}
                    <div className="flex mb-4">
                        <div className="w-1/3 pr-2">
                            <label htmlFor="epf" className="block text-2xl text-white font-bold mb-2">EPF:</label>
                            <input 
                                type="text" 
                                id="epf" 
                                className="w-full rounded-md px-3 py-2 bg-lightG text-white text-3xl" 
                                value={epf}
                                readOnly
                            />
                        </div>
                        <div className="w-1/3 pl-2">
                            <label htmlFor="etf" className="block text-2xl text-white font-bold mb-2">ETF:</label>
                            <input 
                                type="text" 
                                id="etf" 
                                className="w-full rounded-md px-3 py-2 bg-lightG text-white text-3xl" 
                                value={etf}
                                readOnly
                            />
                        </div>
                    </div>

                    {/* OT Hours */}
                    <div className="flex mb-4">
                        <div className="w-1/3 pr-2">
                            <label htmlFor="otHours" className="block text-2xl text-white font-bold mb-2">OT Hours:</label>
                            <input 
                                type="number" 
                                id="otHours" 
                                className="w-full rounded-md px-3 py-2 bg-lightG text-white text-3xl" 
                                value={otHours}
                                onChange={handleOtHoursChange} 
                                required
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="button" 
                        className="bg-lightG text-white font-bold py-2 px-12 rounded text-2xl mt-5 hover:bg-[#c9d5b0]"
                        onClick={addSalary}
                    >
                        Submit
                    </button>
                </form>
            </div>
        </>
    );
}

export default AddSalary;
