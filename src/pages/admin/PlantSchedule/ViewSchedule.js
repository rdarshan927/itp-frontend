import React, { useEffect, useState } from "react";
import { api } from "../../../config/api";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";


const ViewPlantSchedule = () => {
  const [plantSchedules, setPlantSchedules] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  

  const [formData, setFormData] = useState({
    ScheduleID: '',
    PlantName: '',
    Field: '',
    Resources: '',
    WeatherCondition: '',
    PlantedDate: '',
    ExpectedBloomingDate: ''
  });

  useEffect(() => {
    fetchPlantSchedules();
  }, []);

  const fetchPlantSchedules = async () => {
    try {
      const response = await api.get('/plantSchedules');
      if (Array.isArray(response.data.plantSchedules)) {
        setPlantSchedules(response.data.plantSchedules);
      } else {
        setPlantSchedules([]);
      }
    } catch (error) {
      console.error('Error fetching plant schedules:', error);
    }
  };

  const handleEditClick = (schedule, index) => {
    setIsEditing(true);
    setEditIndex(index);
    setFormData({
      ScheduleID: schedule.ScheduleID,
      PlantName: schedule.PlantName,
      Field: schedule.Field,
      Resources: schedule.Resources,
      WeatherCondition: schedule.WeatherCondition,
      PlantedDate: new Date(schedule.PlantedDate).toISOString().split('T')[0],
      ExpectedBloomingDate: new Date(schedule.ExpectedBloomingDate).toISOString().split('T')[0]
    });
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async () => {
    try {
      const updatedSchedule = {
        ScheduleID: formData.ScheduleID,
        PlantName: formData.PlantName,
        Field: formData.Field,
        Resources: formData.Resources,
        WeatherCondition: formData.WeatherCondition,
        PlantedDate: formData.PlantedDate,
        ExpectedBloomingDate: formData.ExpectedBloomingDate
      };

      const response = await api.put(`/plantSchedules/${plantSchedules[editIndex]._id}`, updatedSchedule);
      const updatedSchedules = [...plantSchedules];
      updatedSchedules[editIndex] = response.data.plantSchedule;
      setPlantSchedules(updatedSchedules);

      setIsEditing(false);
      setEditIndex(null);
      setFormData({
        ScheduleID: '',
        PlantName: '',
        Field: '',
        Resources: '',
        WeatherCondition: '',
        PlantedDate: '',
        ExpectedBloomingDate: ''
      });
    } catch (error) {
      console.error('Error updating plant schedule:', error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditIndex(null);
    setFormData({
      ScheduleID: '',
      PlantName: '',
      Field: '',
      Resources: '',
      WeatherCondition: '',
      PlantedDate: '',
      ExpectedBloomingDate: ''
    });
  };

  const handleDelete = async (index) => {
    try {
      await api.delete(`/plantSchedules/${plantSchedules[index]._id}`);
      fetchPlantSchedules();
    } catch (error) {
      console.error('Error deleting schedule:', error);
    }
  };

  const filterSchedules = () => {
    return plantSchedules.filter(schedule => {
      const lowerCaseQuery = searchQuery.toLowerCase();
      return (
        schedule.ScheduleID.toLowerCase().includes(lowerCaseQuery) ||
        schedule.PlantName.toLowerCase().includes(lowerCaseQuery) ||
        schedule.Field.toLowerCase().includes(lowerCaseQuery) ||
        schedule.Resources.toLowerCase().includes(lowerCaseQuery) ||
        schedule.WeatherCondition.toLowerCase().includes(lowerCaseQuery)
      );
    });
  };

  return (
    <div className="bg-[#BACD92] mt-10 p-6 dark:bg-cTwo">
      <h2 className="font-bold text-black mb-4 text-center text-5xl dark:text-white">Plant Schedules</h2>
    
      <div className="grid grid-cols-8 gap-4 w-full text-center font-bold text-black dark:text-white text-xl mb-5">
        <div className="px-4">Schedule ID</div>
        <div className="px-4">Plant Name</div>
        <div className="px-4">Field</div>
        <div className="px-4">Planted Date</div>
        <div className="px-4">Expected Blooming Date</div>
        <div className="px-4">Resources</div>
        <div className="px-4">Weather Condition</div>
        <div className="px-4">Actions</div>
      </div>
      <ul className="space-y-4">
        {plantSchedules.map((schedule, index) => (
          <li key={schedule._id} className="grid grid-cols-8 gap-4 p-4 bg-[#75A47F]  rounded-md dark:bg-bOne ">
            <div className="px-4 text-center text-2xl">{schedule.ScheduleID}</div>
            <div className="px-4 text-center text-2xl">{schedule.PlantName}</div>
            <div className="px-4 text-center text-2xl">{schedule.Field}</div>
            <div className="px-4 text-center text-2xl">{new Date(schedule.PlantedDate).toLocaleDateString('en-GB' , {day: '2-digit', month: '2-digit', year:'2-digit'})}</div>
            <div className="px-4 text-center text-2xl">{new Date(schedule.ExpectedBloomingDate).toLocaleDateString('en-GB' , {day: '2-digit', month: '2-digit', year:'2-digit'})}</div>
            <div className="px-4 text-center text-2xl">{schedule.Resources}</div>
            <div className="px-4 text-center text-2xl">{schedule.WeatherCondition}</div>
            <div className="px-4 flex justify-around items-center">
              <button 
                className="space-x-8 bg-yellow-400 text-black text-sm px-3 py-1 rounded hover:bg-yellow-500"
                onClick={() => handleEditClick(schedule, index)}
              >
                <PencilSquareIcon className="h-6 w-6" />
              </button>
              <button 
                className="space-x-8 bg-red-400 text-black text-sm px-3 py-1 rounded hover:bg-red-500"
                onClick={() => handleDelete(index)}
              >
                <TrashIcon className="h-6 w-6 " />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Popup Modal for Editing */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center dark:text-cTwo">
          <div className="bg-white p-6 rounded-lg w-1/2">
            <h2 className="text-3xl font-bold mb-4">Edit Plant Schedule</h2>
            <form>

              <div className="mb-4">
                <label className="block text-xl font-bold mb-2">Schedule ID</label>
                <input 
                  type="text"
                  className="w-full p-2 rounded-md bg-gray-100"
                  value={formData.ScheduleID}
                  onChange={handleFormChange}
                  name="ScheduleID"
                  disabled
                />
              </div>

              <div className="mb-4">
                <label className="block text-xl font-bold mb-2">Plant Name</label>
                <input 
                  type="text"
                  className="w-full p-2 rounded-md bg-gray-100"
                  value={formData.PlantName}
                  onChange={handleFormChange}
                  name="PlantName"
                  disabled
                />
              </div>

              <div className="mb-4">
                <label className="block text-xl font-bold mb-2">Planted Date</label>
                <input 
                  type="date" 
                  name="PlantedDate" 
                  value={formData.PlantedDate} 
                  onChange={handleFormChange} 
                  className="w-full p-2 rounded-md bg-gray-100" 
                  disabled
                />
              </div>

              <div className="mb-4">
                <label className="block text-xl font-bold mb-2">Field</label>
                <input 
                  type="text" 
                  name="Field" 
                  value={formData.Field} 
                  onChange={handleFormChange} 
                  className="w-full p-2 rounded-md bg-gray-100"
                  disabled
                />
              </div>

              <div className="mb-4">
                <label className="block text-xl font-bold mb-2">Resources</label>
                <input 
                  type="text" 
                  name="Resources" 
                  value={formData.Resources} 
                  onChange={handleFormChange} 
                  className="w-full p-2 rounded-md bg-gray-100"
                />
              </div>

              <div className="mb-4">
                <label className="block text-xl font-bold mb-2">Weather Condition</label>
                <input 
                  type="text" 
                  name="WeatherCondition" 
                  value={formData.WeatherCondition}
                  onChange={handleFormChange} 
                  className="w-full p-2 rounded-md bg-gray-100"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  onClick={handleUpdate}
                >
                  Update
                </button>
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewPlantSchedule;
