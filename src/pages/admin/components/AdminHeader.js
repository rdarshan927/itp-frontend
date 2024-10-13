import React, { useState, useEffect } from "react";

const AdminHeader = () => {
  const [admin, setAdmin] = useState('')

  useEffect(() => {
      // Get the logged-in admin from localStorage
      const loggedInAdmin = localStorage.getItem("loggedInAdmin");
      setAdmin(loggedInAdmin);
  }, []);



  return (
    <div className="bg-darkG py-2 dark:bg-cOne">
      <div className="flex justify-end items-center p-2">
        <h1 className="text-white text-3xl font-bold">{admin}</h1>
        <img src="/image/boy.png" alt="User Avatar" className="w-16 h-16 mr-4 ml-4" />
      </div>
    </div>
  );
};

export default AdminHeader;
