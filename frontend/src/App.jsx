import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Home from './Components/Home';
import Login from './Components/Login';
import Signup from './Components/Signup';
import MenCollection from './Components/MenCollection';
import WomenCollection from './Components/WomenCollection';
import KidsCollection from './Components/KidsCollection';
import Buy from './Components/Buy';
import Purchases from './Components/Purchases';
import Cloths from './Components/Cloths';
import AdminSignup from './admin/AdminSignup';
import AdminLogin from './admin/AdminLogin';
import Dashboard from './admin/Dashboard';
import CreateCloths from './admin/CreateCloths';
import UpdateCourse from './admin/UpdateCourse';
import OurCloths from './admin/OurCloths';

import { ProtectedRoute, AdminProtectedRoute } from './Components/ProtectedRoute';
import ProductDisplay from './Components/ProductDisplay';

function App() {
  return (
    <div>
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/men' element={<MenCollection />} />
        <Route path='/women' element={<WomenCollection />} />
        <Route path='/kids' element={<KidsCollection />} />
        <Route path='/buy/:clothId' element={<Buy />} />
        <Route path='/cloths' element={<Cloths />} />
        <Route path='/productdisplay/:id' element={<ProductDisplay />} />

        {/* Protected User Route */}
        <Route
          path='/purchases'
          element={
            <ProtectedRoute>
              <Purchases />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route path='/admin/signup' element={<AdminSignup />} />
        <Route path='/admin/login' element={<AdminLogin />} />
        <Route
          path='/admin/dashboard'
          element={
            <AdminProtectedRoute>
              <Dashboard />
            </AdminProtectedRoute>
          }
        />
        <Route path='/admin/create-cloth' element={<CreateCloths />} />
        <Route path='/admin/update-cloth/:id' element={<UpdateCourse />} />
        <Route path='/admin/our-cloths' element={<OurCloths />} />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
