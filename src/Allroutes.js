import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { DarkModeProvider } from "./config/darkMode";
import 'react-toastify/dist/ReactToastify.css';

import Loading from "./components/Pageloading";
const Home = lazy(() => import('./pages/home/Home'));
const ManageEmployeeRole = lazy(() => import('./pages/admin/ManageEmployeeRole/ManageEmployeeRole'));
const Cart = lazy(() => import('./pages/cart/Cart'))
const PaymentSuccess = lazy(() => import('./pages/cart/PaymentSuccess'))
const Register = lazy(() => import('./pages/register/Register'))
const ForgotPassword = lazy(() => import('./pages/forgetpassword/ForgetPassword'));
const ResetPassword = lazy(() => import('./pages/forgetpassword/ResetPassword'));
const AddEmployee = lazy(() => import('./pages/admin/SheporaEmployeeManagement/AddEmployee'));

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
                            <Route path='/forgetpassword' element={<ForgotPassword />} />
                            <Route path='/reset_password/:id/:token' element={<ResetPassword />} />
                            <Route path='/' element={<Home />} />
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
                            <Route path='/addemployee' element={<AddEmployee />} />
                            <Route path='/ResourceInventory' element={<ResourceInventory />} />
                            <Route path='/SalesInventory' element={<SalesInventory />} />
                        </Route>
                    </Routes>
                </Suspense>
            </DarkModeProvider>
        </BrowserRouter>
    );
}

export default AllRoutes;
