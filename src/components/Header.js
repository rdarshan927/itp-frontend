import React from "react";
import { useDarkMode } from "../config/darkMode";


const Header = () => {
    const { darkMode, toggleDarkMode } = useDarkMode();

    return (
        <div className="w-full h-7 bg-slate-500">
            <button 
                onClick={toggleDarkMode} 
                className="ml-4 px-2 py-1 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded"
            >
                {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
        </div>
    )
}

export default Header