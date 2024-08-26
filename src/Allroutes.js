import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { DarkModeProvider } from "./config/darkMode";

import Loading from "./components/Pageloading";
const Home = lazy(() => import('./pages/home/Home'));
const ManageEmployeeRole = lazy(() => import('./pages/ManageEmployeeRole/ManageEmployeeRole'));
const Packing = lazy(() => import('./pages/admin/packinganddelivery/Packing'));
const Order = lazy(() => import('./pages/admin/packinganddelivery/Order'));
const Delivery = lazy(() => import('./pages/admin/packinganddelivery/Delivery'));

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
                            <Route path='/packing' element={<Packing />} />
                            <Route path='/order' element={<Order />} />
                            <Route path='/delivery' element={<Delivery />} />
                            
                        </Route>
                    </Routes>
                </Suspense>
            </DarkModeProvider>
        </BrowserRouter>
    );
}

export default AllRoutes;
