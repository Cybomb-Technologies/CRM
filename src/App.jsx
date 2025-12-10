import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { DataProvider } from "@/contexts/DataContext";

import Emp1Routes from "./EMP/emp-1-routes";
import Emp2Routes from "./EMP/emp-2-routes";
import Emp3Routes from "./EMP/emp-3-routes";
import Emp4Routes from "./EMP/emp-4-routes";
import Emp5Routes from "./EMP/emp-5-routes";

import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignUp";

import DashboardLayout from "@/layouts/DashboardLayout";

function App() {
  const { user } = useAuth();

  return (
    <ThemeProvider>
      <Helmet>
        <title>CloudCRM - Modern CRM Platform</title>
        <meta
          name="description"
          content="Enterprise-grade CRM for small to mid-sized teams with real-time collaboration, automation, and analytics"
        />
      </Helmet>
      <DataProvider>
        <Routes>

  {/* AUTH ROUTES */}
  <Route
    path="/login"
    element={!user ? <LoginPage /> : <Navigate to="/" />}
  />
  <Route
    path="/signup"
    element={!user ? <SignupPage /> : <Navigate to="/" />}
  />

  {/* PROTECTED APP ROUTES */}
  <Route
    path="/"
    element={user ? <DashboardLayout /> : <Navigate to="/login" />}
  >
    {/* All employee nested routes */}
    {Emp1Routes}
    {Emp2Routes}
    {Emp3Routes}
    {Emp4Routes}
    {Emp5Routes}
  </Route>

</Routes>

      </DataProvider>
    </ThemeProvider>
  );
}

export default App;
