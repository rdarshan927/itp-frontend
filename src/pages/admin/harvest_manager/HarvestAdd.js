import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {api} from '../../../config/api'
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';

function HarvestManagement() {
  const [harvests, setHarvests] = useState([]); // Initialize as an empty array
  const [form, setForm] = useState({
    harvestId: '',
    cropType: '',
    harvestDate: '',
    quantity: '',
    quality: '',
    unit: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // New state for search

  // Fetch harvest data on component mount
  useEffect(() => {
    api
      .get('/harvest')
      .then((res) => {
        setHarvests(Array.isArray(res.data.harvestData) ? res.data.harvestData : []); // Ensure it's an array
      })
      .catch((err) => {
        console.log(err);
        setHarvests([]); // Fallback to empty array in case of error
      });
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission (Add or Edit)
const handleAdd = (e) => {
  e.preventDefault(); // Prevent default form submission behavior

  const updateHarvestList = (newHarvestData) => {
    setHarvests((prevHarvests) => {
      const harvestData = Array.isArray(newHarvestData) ? newHarvestData : [];

      if (isEditing) {
        // Optimistically update the specific harvest
        return prevHarvests.map(harvest =>
          harvest.harvestId === currentId
            ? { ...harvest, ...form } // Use form data to update immediately
            : harvest
        );
      } else {
        // Optimistically append the new harvest (form will be updated with the new ID in .then)
        return [...prevHarvests, form];
      }
    });
  };

  if (isEditing) {
    // Update existing harvest
    api
      .put(`/harvest/${currentId}`, form)
      .then((res) => updateHarvestList(res.data.harvestData)) // Use server response to sync
      .catch((err) => console.log(err));
  } else {
    // Add new harvest
    api
      .post('/harvest', form)
      .then((res) => {
        // Update the list using server response for new ID
        updateHarvestList([{ ...form, harvestId: res.data.harvestId }]);
      })
      .catch((err) => console.log(err));
  }

  // Reset form and editing state
  setIsEditing(false);
  setForm({
    harvestId: '',
    cropType: '',
    harvestDate: '',
    quantity: '',
    quality: '',
    unit: ''
  });
};


  // Handle edit button click
  const handleEdit = (_id) => {
    const harvestToEdit = harvests.find((harvest) => harvest._id === _id);
    if (harvestToEdit) {
      setForm(harvestToEdit);
      setIsEditing(true);
      setCurrentId(_id);
    }
  };

  // Handle delete button click
  const handleDelete = (_id) => {
    console.log("Attempting to delete:", _id);
    
    // Optimistically remove the item from the UI before the server call
    setHarvests((prevHarvests) => {
      const newHarvests = prevHarvests.filter((harvest) => harvest.harvestId !== _id);
      console.log("Updated harvests after optimistic delete:", newHarvests);
      return newHarvests;
    });
  
    api
      .delete(`/harvest/${_id}`)
      .then((res) => {
        if (res.status === 200) {
          console.log('Item successfully deleted from the server');
          // Optionally sync with the server's updated list
          if (Array.isArray(res.data.harvestData)) {
            setHarvests(res.data.harvestData);
          }
        } else {
          console.error('Error: Server did not confirm deletion. Status:', res.status);
        }
      })
      .catch((err) => {
        console.error('Error deleting harvest:', err);
        // If needed, restore the item
        // setHarvests((prevHarvests) => [...prevHarvests, { harvestId: _id }]);
      });
  };
  


  // Handle search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter harvests based on search term
  const filteredHarvests = Array.isArray(harvests)
    ? harvests.filter(
        (harvest) =>
          harvest.harvestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          harvest.cropType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          harvest.quality.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="flex flex-col lg:flex-row  bg-white-100">
      {/* Main Content */}
      <div className="w-full p-6">
        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by Harvest ID, Crop Type, or Quality"
            value={searchTerm}
            onChange={handleSearch}
            className="p-2 border border-gray-300 rounded w-full"
          />
        </div>

        {/* Add Harvest Details Form */}
        <div className="bg-darkG p-4 rounded-md mb-4">
          <h2 className="mb-4 text-xl text-white font-bold">
            {isEditing ? 'Edit Harvest Details' : 'Add Harvest Details'}
          </h2>

          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-group">
              <label htmlFor="harvestId" className="text-white">Harvest ID</label><br />
              <input
                type="text"
                id="harvestId"
                name="harvestId"
                value={form.harvestId}
                onChange={handleChange}
                placeholder="Harvest ID"
                className="p-2 border border-gray-300 rounded bg-adminLightGreen"
              />
            </div>
            <div className="form-group">
              <label htmlFor="cropType" className="text-white">Crop Type</label><br />
              <input
                type="text"
                id="cropType"
                name="cropType"
                value={form.cropType}
                required
                onChange={handleChange}
                placeholder="Crop Type"
                className="p-2 border border-gray-300 rounded bg-adminLightGreen"
              />
            </div>
            <div className="form-group">
              <label htmlFor="harvestDate" className="text-white">Harvest Date</label><br />
              <input
                type="date"
                id="harvestDate"
                name="harvestDate"
                value={form.harvestDate}
                required
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded bg-adminLightGreen"
              />
            </div>
            <div className="form-group">
              <label htmlFor="quantity" className="text-white">Quantity</label><br />
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={form.quantity}
                required
                onChange={handleChange}
                placeholder="Quantity"
                className="p-2 border border-gray-300 rounded bg-adminLightGreen"
              />
            </div>
            <div className="form-group">
              <label htmlFor="quality" className="text-white">Quality</label><br />
              <input
                type="text"
                id="quality"
                name="quality"
                value={form.quality}
                required
                onChange={handleChange}
                placeholder="Quality"
                className="p-2 border border-gray-300 rounded bg-adminLightGreen"
              />
            </div>
            <div className="form-group">
              <label htmlFor="unit" className="text-white">Unit</label><br />
              <input
                type="text"
                id="unit"
                name="unit"
                value={form.unit}
                required
                onChange={handleChange}
                placeholder="Unit"
                className="p-2 border border-gray-300 rounded bg-adminLightGreen"
              />
            </div>
            <div className="form-group">
              <button
                type="submit"
                className="mt-4 py-2 px-4 bg-adminLightGreen text-white rounded"
              >
                {isEditing ? 'Update' : 'Add'}
              </button>
            </div>
          </form>
        </div>

        {/* Harvest Details Table */}
        <div className="p-4 rounded-md overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Harvest ID</th>
                <th className="px-4 py-2 text-left">Crop Type</th>
                <th className="px-4 py-2 text-left">Harvest Date</th>
                <th className="px-4 py-2 text-left">Quantity</th>
                <th className="px-4 py-2 text-left">Quality</th>
                <th className="px-4 py-2 text-left">Unit</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredHarvests.length > 0 ? (
                filteredHarvests.map((harvest, index) => (
                  <tr key={index} className="odd:bg-darkG: even:bg-green-50">
                    <td className="px-4 py-2">{harvest.harvestId}</td>
                    <td className="px-4 py-2">{harvest.cropType}</td>
                    <td className="px-4 py-2">{harvest.harvestDate}</td>
                    <td className="px-4 py-2">{harvest.quantity}</td>
                    <td className="px-4 py-2">{harvest.quality}</td>
                    <td className="px-4 py-2">{harvest.unit}</td>
                    <td className="px-4 py-2">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handleEdit(harvest._id)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <PencilSquareIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(harvest._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    No harvest data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default HarvestManagement;
