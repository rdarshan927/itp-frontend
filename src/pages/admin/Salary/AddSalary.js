import React, { useState, useEffect } from 'react';
import { api } from "../../../config/api";
import { toast, Toaster } from 'react-hot-toast';

function AddSalary() {
    const [salaryId, setSalaryId] = useState('');
    const [userId, setUserId] = useState('');
    const [baseSalary, setBaseSalary] = useState('');
    const [allowances, setAllowances] = useState('');
    const [epf, setEpf] = useState('');
    const [etf, setEtf] = useState('');
    const [totalSalary, setTotalSalary] = useState('');
    const [errors, setErrors] = useState({});
    const otHours = 10;

    useEffect(() => {
        const parsedBaseSalary = parseFloat(baseSalary) || 0;
        const parsedAllowances = parseFloat(allowances) || 0;
        const epfEmployer = (parsedBaseSalary * 0.15).toFixed(2);
        const epfEmployee = (parsedBaseSalary * 0.08).toFixed(2);
        const totalEpf = (parseFloat(epfEmployer) + parseFloat(epfEmployee)).toFixed(2);
        const etfValue = (parsedBaseSalary * 0.03).toFixed(2);
        const otPay = (otHours * 500).toFixed(2);

        const total = (
            parsedBaseSalary +
            parsedAllowances -
            parseFloat(epfEmployee) +
            parseFloat(otPay)
        ).toFixed(2);

        setEpf(totalEpf);
        setEtf(etfValue);
        setTotalSalary(total);
    }, [baseSalary, allowances]);


    // Handle input changes
    const handleSalaryIdChange = (event) => setSalaryId(event.target.value);
    const handleUserIdChange = (event) => setUserId(event.target.value);
    const handleBaseSalaryChange = (event) => setBaseSalary(event.target.value);
    const handleAllowancesChange = (event) => setAllowances(event.target.value);

    // Validate inputs
    const validateInputs = () => {
        const validationErrors = {};

        const salaryIdPattern = /^[A-Za-z]{2}\d{3}$/; //Example: AB123
        const userIdPattern = /^[A-Za-z]{2}\d{4}$/; //Example: AB1234
        const salaryPattern = /^\d+(\.\d{1,2})?$/; //only numbers with 2 decimal places
        const allowancesPattern = /^\d+(\.\d{1,2})?$/; //only numbers with 2 decimal places

        // validate salaryId
        if (!salaryId.match(salaryIdPattern)) {
            validationErrors.salaryId = 'Salary ID must be in the format AB123.';
        }

        // validate userId
        if (!userId.match(userIdPattern)) {
            validationErrors.userId = 'User ID must be in the format AB1234.';
        }

        // validate baseSalary
        if (!baseSalary.match(salaryPattern)) {
            validationErrors.baseSalary = 'Base salary must be a valid number.';
        }

        // validate allowances
        if (!allowances.match(allowancesPattern)) {
            validationErrors.allowances = 'Allowances must be a valid number.';
        }

        return validationErrors;
    };

    // Add salary
    const addSalary = async () => {
        const validationErrors = validateInputs();
        setErrors(validationErrors);

        // check if there are any validation error in the form
        if (Object.keys(validationErrors).length > 0) {
            for (const error in validationErrors) {
                toast.error(validationErrors[error]);
            }
            return;
        }

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
            await api.post('/api/employeesalary/create', salaryData);
            toast.success('Salary added successfully!');

            // clear the form after adding the salary record
            setSalaryId('');
            setUserId('');
            setBaseSalary('');
            setAllowances('');
            setEpf('');
            setEtf('');
            setTotalSalary('');

        } catch (error) {
            console.error('Failed to add salary:', error);
            toast.error('Error adding salary. Please try again.');
        }
    };

    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />
            <div className="bg-darkG p-6 dark:bg-cTwo">
                <h1 className="text-5xl font-bold text-white mb-6 text-center">Add Salary</h1>
                <form className='relative left-40'>
                    <div className="flex mb-4">
                        <div className="w-1/3 pr-2 mr-20">
                            <label htmlFor="salaryId" className="block text-2xl text-white font-bold mb-2">Salary ID:</label>
                            <input 
                                type="text" 
                                id="salaryId" 
                                className="w-full rounded-md px-3 py-2 bg-lightG text-white text-2xl dark:bg-bOne" 
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
                                className="w-full rounded-md px-3 py-2 bg-lightG text-white text-2xl dark:bg-bOne" 
                                value={userId}
                                onChange={handleUserIdChange} 
                                required
                            />
                            
                        </div>
                    </div>

                    <div className="flex mb-4">
                        <div className="w-1/3 pr-2 mr-20">
                            <label htmlFor="baseSalary" className="block text-2xl text-white font-bold mb-2">Base Salary:</label>
                            <input 
                                type="text" 
                                id="baseSalary" 
                                className="w-full rounded-md px-3 py-2 bg-lightG text-white text-2xl dark:bg-bOne" 
                                value={baseSalary}
                                onChange={handleBaseSalaryChange} 
                                required
                            />
                            {errors.baseSalary && <span className="text-red-500">{errors.baseSalary}</span>}
                        </div>
                        <div className="w-1/3 pl-2">
                            <label htmlFor="allowances" className="block text-2xl text-white font-bold mb-2">Allowances:</label>
                            <input 
                                type="text" 
                                id="allowances" 
                                className="w-full rounded-md px-3 py-2 bg-lightG text-white text-2xl dark:bg-bOne" 
                                value={allowances}
                                onChange={handleAllowancesChange} 
                                required
                            />
                            {errors.allowances && <span className="text-red-500">{errors.allowances}</span>}
                        </div>
                    </div>

                    <div className="flex mb-4">
                        <div className="w-1/3 pr-2 mr-20">
                            <label htmlFor="epf" className="block text-2xl text-white font-bold mb-2">EPF:</label>
                            <input 
                                type="text" 
                                id="epf" 
                                className="w-full rounded-md px-3 py-2 bg-lightG text-white text-2xl dark:bg-bOne" 
                                value={epf}
                                readOnly
                            />
                        </div>
                        <div className="w-1/3 pl-2">
                            <label htmlFor="etf" className="block text-2xl text-white font-bold mb-2">ETF:</label>
                            <input 
                                type="text" 
                                id="etf" 
                                className="w-full rounded-md px-3 py-2 bg-lightG text-white text-2xl dark:bg-bOne" 
                                value={etf}
                                readOnly
                            />
                        </div>
                    </div>

                    <button 
                        type="button" 
                        className="bg-lightG text-white font-bold py-2 px-12 rounded text-2xl mt-5 hover:bg-[#c9d5b0] dark:bg-bOne"
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
