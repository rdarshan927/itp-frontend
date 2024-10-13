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
    const [weatherConditionError, setWeatherConditionError] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    // Flowering durations stored directly in frontend
    const floweringDurations = {
        "Rose": 60, // 60 days for blooming
        "Lily": 21, // 21 days for blooming
        "Tulips": 112, // 112 days for blooming
        "Sunflower": 20, // 20 days for blooming
    };

    const handlePlantNameBlur = (e) => {
        setTimeout(() => {
            setSuggestions([]); // Delay clearing to allow suggestion click event to fire
        }, 200);  // This timeout ensures that the click event gets registered before the suggestions are cleared
    };
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
        setWeatherConditionError('');

        // Validate all fields
        if (!scheduleID || !plantName || !resources || !weatherCondition) {
            setError('All fields are required.');
            setLoading(false);
            return;
        }

        // Validate Plant Name (must be a string, no numbers)
        const plantNameRegex = /^[a-zA-Z\s\-]*$/;
        if (!plantNameRegex.test(plantName)) {
            setPlantNameError('Plant Name must only contain letters.');
            setLoading(false);
            return; // Stop submission if validation fails
        }

        // Validate weather condition
        const weatherConditionRegex = /^[a-zA-Z\s\-]*$/;
        if (!weatherConditionRegex.test(weatherCondition)) {
            setWeatherConditionError('Weather Condition must only contain letters.');
            setLoading(false);
            return; // Stop submission if validation fails
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

    const handlePlantNameChange = (e) => {
        const value = e.target.value;
        const plantNameRegex = /^[a-zA-Z\s\-]*$/;

        setPlantName(value);

        // Validate Plant Name (must be a string, no numbers)
        if (!plantNameRegex.test(value)) {
            setPlantNameError('Plant Name must only contain letters.');
        } else {
            setPlantNameError(''); // Clear the error if the input is valid

            // Filter suggestions based on the plant name entered
            const filteredSuggestions = Object.keys(floweringDurations).filter(plant => 
                plant.toLowerCase().startsWith(value.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setPlantName(suggestion);  // Set plant name to the selected suggestion
        setSuggestions([]);  // Clear suggestions after selection
    };

    const handleWeatherConditionChange = (e) => {
        const value = e.target.value;
        const weatherConditionRegex = /^[a-zA-Z\s\-]*$/; 
        setWeatherCondition(value);

        // Validate Weather Condition
        if (!weatherConditionRegex.test(value)) {
            setWeatherConditionError('Weather Condition must only contain letters.');
        } else {
            setWeatherConditionError(''); // Clear the error if the input is valid
        }
    };

    const handleFieldChange = (e) => {
        setField(e.target.value);
        setSuggestions([]); // Clear suggestions when field changes
    };

    const clearFields = () => {
        setScheduleID('');
        setPlantName('');
        setField('A101');
        setResources('');
        setWeatherCondition('');
        setPlantNameError(''); 
        setWeatherConditionError('');
        setSuggestions([]);
    };

    return (
        <>
            <div className="bg-darkG p-6 dark:bg-cTwo">
                <h1 className="text-5xl font-bold text-black mb-6 text-center dark:text-white">Add Plant Schedule</h1>
                <form className="relative left-56" onSubmit={handleAddPlantSchedule}>
                    <div className="flex mb-4">
                        <div className="w-1/3 pr-2">
                            <label htmlFor="scheduleID" className="block text-2xl text-black font-bold mb-2 dark:text-white">Schedule ID:</label>
                            <input
                                type="text"
                                id="scheduleID"
                                className="w-full rounded-md px-3 py-2 bg-lightG text-black text-3xl dark:bg-bOne"
                                value={scheduleID}
                                onChange={(e) => setScheduleID(e.target.value)}
                                required
                            />
                        </div> 
                        <div className="w-1/3 pl-2">
                            <label htmlFor="plantName" className="block text-2xl text-black font-bold mb-2 dark:text-white">Plant Name:</label>
                            <input
                                type="text"
                                id="plantName"
                                className="w-full rounded-md px-3 py-2 bg-lightG text-black text-3xl dark:bg-bOne"
                                value={plantName}
                                onChange={handlePlantNameChange}
                                onBlur={handlePlantNameBlur}
                                required
                            />
                            {plantNameError && <p className="text-red-500">{plantNameError}</p>} {/* Display validation error */}
                            {suggestions.length > 0 && (
                                <ul className="bg-white border rounded shadow-md mt-2 dark:text-black">
                                    {suggestions.map((suggestion, index) => (
                                        <li 
                                            key={index} 
                                            onClick={() => handleSuggestionClick(suggestion)}
                                            className="cursor-pointer p-2 hover:bg-gray-200"
                                        >
                                            {suggestion}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    <div className="flex mb-4">
                        <div className="w-1/3 pr-2">
                            <label htmlFor="field" className="block text-2xl text-black font-bold mb-2 dark:text-white">Field:</label>
                            <select
                                id="field"
                                className="w-full rounded-md px-3 py-2 bg-lightG text-black text-3xl dark:bg-bOne"
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
                            <label htmlFor="resources" className="block text-2xl text-black font-bold mb-2 dark:text-white">Resources:</label>
                            <input
                                type="text"
                                id="resources"
                                className="w-full rounded-md px-3 py-2 bg-lightG text-black text-3xl dark:bg-bOne"
                                value={resources}
                                onChange={(e) => setResources(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="weatherCondition" className="block text-2xl  font-bold mb-2 dark:text-white">Weather Condition:</label>
                        <input
                            type="text"
                            id="weatherCondition"
                            className="rounded-md px-3 py-2 bg-lightG text-black text-3xl dark:bg-bOne"
                            value={weatherCondition}
                            onChange= {handleWeatherConditionChange}
                            required
                        />
                        {weatherConditionError && <p className="text-red-500">{weatherConditionError}</p>} {/* Display validation error */}
                    </div>
                    
                    {error && <p className="text-red-500">{error}</p>} {/* Display error message */}

                    <button
                        type="submit"
                        className="bg-lightG text-black font-bold py-2 px-6 rounded-lg text-3xl hover:bg-hoverG dark:bg-bOne dark:text-white"
                        disabled={loading}
                    >
                        {loading ? 'Adding...' : 'Add'}
                    </button>

                    {successMessage && <p className="text-green-500 mt-4 dark:text-white">{successMessage}</p>}
                </form>
            </div>
        </>
    );
}

export default AddPlantSchedule;
