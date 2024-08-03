import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { DarkModeProvider } from "./config/darkMode";

import Loading from "./components/Pageloading";

// import all your pages and components similar to this.
const Header = lazy(()=>import('./components/Header'));
const Footer = lazy(()=>import('./components/Footer'));
const Home = lazy(()=>import('./pages/home/Home'));
const ManageEmployeeRole = lazy(()=>import('./pages/ManageEmployeeRole/ManageEmployeeRole'));
// const Check = lazy(()=>import('./pages/Check3'))


const AllRoutes = () => {

    return (
        <BrowserRouter>
            <DarkModeProvider>
                <Suspense fallback={<Loading />}>
                    <Header />
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/manageemprole' element={<ManageEmployeeRole />} />
                        {/* <Route path='check' element={<Check />} /> */}
                    </Routes>
                    <Footer />
                </Suspense>
            </DarkModeProvider>
        </BrowserRouter>
    )
}

export default AllRoutes