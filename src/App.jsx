import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useAuth } from "@/contexts/AuthContext";
import LoginPage from "@/pages/LoginPage";
import DashboardLayout from "@/layouts/DashboardLayout";
import DashboardPage from "@/pages/DashboardPage";
import LeadsPage from "@/pages/LeadsPage";
import AccountsPage from "@/pages/AccountsPage";
import ContactsPage from "@/pages/ContactsPage";
import DealsPage from "@/pages/DealsPage";
import TicketsPage from "@/pages/TicketsPage";
import ProductsPage from "@/pages/ProductsPage";
import QuotesPage from "@/pages/QuotesPage";
import ReportsPage from "@/pages/ReportsPage";
import WorkflowsPage from "@/pages/WorkflowsPage";
import WorkflowBuilderPage from "@/pages/WorkflowBuilderPage";
import SettingsPage from "@/pages/SettingsPage";
import CalendarPage from "@/pages/CalendarPage";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { DataProvider } from "@/contexts/DataContext";
import SignupPage from "./pages/SignUp";
import TasksPage from "@/pages/activities/TasksPage";
import MeetingsPage from "@/pages/activities/MeetingsPage";
import CallsPage from "@/pages/activities/CallsPage";
import ActivitiesPage from "@/pages/activities/ActivitiesPage";
import DocumentPage from "@/pages/Document";
import CampaignsPage from "@/pages/Campaigns";
import Forecasts from "@/pages/Forecasts";

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
          <Route
            path="/login"
            element={!user ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route path="/signup" element={<SignupPage />} />

          <Route
            path="/"
            element={user ? <DashboardLayout /> : <Navigate to="/login" />}
          >
            <Route index element={<DashboardPage />} />
            <Route path="leads" element={<LeadsPage />} />
            <Route path="accounts" element={<AccountsPage />} />
            <Route path="contacts" element={<ContactsPage />} />
            <Route path="deals" element={<DealsPage />} />
            <Route path="tickets" element={<TicketsPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="quotes" element={<QuotesPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="workflows" element={<WorkflowsPage />} />
            <Route
              path="workflows/builder/:id"
              element={<WorkflowBuilderPage />}
            />
            <Route path="workflows/builder" element={<WorkflowBuilderPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="documents" element={<DocumentPage />} />
            <Route path="campaigns/*" element={<CampaignsPage />} />
            <Route path="/forecasts" element={<Forecasts />} />
            <Route path="activities" element={<ActivitiesPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="meetings" element={<MeetingsPage />} />
            <Route path="calls" element={<CallsPage />} />
          </Route>
        </Routes>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;
