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
import DocumentPage from "@/pages/Document";
import CampaignsPage from "@/pages/Campaigns";
import Forecasts from "@/pages/Forecasts";
import PriceBooks from "./pages/PriceBooks";
import CreatePriceBook from "./components/CreatePriceBookModal";
import Quotes from "./pages/Quotes";
import CreateQuote from "./pages/CreateQuote";
import SalesOrders from "./pages/SalesOrders";
import CreateSalesOrder from "./pages/CreateSalesOrder";
import PurchaseOrders from "./pages/PurchaseOrders";
import CreatePurchaseOrder from "./pages/CreatePurchaseOrder";
import Invoices from "./pages/Invoices";
import CasesPage from "@/pages/CasesPage";
import SolutionsPage from "@/pages/SolutionsPage";
import SalesInboxPage from "@/pages/SalesInboxPage";
import SocialPage from "./pages/SocialPage";
import VisitsPage from "@/pages/VisitsPage";

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
            <Route path="price-books" element={<PriceBooks />} />
            <Route path="create-price-book" element={<CreatePriceBook />} />
            <Route path="quotes" element={<Quotes />} />
            <Route path="create-quote" element={<CreateQuote />} />
            <Route path="sales-orders" element={<SalesOrders />} />
            <Route path="create-sales-order" element={<CreateSalesOrder />} />
            <Route path="purchase-orders" element={<PurchaseOrders />} />
            <Route
              path="create-purchase-order"
              element={<CreatePurchaseOrder />}
            />
            <Route path="invoives" element={<Invoices />} />{" "}
            <Route path="documents" element={<DocumentPage />} />
            <Route path="campaigns/*" element={<CampaignsPage />} />
            <Route path="/forecasts" element={<Forecasts />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="meetings" element={<MeetingsPage />} />
            <Route path="calls" element={<CallsPage />} />
            <Route path="cases" element={<CasesPage />} />
            <Route path="solutions" element={<SolutionsPage />} />
            <Route path="sales-inbox" element={<SalesInboxPage />} />
            <Route path="social" element={<SocialPage />} />
            <Route path="visits" element={<VisitsPage />} />{" "}
          </Route>
        </Routes>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;
