import React, { useEffect, useState } from "react";
import { api } from "../../../config/api";


function AddPlantSchedule() {
    const [scheduleID, setScheduleID] = useState('');
    const [plantName, setPlantName] = useState('');
    const [field, setField] = useState('A101'); // Default field is A101
    const [resources, setResources] = useState('');
    const [weatherCondition, setWeatherCondition] = useState('');
    const [plantSchedules, setPlantSchedules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [plantNameError, setPlantNameError] = useState(''); // Validation error state for plant name
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchPlantSchedules();
    }, []);

    const fetchPlantSchedules = async () => {
        try {
            const response = await api.get('/plantSchedules');
            setPlantSchedules(response.data);
        } catch (error) {
            console.error('Error fetching plant schedules:', error);
        }
    };

    const handleAddPlantSchedule = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setPlantNameError('');




        // Validate Plant Name (must be a string, no numbers)
        const plantNameRegex = /^[a-zA-Z\s\-]*$/;
        if (!plantNameRegex.test(plantName)) {
            setPlantNameError('Plant Name must only contain letters.');
            setLoading(false);
            return; // Stop submission if validation fails
        }

        //validate all Fields
        if (!scheduleID || !plantName || !resources || !weatherCondition) {
            setError('All fields are required.');
            setLoading(false);
            return;
        }

        const PlantScheduleData = {
            ScheduleID: scheduleID, 
            PlantName: plantName, 
            Field: field,
            Resources: resources, 
            WeatherCondition: weatherCondition, 
        };

        console.log("Plant Schedule Data:", PlantScheduleData);

        try {
            const response = await api.post('/plantSchedules', PlantScheduleData);
            console.log(response.data);

            // Optimistic update
            // setPlantSchedules((prev) => [...prev, { ...PlantScheduleData, ...response.data }]);

            // Success feedback
            
            setSuccessMessage('Schedule added successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);

            // Clear input fields
            clearFields();
        } catch (error) {
            console.error('There was an error!', error);
            setError('Failed to add plant schedule. Please try again.');
        } finally {
            setLoading(false);
        }
    };

            

    const clearFields = () => {
        setScheduleID('');
        setPlantName('');
        setField('A101');
        setResources('');
        setWeatherCondition('');
    };

    return (
        <>
            <div className="bg-darkG p-6">
                <h1 className="text-5xl font-bold text-black mb-6 text-center">Add Plant Schedule</h1>
                <form className="relative left-56" onSubmit={handleAddPlantSchedule}>
                    <div className="flex mb-4">
                        <div className="w-1/3 pr-2">
                            <label htmlFor="scheduleID" className="block text-2xl text-black font-bold mb-2">Schedule ID:</label>
                            <input
                                type="text"
                                id="scheduleID"
                                className="w-full rounded-md px-3 py-2 bg-lightG text-black text-3xl"
                                value={scheduleID}
                                onChange={(e) => setScheduleID(e.target.value)}
                                required
                            />
                        </div>
                        <div className="w-1/3 pl-2">
                            <label htmlFor="plantName" className="block text-2xl text-black font-bold mb-2">Plant Name:</label>
                            <input
                                type="text"
                                id="plantName"
                                className="w-full rounded-md px-3 py-2 bg-lightG text-black text-3xl"
                                value={plantName}
                                onChange={(e) => setPlantName(e.target.value)}
                                required
                            />
                            {plantNameError && <p className="text-red-500">{plantNameError}</p>} {/* Display validation error */}
                        </div>
                    </div>

                    <div className="flex mb-4">
                        <div className="w-1/3 pr-2">
                            <label htmlFor="field" className="block text-2xl text-black font-bold mb-2">Field:</label>
                            <select
                                id="field"
                                className="w-full rounded-md px-3 py-2 bg-lightG text-black text-3xl"
                                value={field}
                                onChange={(e) => setField(e.target.value)}
                            >
                                <option value="A101">A101</option>
                                <option value="A102">A102</option>
                                <option value="A103">A103</option>
                                <option value="A104">A104</option>
                                <option value="A105">A105</option>
                            </select>
                        </div>
                        <div className="w-1/3 pl-2">
                            <label htmlFor="resources" className="block text-2xl text-black font-bold mb-2">Resources:</label>
                            <input
                                type="text"
                                id="resources"
                                className="w-full rounded-md px-3 py-2 bg-lightG text-black text-3xl"
                                value={resources}
                                onChange={(e) => setResources(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="weatherCondition" className="block text-2xl  font-bold mb-2">Weather Condition:</label>
                        <input
                            type="text"
                            id="weatherCondition"
                            className="rounded-md px-3 py-2 bg-lightG text-black text-3xl"
                            value={weatherCondition}
                            onChange={(e) => setWeatherCondition(e.target.value)}
                            required
                        />
                    </div>

                    
                    {error && <p className="text-red-500">{error}</p>} {/* Display error message */}

                    <button
                        type="submit"
                        className="bg-lightG text-black font-bold py-2 px-12 rounded text-2xl mt-5 hover:bg-[#c9d5b0]"
                        disabled={loading}
                    >
                        {loading ? "Adding..." : "ADD"}
                    </button>
                </form>
            </div>
        </>
    );
}

export default AddPlantSchedule;
