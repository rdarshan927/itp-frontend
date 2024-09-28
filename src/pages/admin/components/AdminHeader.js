import React from "react";

const AdminHeader = () => {
  const admins = [
    "Sales Manager",
    "Financial Manager",
    "Harvest Manager",
    "Plant Scheduling Manager",
    "Stock & Transport Manager",
    "Disease Manager",
    "Inventory Manager",
    "Employee Manager"
  ];

  const handleAdminLogin = (admin) => {
    // Set the logged-in admin to localStorage
    localStorage.setItem("loggedInAdmin", admin);
    // Optionally trigger a refresh or rerender
    window.location.reload(); // Rerenders the page to reflect changes in the sidebar
  };

  return (
    <div className="bg-darkG">
      <div className="flex justify-between items-center p-6">
        <h1 className="text-white text-3xl font-bold">Admin Portal</h1>
        <img src="/image/boy.png" alt="User Avatar" className="w-16 h-16" />
      </div>
      <div className="flex justify-center mt-4 space-x-4">
        {admins.map((admin) => (
          <button
            key={admin}
            className="bg-lightG hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleAdminLogin(admin)}
          >
            {admin}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminHeader;
