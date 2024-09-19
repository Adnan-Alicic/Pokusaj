import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import DashBoard from './Components/Dashboard/Dashboard';
import AdminDashboard from './Components/AdminDashboard/AdminDashboard';
import WorkerDash from './Components/WorkerDash/WorkerDash';
import Login from './Components/Login/Login';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/index" element={<Login />} />
      <Route path="/dashboard" element={<DashBoard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/worker-dashboard" element={<WorkerDash />} />
      <Route path="*" element={<Navigate to="/index" replace />} />
    </Routes>
  </BrowserRouter>
);
