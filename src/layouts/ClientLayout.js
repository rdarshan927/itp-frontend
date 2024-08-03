// src/layouts/ClientLayout.js
import React, { lazy } from 'react';
import { Outlet } from 'react-router-dom';

const Header = lazy(() => import('../components/Header'));
const Footer = lazy(() => import('../components/Footer'));

const ClientLayout = () => {
    return (
        <>
            <Header />
            <div className="min-h-screen flex flex-col">
                <main className="flex-grow">
                    <Outlet />
                </main>
            </div>
            <Footer />
        </>

    );
};

export default ClientLayout;
