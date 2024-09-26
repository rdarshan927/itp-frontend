import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { DarkModeProvider } from "./config/darkMode";

import Loading from "./components/Pageloading";
const Home = lazy(() => import('./pages/home/Home'));
const ManageEmployeeRole = lazy(() => import('./pages/admin/ManageEmployeeRole/ManageEmployeeRole'));
const Register = lazy(() => import('./pages/register/Register'))
const ForgotPassword = lazy(() => import('./pages/forgetpassword/ForgetPassword'));
const ResetPassword = lazy(() => import('./pages/forgetpassword/ResetPassword'));
const AddEmployee = lazy(() => import('./pages/admin/SheporaEmployeeManagement/AddEmployee'));


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
                            <Route path='/register' element={<Register />} />
                            <Route path='/forgetpassword' element={<ForgotPassword />} />
                            <Route path='/reset_password/:id/:token' element={<ResetPassword />} />
                            <Route path='/' element={<Home />} />
                        </Route>

                        {/* Admin Routes */}
                        <Route element={<AdminLayout />}>
                            <Route path='/manageemprole' element={<ManageEmployeeRole />} />
                            <Route path='/addemployee' element={<AddEmployee />} />
                        </Route>
                    </Routes>
                </Suspense>
            </DarkModeProvider>
        </BrowserRouter>
    );
}

export default AllRoutes;
