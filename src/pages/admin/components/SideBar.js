import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../../../config/darkMode";

const Sidebar = () => {
    const [admin, setAdmin] = useState(null);
    const navigate = useNavigate();
    const { darkMode, toggleDarkMode } = useDarkMode();

    useEffect(() => {
        // Get the logged-in admin from localStorage
        const loggedInAdmin = localStorage.getItem("loggedInAdmin");
        setAdmin(loggedInAdmin);
    }, []);

    const adminButtons = {
        "Sales Manager": [
            { label: "Dashboard", path: "/sales/dashboard" },
            { label: "Invoices", path: "/sales/invoices" }
        ],
        "Finance Manager": [
            { label: "Dashboard", path: "/Dashboard" },
            { label: "Salary", path: "/salary" },
            { label: "Inventory Stuff", path: "/inventorystuff" },
            
        ],
        "Harvest Manager": [
            { label: "Harvest Dashboard", path: "/harvestdashboard" },
            { label: "Manage Harvest", path: "/harvest" }
        ],
        "Plant Scheduling Manager": [
            { label: "Plant Schedule", path: "/Plant" },
            { label: "Reports", path: "/PlantReports" }
        ],
        "Stock & Transport Manager": [
            { label: "Order", path: "/order" },
            { label: "Packing", path: "/packing" },
            { label: "Delivery", path: "/delivery" }
        ],
        "Disease Manager": [
            { label: "Dashboard", path: "/disease-dashboard" },
            { label: "Disease Control", path: "/disease-control" },
            { label: "Reports", path: "/disease-reports" }
        ],
        "Inventory Manager": [
            { label: " Resource Inventory", path: "/ResourceInventory" },
            { label: "Sales Inventory", path: "/SalesInventory" }
        ],
        "Employee Manager": [
            { label: "Manage Employee", path: "/addemployee" }
        ]
    };

    const handleNavigation = (path) => {
        navigate(path); 
    };

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');  
        localStorage.removeItem('email');  
        localStorage.removeItem('loggedInAdmin');  
        navigate("/AdminLogin");
    }
    return (
        <div className="bg-lightG p-3 w-80 dark:bg-cTwo">
            <div className="inline-grid relative top-20">
                {admin && adminButtons[admin]?.map(({ label, path }, index) => (
                    <button
                        key={index}
                        className="text-2xl bg-darkG text-white font-bold py-2 rounded-b-lg mt-10 w-72 rounded hover:bg-[#c9d5b0] dark:bg-bOne"
                        onClick={() => handleNavigation(path)}
                    >
                        {label}
                    </button>
                ))}
                <button 
                    className="text-2xl bg-darkG text-white font-bold py-2 rounded-b-lg mt-10 w-72 rounded hover:bg-[#c9d5b0] dark:bg-bOne" 
                    onClick={() => handleLogout()}
                >
                    Logout
                </button>
                <button
                            onClick={toggleDarkMode}
                            className="bg-white text-black px-2 rounded text-2xl font-bold py-2 rounded-b-lg mt-10 w-72 hover:bg-[#c9d5b0]"
                        >
                            {darkMode ? "Light Mode" : "Dark Mode"}
                        </button>
            </div>
        </div>
    );
};

export default Sidebar;
