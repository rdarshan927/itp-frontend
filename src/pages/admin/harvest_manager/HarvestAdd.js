import React, { useEffect, useState } from 'react';
import axios from 'axios';
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

  // Fetch harvest data on component mount
  useEffect(() => {
    axios
      .get('http://localhost:5000/harvest')
      .then((res) => {
        console.log(res)
        setHarvests(res.data.harvestData || []); // Ensure harvestData is an array or fallback to empty array
      })
      .catch((err) => console.log(err));
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission (Add or Edit)
  const handleAdd = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (isEditing) {
      // Update existing harvest
      axios
        .put(`http://localhost:5000/harvest/${currentId}`, form)
        .then((res) => setHarvests(res.data.harvestData)) // Ensure response is an array
        .catch((err) => console.log(err));
    } else {
      // Add new harvest
      axios
        .post('http://localhost:5000/harvest', form)
        .then((res) => console.log(res) )// Ensure response is an array
        .catch((err) => console.log(err));
    }
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
    axios
      .delete(`http://localhost:5000/harvest/${_id}`)
      .then((res) => setHarvests(res.data.harvestData || [])) // Ensure response is an array
      .catch((err) => console.log(err));
  };



  return (
    <div className="flex flex-col lg:flex-row h-screen bg-white-100">
      {/* Main Content */}
      <div className="w-full p-6">
        {/* Add Harvest Details Form */}
        <div className="bg-darkG p-4 rounded-md mb-4">
          <h2 className="mb-4 text-xl text-white font-bold">
            {isEditing ? 'Edit Harvest Details' : 'Add Harvest Details'}
          </h2>

          {/* HTML Form */}
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-group">
              <label htmlFor="harvestId" className="text-white">Harvest ID</label>
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
              <label htmlFor="cropType" className="text-white">Crop Type</label>
              <input
                type="text"
                id="cropType"
                name="cropType"
                value={form.cropType}
                onChange={handleChange}
                placeholder="Crop Type"
                className="p-2 border border-gray-300 rounded bg-adminLightGreen"
              />
            </div>
            <div className="form-group">
              <label htmlFor="harvestDate" className="text-white">Harvest Date</label>
              <input
                type="date"
                id="harvestDate"
                name="harvestDate"
                value={form.harvestDate}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded bg-adminLightGreen"
              />
            </div>
            <div className="form-group">
              <label htmlFor="quantity" className="text-white">Quantity</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                placeholder="Quantity"
                className="p-2 border border-gray-300 rounded bg-adminLightGreen"
              />
            </div>
            <div className="form-group">
              <label htmlFor="quality" className="text-white">Quality</label>
              <input
                type="text"
                id="quality"
                name="quality"
                value={form.quality}
                onChange={handleChange}
                placeholder="Quality"
                className="p-2 border border-gray-300 rounded bg-adminLightGreen"
              />
            </div>
            <div className="form-group">
              <label htmlFor="unit" className="text-white">Unit</label>
              <input
                type="text"
                id="unit"
                name="unit"
                value={form.unit}
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
              {harvests && harvests.length > 0 ? (
                harvests.map((harvest, index) => (
                  <tr key={index} className="odd:bg-darkG: even:bg-green-50">
                    <td className="px-4 py-2">{harvest.harvestId}</td>
                    <td className="px-4 py-2">{harvest.cropType}</td>
                    <td className="px-4 py-2">{harvest.harvestDate}</td>
                    <td className="px-4 py-2">{harvest.quantity}</td>
                    <td className="px-4 py-2">{harvest.quality}</td>
                    <td className="px-4 py-2">{harvest.unit}</td>
                    <td className="px-4 py-2">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(harvest._id)}
                          className="p-2 text-black rounded"
                        >
                          <PencilSquareIcon className="h-6 w-6 " />
                        </button>
                        <button
                          onClick={() => handleDelete(harvest._id)}
                          className="p-2 text-black rounded"
                        >
                          <TrashIcon className="h-6 w-6" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-2" colSpan="7">
                    No harvests available.
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
