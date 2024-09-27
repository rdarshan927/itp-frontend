import React from "react";

const AdminHeader = ({ username }) => {
    return (
        <div className="bg-darkG">
            <div className="flex justify-end items-center p-2">
                <h1 className="text-white text-3xl font-bold">Financial Manager</h1>
                <img src="/image/boy.png" alt="User Avatar" className="w-16 h-16 mr-4 ml-4" />

            </div>
        </div>
    );
}

export default AdminHeader;
