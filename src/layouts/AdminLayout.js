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
            <div className="flex min-h-screen overflow-hidden">
                <Sidebar className="w-64" />
                <div className="flex-grow p-4 overflow-auto break-words whitespace-normal">
                    <Outlet />
                </div>
            </div>
            <AdminFooter />
        </>
    );
};

export default AdminLayout;
