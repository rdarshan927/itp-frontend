import React, { useEffect, useState } from 'react';
import { api } from '../../../config/api';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function HarvestManagement() {
  const [harvests, setHarvests] = useState([]);
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
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  const [formErrors, setFormErrors] = useState({}); // Validation errors

  useEffect(() => {
    api
      .get('/harvest')
      .then((res) => {
        setHarvests(Array.isArray(res.data.harvestData) ? res.data.harvestData : []);
      })
      .catch((err) => {
        console.log(err);
        setHarvests([]);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update the form value
    setForm({ ...form, [name]: value });

    // Clear specific field errors when the value changes
    setFormErrors({ ...formErrors, [name]: '' });

    // Real-time validation for specific fields
    if (name === 'quantity' && (value <= 0 || isNaN(value))) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        quantity: 'Quantity must be a positive number.'
      }));
    }

    if (!isEditing) {
      if (name === 'harvestId' && (!value.startsWith('HARV-') || !isHarvestIdUnique(value))) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          harvestId: !value.startsWith('HARV-') 
            ? "Harvest ID must start with 'HARV-'."
            : 'Harvest ID must be unique.'
        }));
      }
    }
    
  };

  const validateForm = () => {
    const errors = {};

    if (!form.harvestId.trim()) errors.harvestId = 'Harvest ID is required.';
    else if (!isHarvestIdUnique(form.harvestId)) errors.harvestId = 'Harvest ID must be unique.';

    if (!form.cropType.trim()) errors.cropType = 'Crop type is required.';
    if (!form.harvestDate) errors.harvestDate = 'Harvest date is required.';

    if (!form.quantity) errors.quantity = 'Quantity is required.';
    else if (form.quantity <= 0) errors.quantity = 'Quantity must be a positive number.';

    if (!form.quality) errors.quality = 'Quality is required.';
    if (!form.unit.trim()) errors.unit = 'Unit is required.';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Function to check if the harvestId is unique
  const isHarvestIdUnique = (harvestIdToCheck) => {
    if (isEditing) return true; // Skip validation when editing
    return !harvests.some((harvest) => harvest.harvestId === harvestIdToCheck);
  };

  const handleAdd = (e) => {
    e.preventDefault();

    // Validate the form
    if (!validateForm()) {
      setErrorMessage('Please correct the errors before submitting.');
      return;
    }

    const updateHarvestList = (newHarvestData) => {
      setHarvests((prevHarvests) => {
        const harvestData = Array.isArray(newHarvestData) ? newHarvestData : [];

        if (isEditing) {
          return prevHarvests.map((harvest) =>
            harvest.harvestId === currentId ? { ...harvest, ...form } : harvest
          );
        } else {
          return [...prevHarvests, form];
        }
      });
    };

    if (isEditing) {
      api
        .put(`/harvest/${currentId}`, form)
        .then((res) => updateHarvestList(res.data.harvestData))
        .catch((err) => console.log(err));
    } else {
      api
        .post('/harvest', form)
        .then((res) => {
          updateHarvestList([{ ...form, harvestId: res.data.harvestId }]);
        })
        .catch((err) => console.log(err));
    }

    setIsEditing(false);
    setErrorMessage('');
    setForm({
      harvestId: '',
      cropType: '',
      harvestDate: '',
      quantity: '',
      quality: '',
      unit: ''
    });
  };

  const handleEdit = (_id) => {
    const harvestToEdit = harvests.find((harvest) => harvest._id === _id);
    if (harvestToEdit) {
      setForm(harvestToEdit);
      setIsEditing(true);
      setCurrentId(_id);
    }
  };

  const handleDelete = (_id) => {
    setHarvests((prevHarvests) => {
      return prevHarvests.filter((harvest) => harvest.harvestId !== _id);
    });

    api
      .delete(`/harvest/${_id}`)
      .then((res) => {
        if (res.status === 200) {
          if (Array.isArray(res.data.harvestData)) {
            setHarvests(res.data.harvestData);
          }
        }
      })
      .catch((err) => console.log(err));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredHarvests = Array.isArray(harvests)
    ? harvests.filter(
        (harvest) =>
          harvest.harvestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          harvest.cropType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          harvest.quality.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Add title: "Sephora Flowers"
    doc.setFontSize(16);
    doc.setTextColor('#5cb85c');
    doc.text('Sephora Flowers', 105, 20, { align: 'center' });

    // Subtitle: "Delivering beauty and elegance in every petal."
    doc.setFontSize(12);
    doc.setTextColor('#555');
    doc.text('Delivering beauty and elegance in every petal.', 105, 30, { align: 'center' });

    // Contact information
    doc.setFontSize(10);
    doc.setTextColor('#000');
    doc.text('Contact: 0777-894523 | Email: sephoraflowers@gmail.com', 14, 45);
    doc.text('Address: Badulla, Bandarawela', 14, 50);

    // Title for the PDF
    doc.setFontSize(14);
    doc.text('Harvest Data Report', 105, 65, { align: 'center' });

    const tableColumn = [
      { header: 'Harvest ID', dataKey: 'harvestId' },
      { header: 'Crop Type', dataKey: 'cropType' },
      { header: 'Harvest Date', dataKey: 'harvestDate' },
      { header: 'Quantity', dataKey: 'quantity' },
      { header: 'Quality', dataKey: 'quality' },
      { header: 'Unit', dataKey: 'unit' },
    ];

    const tableRows = filteredHarvests.map((harvest) => ({
      harvestId: harvest.harvestId,
      cropType: harvest.cropType,
      harvestDate: new Date(harvest.harvestDate).toLocaleDateString(),
      quantity: harvest.quantity,
      quality: harvest.quality,
      unit: harvest.unit,
    }));

    doc.autoTable({
      columns: tableColumn,
      body: tableRows,
      startY: 80,
      theme: 'grid',
      styles: { fontSize: 10, halign: 'center' },
      headStyles: { fillColor: '#5cb85c' },
      columnStyles: {
        0: { halign: 'left' },
      },
    });

    const finalY = doc.lastAutoTable.finalY || 80;
    const date = new Date().toLocaleDateString();
    doc.text(`Date: ${date}`, 14, finalY + 20);
    doc.text('Signature: ', 160, finalY + 20);

    doc.save('harvest_data.pdf');
  };
    
    
    
    
  return (
    <div className="flex flex-col lg:flex-row  bg-white-100">
      <div className="w-full p-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by Harvest ID, Crop Type, or Quality"
            value={searchTerm}
            onChange={handleSearch}
            className="p-2 border border-gray-300 rounded w-full"
          />
        </div>

        {errorMessage && (
          <div className="bg-red-200 text-red-700 p-2 rounded mb-4">
            {errorMessage}
          </div>
        )}

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
                required
                placeholder="Harvest ID"
                className="p-2 border border-gray-300 rounded bg-adminLightGreen"
              />
               {formErrors.harvestId && <p className="text-red-500">{formErrors.harvestId}</p>}
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
              {formErrors.cropType && <p className="text-red-500">{formErrors.cropType}</p>}
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
            max={new Date().toISOString().split("T")[0]} // Sets the max date as today's date
            className="p-2 border border-gray-300 rounded bg-adminLightGreen"
            style={{ width: '213px' }}
            />
            {formErrors.harvestDate && <p className="text-red-500">{formErrors.harvestDate}</p>}
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
              {formErrors.quantity && <p className="text-red-500">{formErrors.quantity}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="quality" className="text-white">Quality</label><br />
              <select
                id="quality"
                name="quality"
                value={form.quality}
                required
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded bg-adminLightGreen"
                style={{ width: '213px' }}
              >
                <option value="" disabled>Select Quality</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
              {formErrors.quality && <p className="text-red-500">{formErrors.quality}</p>}
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
              {formErrors.unit && <p className="text-red-500">{formErrors.unit}</p>}
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
        <div className="flex justify-end mb-4">
          <button
            onClick={handleDownloadPDF}
            className="bg-green-500 text-white py-2 px-4 rounded"
          >
            Download PDF
          </button>
        </div>

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
                  <tr key={index} className="odd:bg-lightG even:bg-green-200">
                    <td className="px-4 py-2">{harvest.harvestId}</td>
                    <td className="px-4 py-2">{harvest.cropType}</td>
                    <td className="px-4 py-2">{new Date(harvest.harvestDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'numeric',
                          day: 'numeric'
                      })}
                    </td>
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
