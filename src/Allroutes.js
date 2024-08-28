import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { DarkModeProvider } from "./config/darkMode";

import Loading from "./components/Pageloading";

// Lazy loading the components
const Home = lazy(() => import('./pages/home/Home'));
const ManageEmployeeRole = lazy(() => import('./pages/admin/ManageEmployeeRole/ManageEmployeeRole'));
const Salary = lazy(() => import('./pages/admin/Salary/Salary'));
const InventoryStuff = lazy(() => import('./pages/admin/InventoryStuff/InventoryStuff'));


const ClientLayout = lazy(() => import('./layouts/ClientLayout'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));

const AllRoutes = () => {
    return (
        <BrowserRouter>
            <DarkModeProvider>
                <Suspense fallback={<Loading />}>
                    <Routes>
                        {/* Client Routes */}
                        <Route element={<ClientLayout />}>
                            <Route path='/' element={<Home />} />
                        </Route>

                        {/* Admin Routes */}
                        <Route element={<AdminLayout />}>
                            <Route path='/manageemprole' element={<ManageEmployeeRole />} />
                            <Route path='/salary' element={<Salary />} />
                            <Route path='/inventorystuff' element={<InventoryStuff />} />
                        </Route>
                    </Routes>
                </Suspense>
            </DarkModeProvider>
        </BrowserRouter>
    );
}

export default AllRoutes;
