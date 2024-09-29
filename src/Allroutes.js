import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { DarkModeProvider } from "./config/darkMode";
import 'react-toastify/dist/ReactToastify.css';

import Loading from "./components/Pageloading";

// Lazy loading the components
const Home = lazy(() => import('./pages/home/Home'));
const ManageEmployeeRole = lazy(() => import('./pages/admin/ManageEmployeeRole/ManageEmployeeRole'));
const Invoice = lazy(() => import('./pages/admin/sales/Invoice'))
const SalesDashboard = lazy(() => import('./pages/admin/sales/SalesDashboard'));
const Cart = lazy(() => import('./pages/cart/Cart'))
const PaymentSuccess = lazy(() => import('./pages/cart/PaymentSuccess'))
const Register = lazy(() => import('./pages/register/Register'))
const ForgotPassword = lazy(() => import('./pages/forgetpassword/ForgetPassword'));
const ResetPassword = lazy(() => import('./pages/forgetpassword/ResetPassword'));
const AddEmployee = lazy(() => import('./pages/admin/SheporaEmployeeManagement/AddEmployee'));

const Login = lazy(() => import('./pages/login/Login'));
const ResourceInventory = lazy(() => import('./pages/admin/ManageInventory/ResourceInventory'));
const SalesInventory = lazy(() => import('./pages/admin/ManageInventory/SalesInventory'));
const Packing = lazy(() => import('./pages/admin/packinganddelivery/Packing'));
const Order = lazy(() => import('./pages/admin/packinganddelivery/Order'));
const Delivery = lazy(() => import('./pages/admin/packinganddelivery/Delivery'));
const Salary = lazy(() => import('./pages/admin/Salary/Salary'));
const InventoryStuff = lazy(() => import('./pages/admin/InventoryStuff/InventoryStuff'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard/Dashboard'));


const ClientLayout = lazy(() => import('./layouts/ClientLayout'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const ClientPrivateRoute = lazy(() => import('./config/ClientPrivateRoute'))
const None = lazy(() => import('./pages/admin/components/None'))

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
                            <Route path='/packing' element={<Packing />} />
                            <Route path='/order' element={<Order />} />
                            <Route path='/delivery' element={<Delivery />} />
                            
                            <Route path="/sales/invoices" element={<Invoice />} />
                            <Route path='/ResourceInventory' element={<ResourceInventory />} />
                            <Route path='/SalesInventory' element={<SalesInventory />} />
                            <Route path='sales/dashboard' element={<SalesDashboard />} />
                            <Route path='/salary' element={<Salary />} />
                            <Route path='/inventorystuff' element={<InventoryStuff />} />
                            <Route path='/Dashboard' element={<Dashboard/>}/>
                            <Route path='/none' element={<None />} />
                        </Route>
                    </Routes>
                </Suspense>
            </DarkModeProvider>
        </BrowserRouter>
    );
}

export default AllRoutes;
