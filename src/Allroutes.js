import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { DarkModeProvider } from "./config/darkMode";
import 'react-toastify/dist/ReactToastify.css';

import Loading from "./components/Pageloading";
const Home = lazy(() => import('./pages/home/Home'));
const ManageEmployeeRole = lazy(() => import('./pages/admin/ManageEmployeeRole/ManageEmployeeRole'));
const Invoice = lazy(() => import('./pages/admin/sales/Invoice'))
const SalesDashboard = lazy(() => import('./pages/admin/sales/SalesDashboard'));
const Cart = lazy(() => import('./pages/cart/Cart'))
const PaymentSuccess = lazy(() => import('./pages/cart/PaymentSuccess'))
const Register = lazy(() => import('./pages/register/Register'))
const Login = lazy(() => import('./pages/login/Login'));
const ResourceInventory = lazy(() => import('./pages/admin/ManageInventory/ResourceInventory'));
const SalesInventory = lazy(() => import('./pages/admin/ManageInventory/SalesInventory'));

const ClientLayout = lazy(() => import('./layouts/ClientLayout'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const ClientPrivateRoute = lazy(() => import('./config/ClientPrivateRoute'))

const AllRoutes = () => {
    return (
        <BrowserRouter>
            <DarkModeProvider>
                <Suspense fallback={<Loading />}>
                    <Routes>
                        {/* Client Routes */}
                        <Route element={<ClientLayout />}>
                            <Route path='/cart' element={<Cart />} />
                            <Route path="/paymentsuccess" element={<PaymentSuccess/>} />
                            <Route path='/register' element={<Register />} />
                            <Route path="/login" element={<Login/>}/>
                            <Route path='/' element={
                                <ClientPrivateRoute>
                                    <Home/>
                                </ClientPrivateRoute>
                            } />
                        </Route>

                        {/* Admin Routes */}
                        <Route element={<AdminLayout />}>
                            <Route path='/manageemprole' element={<ManageEmployeeRole />} />
                            <Route path="/sales/invoices" element={<Invoice />} />
                            <Route path='/ResourceInventory' element={<ResourceInventory />} />
                            <Route path='/SalesInventory' element={<SalesInventory />} />
                            <Route path='sales/dashboard' element={<SalesDashboard />} />
                        </Route>
                    </Routes>
                </Suspense>
            </DarkModeProvider>
        </BrowserRouter>
    );
}

export default AllRoutes;
