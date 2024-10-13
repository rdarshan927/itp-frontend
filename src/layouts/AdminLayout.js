/**
 * Licensed under the Shepora Flower Plant Management System License (v1.0)
 * See the LICENSE.txt file for more details.
 */

// src/layouts/AdminLayout.js
import React, { lazy } from 'react';
import { Outlet } from 'react-router-dom';

const Sidebar = lazy(() => import('../pages/admin/components/SideBar'));
const AdminHeader = lazy(() => import('../pages/admin/components/AdminHeader'));
const AdminFooter = lazy(() => import('../pages/admin/components/AdminFooter'));

const AdminLayout = () => {
    return (
        <>
            <AdminHeader />
            <div className="flex min-h-screen overflow-hidden w-full pr-2">
                <Sidebar className="" />
                <div className=" flex-grow p-3 overflow-hidden break-words whitespace-normal">
                    <Outlet />
                </div>
            </div>
            {/* <AdminFooter /> */}
        </>
    );
};

export default AdminLayout;
