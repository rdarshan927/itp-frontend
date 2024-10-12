import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DarkModeProvider } from "./config/darkMode";
import "react-toastify/dist/ReactToastify.css";

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
const HarvestAdd = lazy(() => import('./pages/admin/harvest_manager/HarvestAdd'));
const Table = lazy(() => import('./pages/admin/harvest_manager/Harves_table'));
const ResourceInventory = lazy(() => import('./pages/admin/ManageInventory/ResourceInventory'));
const SalesInventory = lazy(() => import('./pages/admin/ManageInventory/SalesInventory'));
const Packing = lazy(() => import('./pages/admin/packinganddelivery/Packing'));
const Order = lazy(() => import('./pages/admin/packinganddelivery/Order'));
const Delivery = lazy(() => import('./pages/admin/packinganddelivery/Delivery'));
const Salary = lazy(() => import('./pages/admin/Salary/Salary'));
const InventoryStuff = lazy(() => import('./pages/admin/InventoryStuff/InventoryStuff'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard/Dashboard'));
const AdminLogin =lazy(()=>import('./pages/login/AdminLogin'))
const Plant = lazy(() => import('./pages/admin/PlantSchedule/PlantSchedule'));
const PlantReports = lazy(() => import('./pages/admin/PlantSchedule/PlantReport'));
const Flower = lazy(() => import("./pages/home/Flower"));
const Bouquet = lazy(() => import("./pages/home/Bouquet"));
const ItemDescription = lazy(() => import("./pages/home/ItemDescription"));

const ClientLayout = lazy(() => import("./layouts/ClientLayout"));
const AdminLayout = lazy(() => import("./layouts/AdminLayout"));
const ClientPrivateRoute = lazy(() => import("./config/ClientPrivateRoute"));
const AdminPrivateRoute = lazy(() => import("./config/AdminPrivateRoute"));
const None = lazy(() => import("./pages/admin/components/None"));

const AllRoutes = () => {
  return (
    <BrowserRouter>
      <DarkModeProvider>
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Client Routes */}
            <Route element={<ClientLayout />}>
              <Route
                path="/cart"
                element={
                  <ClientPrivateRoute>
                    <Cart />
                  </ClientPrivateRoute>
                }
              />
              <Route
                path="/paymentsuccess"
                element={
                  <ClientPrivateRoute>
                    <PaymentSuccess />
                  </ClientPrivateRoute>
                }
              />
              <Route path="/register" element={<Register />} />
              <Route path="/forgetpassword" element={<ForgotPassword />} />
              <Route path="/reset_password/:id/:token" element={<ResetPassword />} />
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/adminLogin" element={<AdminLogin />} />
              <Route path="/flowers" element={<Flower />} />
              <Route path="/bouquet" element={<Bouquet />} />
              <Route path="/flowers/:productId" element={<ItemDescription />} />
              <Route path="/bouquet/:productId" element={<ItemDescription />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<AdminLayout />}>
              <Route
                path="/manageemprole"
                element={
                  <AdminPrivateRoute>
                    <ManageEmployeeRole />
                  </AdminPrivateRoute>
                }
              />
              <Route
                path="/harvest"
                element={
                  <AdminPrivateRoute>
                    <HarvestAdd />
                  </AdminPrivateRoute>
                }
              />
              <Route
                path="/harvestdashboard"
                element={
                  <AdminPrivateRoute>
                    <Table />
                  </AdminPrivateRoute>
                }
              />
              <Route
                path="/addemployee"
                element={
                  <AdminPrivateRoute>
                    <AddEmployee />
                  </AdminPrivateRoute>
                }
              />
              <Route
                path="/packing"
                element={
                  <AdminPrivateRoute>
                    <Packing />
                  </AdminPrivateRoute>
                }
              />
              <Route
                path="/order"
                element={
                  <AdminPrivateRoute>
                    <Order />
                  </AdminPrivateRoute>
                }
              />
              <Route
                path="/delivery"
                element={
                  <AdminPrivateRoute>
                    <Delivery />
                  </AdminPrivateRoute>
                }
              />
              <Route
                path="/sales/invoices"
                element={
                  <AdminPrivateRoute>
                    <Invoice />
                  </AdminPrivateRoute>
                }
              />
              <Route
                path="/ResourceInventory"
                element={
                  <AdminPrivateRoute>
                    <ResourceInventory />
                  </AdminPrivateRoute>
                }
              />
              <Route
                path="/SalesInventory"
                element={
                  <AdminPrivateRoute>
                    <SalesInventory />
                  </AdminPrivateRoute>
                }
              />
              <Route
                path="sales/dashboard"
                element={
                  <AdminPrivateRoute>
                    <SalesDashboard />
                  </AdminPrivateRoute>
                }
              />
              <Route
                path="/salary"
                element={
                  <AdminPrivateRoute>
                    <Salary />
                  </AdminPrivateRoute>
                }
              />
              <Route
                path="/inventorystuff"
                element={
                  <AdminPrivateRoute>
                    <InventoryStuff />
                  </AdminPrivateRoute>
                }
              />
              <Route
                path="/financialdashboard"
                element={
                  <AdminPrivateRoute>
                    <Dashboard />
                  </AdminPrivateRoute>
                }
              />
              <Route
                path="/none"
                element={
                  <AdminPrivateRoute>
                    <None />
                  </AdminPrivateRoute>
                }
              />
              <Route path='/manageemprole' element={<ManageEmployeeRole />} />   
              <Route path='/harvest' element={<HarvestAdd />} />
              <Route path='/table' element={<Table />} />
              <Route path='/manageemprole' element={<ManageEmployeeRole />} />
              <Route path='/addemployee' element={<AddEmployee />} />
              <Route path='/packing' element={<Packing />} />
              <Route path='/order' element={<Order />} />
              <Route path='/delivery' element={<Delivery />} />

              <Route path="/sales/invoices" element={<Invoice />} />
              <Rout path="/ResourceInventory" element={<ResourceInventory />}/>
              <Route path="/SalesInventory" element={<SalesInventory />} />
              <Route path="sales/dashboard" element={<SalesDashboard />} />
              <Route path="/salary" element={<Salary />} />
              <Route path="/inventorystuff" element={<InventoryStuff />} />
              <Route path="/Dashboard" element={<Dashboard />} />
              <Route path="/plant" element={<Plant />} />
              <Route path="/PlantReports" element={<PlantReports />} />
              <Route path="/none" element={<None />} />
            </Route>
          </Routes>
        </Suspense>
      </DarkModeProvider>
    </BrowserRouter>
  );
};

export default AllRoutes;
