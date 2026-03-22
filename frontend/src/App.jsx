import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import { AuthProvider } from './context/AuthContext';
import NavigationBar from './components/NavigationBar';
import { PrivateRoute, RoleRoute } from './components/RouteGuards';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import HotelDetail from './pages/HotelDetail';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import CustomerBookings from './pages/CustomerBookings';
import PaymentPage from './pages/PaymentPage';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import ManageHotels from './pages/manager/ManageHotels';
import ManagerBookings from './pages/manager/ManagerBookings';

import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import AdminBookings from './pages/admin/AdminBookings';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="d-flex flex-column min-vh-100">
          <NavigationBar />
          <div className="flex-grow-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/hotel/:id" element={<HotelDetail />} />

              {/* Customer Routes */}
              <Route path="/customer/dashboard" element={
                <PrivateRoute>
                  <CustomerDashboard />
                </PrivateRoute>
              } />
              <Route path="/my-bookings" element={
                <PrivateRoute>
                  <CustomerBookings />
                </PrivateRoute>
              } />
              <Route path="/payment" element={
                <PrivateRoute>
                  <PaymentPage />
                </PrivateRoute>
              } />
              {/* Manager Routes */}
              <Route path="/manager/dashboard" element={
                <RoleRoute roles={['manager', 'admin']}>
                  <ManagerDashboard />
                </RoleRoute>
              } />
              <Route path="/manager/hotels" element={
                <RoleRoute roles={['manager', 'admin']}>
                  <ManageHotels />
                </RoleRoute>
              } />
              <Route path="/manager/bookings" element={
                <RoleRoute roles={['manager', 'admin']}>
                  <ManagerBookings />
                </RoleRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={
                <RoleRoute roles={['admin']}>
                  <AdminDashboard />
                </RoleRoute>
              } />
              <Route path="/admin/users" element={
                <RoleRoute roles={['admin']}>
                  <ManageUsers />
                </RoleRoute>
              } />
              <Route path="/admin/bookings" element={
                <RoleRoute roles={['admin']}>
                  <AdminBookings />
                </RoleRoute>
              } />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
