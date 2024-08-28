import React, { useState, useEffect } from 'react';

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
        const epfValue = (baseSalary * 0.15).toFixed(2);
        const etfValue = (baseSalary * 0.03).toFixed(2);
        const otPay = (otHours * 500).toFixed(2);
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
        
    }, [baseSalary, allowances]);

    // Handlers for each input field
    function handleSalaryIdChange(event) {
        setSalaryId(event.target.value);
    }

    function handleUserIdChange(event) {
        setUserId(event.target.value);
    }

    function handleBaseSalaryChange(event) {
        setBaseSalary(event.target.value);
    }

    function handleAllowancesChange(event) {
        setAllowances(event.target.value);
    }
    

    // Function to handle the submit button click
    function addSalary() {
        if (salaryId && userId && baseSalary && allowances && epf && etf && totalSalary) {
            const salaryData = {
                salaryId,
                userId,
                baseSalary,
                allowances,
                epf,
                etf,
                otHours, // OT Hours will be included in salary data
                totalSalary
            };

            setSalaries([...salaries, salaryData]);

            // Clear input fields after submission
            setSalaryId('');
            setUserId('');
            setBaseSalary('');
            setAllowances('');
            setEpf('');
            setEtf('');
            setTotalSalary('');
        }
    }


    return (
        <>
            <div className="bg-darkG p-6">
                <h1 className="text-5xl font-bold text-white mb-6 text-center">Add Salary</h1>
                <form className='relative left-56'>
                    
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

                    {/* Flex container to align Base Salary and Allowances side by side */}
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

                    {/* Flex container to align EPF and ETF side by side */}
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

                    <button 
                        type="button" 
                        className="bg-lightG text-white font-bold py-2 px-12 rounded text-2xl mt-5 hover:bg-[#c9d5b0] "
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
