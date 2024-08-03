import { React, useState } from 'react';
import { api, weatherapi } from '../../config/api'

const ManageEmployeeRole = () => {
    const [roleID, setRoleID] = useState('');
    const [roleName, setRoleName] = useState('');
    const [basicSalary, setBasicSalary] = useState('');
    const [success, setSuccess] = useState('');
    const [weatherData, setWeatherData] = useState(null);

    const handleSubmit = async (e) =>{
        e.preventDefault();

        const roleData = {
            roleID: roleID,
            roleName: roleName,
            basicSalary: basicSalary
        }

        try {
            const response = await api.post('/api/createrole/', roleData);

            if(response.status === 201){
                setRoleID('');
                setRoleName('');
                setBasicSalary('');
                setSuccess('Role has been added succesfully!');
            }
        } catch(err){
            console.log(err)
            setSuccess('there was an error while adding role!');
        }
    }

    const handleWeatherRequest = async () => {
        try {
            const response = await weatherapi.get('/current.json', {
                params: { q: 'London' }
            });
            setWeatherData(response.data);
        } catch (error) {
            console.error('Error fetching weather data', error);
        }
    };

    return (
        <div className='text-center h-screen mt-5'>
            <div className='justify-center'>
                <form onSubmit={handleSubmit}>
                    <div>
                        <input 
                            type='text'
                            id='roleID'
                            name='roleID'
                            value={roleID}
                            onChange = { (e) => setRoleID(e.target.value) }
                            placeholder='Enter Role ID'
                            className=''
                        />
                    </div>

                    <div>
                        <input
                            type='text'
                            id='roleName'
                            name='roleName'
                            value={roleName}
                            onChange={ (e) => setRoleName(e.target.value) }
                            placeholder='Enter Role Name'
                            className=''
                        />
                    </div>

                    <div>
                        <input 
                            type='text'
                            id='basicSalary'
                            name='basicSalary'
                            value={basicSalary}
                            onChange={ (e) => setBasicSalary(e.target.value)}
                            placeholder='Enter the Basic Salary'
                            className=''
                        />
                    </div>

                    <div>
                        <button type='submit' className='bg-black text-white'> Submit </button>
                    </div>
                    {success && <p className="text-red-500 mb-4">{success}</p>}
                </form>
            </div>

            <button onClick={handleWeatherRequest}>Get Weather</button>
            {weatherData && <div>{JSON.stringify(weatherData)}</div>}

             {weatherData && (
                <div>
                    <h2>Weather Data for {weatherData.location.name}</h2>
                    <p>Temperature: {weatherData.current.temp_c} °C</p>
                    <p>Condition: {weatherData.current.condition.text}</p>
                    <p>Pressure: {weatherData.current.pressure_mb} mb</p>
                </div>
            )}
        </div>
    )
}

export default ManageEmployeeRole