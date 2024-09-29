import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
    const [admin, setAdmin] = useState(null);
    const navigate = useNavigate();

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
        "Financial Manager": [
            { label: "Dashboard", path: "/Dashboard" },
            { label: "Salary", path: "/salary" },
            { label: "Inventory Stuff", path: "/inventorystuff" },
            
        ],
        "Harvest Manager": [
            { label: "Manage Harvest", path: "/harvest" }
        ],
        "Plant Scheduling Manager": [
            { label: "Dashboard", path: "/plant-schedule-dashboard" },
            { label: "Plant Schedule", path: "/plant-schedule" },
            { label: "Reports", path: "/plant-reports" }
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
        navigate(path); // Navigates to the clicked button's path
    };

    return (
        <div className="bg-lightG p-3 w-80 ">
            <div className="inline-grid relative top-20">
                {admin && adminButtons[admin]?.map(({ label, path }, index) => (
                    <button
                        key={index}
                        className="text-2xl bg-darkG text-white font-bold py-2 rounded-b-lg mt-10 w-72 rounded hover:bg-[#c9d5b0]"
                        onClick={() => handleNavigation(path)}
                    >
                        {label}
                    </button>
                ))}
                <button 
                    className="text-2xl bg-darkG text-white font-bold py-2 rounded-b-lg mt-10 w-72 rounded hover:bg-[#c9d5b0]" 
                    onClick={() => handleNavigation("/logout")}
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
