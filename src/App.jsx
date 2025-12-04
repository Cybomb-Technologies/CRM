import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { DataProvider } from "@/contexts/DataContext";

// Auth Pages
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignUp";

// Layout
import DashboardLayout from "@/layouts/DashboardLayout";

// Dashboard
import DashboardPage from "@/pages/DashboardPage";

// Sales Pages
import LeadsPage from "@/pages/files/sales/LeadsPage";
import AccountsPage from "@/pages/files/sales/AccountsPage";
import ContactsPage from "@/pages/files/sales/ContactsPage";
import DealsPage from "@/pages/files/sales/DealsPage";
import DocumentPage from "@/pages/files/sales/Document";
import CampaignsPage from "@/pages/files/sales/Campaigns";
import Forecasts from "@/pages/files/sales/Forecasts";

import SalesOrdersPage from '@/pages/files/inventory/SalesOrdersPage';


// Inventory Pages
import Invoices from "@/pages/files/inventory/Invoices";
// import CreateInvoice from "@/pages/files/inventory/CreateInvoice";
// import Quotes from "./components/files/inventory/quotes/Quote";
// import CreateQuote from "@/pages/files/inventory/CreateQuote";
// import PurchaseOrders from "@/pages/files/inventory/PurchaseOrders";
import CreatePurchaseOrderForm from "./components/files/inventory/purchaseorders/CreatePurchaseOrderForm";

// Activities Pages
import TasksPage from "@/pages/files/activities/TasksPage";
import MeetingsPage from "@/pages/files/activities/MeetingsPage";
import CallsPage from "@/pages/files/activities/CallsPage";

// Support Pages
import CasesPage from "@/pages/files/support/CasesPage";
import SolutionsPage from "@/pages/files/support/SolutionsPage";

// Integrations Pages
import SalesInboxPage from "@/pages/files/integrations/SalesInboxPage";
import SocialPage from "@/pages/files/integrations/SocialPage";
import VisitsPage from "@/pages/files/integrations/VisitsPage";

// Other Pages
import TicketsPage from "@/pages/TicketsPage";
import ProductsPage from "@/pages/files/inventory/ProductsPage";
// import CreateProductPage from "@/pages/files/inventory/products/CreateProductPage";
// import EditProductPage from "@/pages/files/inventory/products/EditProductPage";

// import PriceBooks from "./components/files/inventory/pricebooks/PriceBooks";
// import CreatePriceBook from "@/pages/files/inventory/pricebooks/CreatePriceBook";
// import EditPriceBookPage from "@/pages/files/inventory/pricebooks/EditPriceBookPage";

// import Quote from "./components/files/inventory/quotes/Quote"; // Main quotes list page
// import CreateQuotePage from "./components/files/inventory/quotes/CreateQuotePage"; // Create quote page
// import EditQuotePage from "./components/files/inventory/quotes/EditQuotePage"; // Edit quote page
// import ViewQuotePage from "./components/files/inventory/quotes/ViewQuotePage"; // View quote page
// import CreateQuoteForm from "@/components/files/inventory/quotes/CreateQuoteForm"; 
import CreateQuotePage from "@/components/files/inventory/quotes/CreateQuotePage"; // Form component
import QuotesPage from "@/pages/files/inventory/QuotesPage";


// import SalesOrders from "./components/files/inventory/salesorders/SalesOrders";
// // import CreateSalesOrder from "@/pages/files/inventory/salesorder/CreateSalesOrder";
// // import EditSalesOrder from "@/pages/files/inventory/salesorder/EditSalesOrder";
// // import SalesOrders from "@/pages/files/inventory/salesorder/SalesOrders";


// import ReportsPage from "@/pages/ReportsPage";
import WorkflowsPage from "@/pages/WorkflowsPage";
import WorkflowBuilderPage from "@/pages/WorkflowBuilderPage";
import SettingsPage from "@/pages/SettingsPage";
import CalendarPage from "@/pages/CalendarPage";
import Vendors from "@/pages/Vendors";
import CreateVendor from "@/pages/CreateVendor";

import { useInvoiceForm } from "./hooks/useInvoiceForm";
import { usePOForm } from "./hooks/usePOForm";
import { usePOStorage } from "./hooks/usePOStorage";
import { useQuoteForm } from "./hooks/useQuoteForm";
import { useQuoteStorage } from "./hooks/useQuoteStorage";


import ReportsPage from "./pages/reports/ReportsPage";



import OrgOverviewPage from "./components/analytics/OrgOverview";
import LeadAnalytics from "./components/analytics/LeadAnalytics";
import DealInsights from "./components/analytics/DealInsights";
import MarketingMetrics from "./components/analytics/MarketingMetrics";
import SalesTrend from "./components/analytics/SalesTrend";
import ActivityStats from "./components/analytics/ActivityStats";
import Approvals from "./components/requests/Approvals";
import SubmittedRequests from "./components/requests/SubmittedRequests";
import PendingRequests from "./components/requests/PendingRequests";
import PriceBooksPage from "./pages/files/inventory/PriceBooksPage";
// import QuotesPage from "./pages/files/inventory/QuotesPage";
import PurchaseOrdersPage from "./pages/files/inventory/PurchaseOrdersPage";
import CreateInvoiceContent from "./components/files/inventory/invoices/CreateInvoiceContent";

// import MyReportsPage from "./components/reports/MyReportsPage";
import FavoritesPage from "./components/reports/FavoritesPage";
import RecentlyViewedPage from "./components/reports/RecentlyViewedPage";
import ScheduledReportsPage from "./components/reports/ScheduledReports";
import RecentlyDeletedPage from "./components/reports/RecentlyDeleted";
import AccountReportsPage from "./components/reports/AccountandContactReports";
import DealReportsPage from "./components/reports/DealReportsPage";
import LeadReportsPage from "./components/reports/LeadReportsPage";
import CampaignReportsPage from "./components/reports/CampaignReportspage";
import CaseSolutionReportsPage from "./components/reports/Case&SolutionReportspage";
import ProductReportsPage from "./components/reports/ProductReportsPage";
import VendorReportsPage from "./components/reports/VendorReportspage";
import QuoteReportsPage from "./components/reports/QuoteReportspage";
import SalesOrderReportsPage from "./components/reports/SalesOrderReportspage";
import PurchaseOrderReportsPage from "./components/reports/PurchaseOrderReportspage";
import InvoiceReportsPage from "./components/reports/InvoiceReportspage";
import SalesMetricsReportsPage from "./components/reports/SalesMetricsReportsPage";
import EmailReportsPage from "./components/reports/EmailReportspage";
import MeetingReportsPage from "./components/reports/MeetingReportspage";

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
          {/* Auth Routes */}
          <Route
            path="/login"
            element={!user ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!user ? <SignupPage /> : <Navigate to="/" />}
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={user ? <DashboardLayout /> : <Navigate to="/login" />}
          >
            {/* Dashboard */}
            <Route index element={<DashboardPage />} />

            {/* Sales Routes */}
            <Route path="leads" element={<LeadsPage />} />
            <Route path="accounts" element={<AccountsPage />} />
            <Route path="contacts" element={<ContactsPage />} />
            <Route path="deals" element={<DealsPage />} />
            <Route path="documents" element={<DocumentPage />} />
            <Route path="campaigns/*" element={<CampaignsPage />} />
            <Route path="forecasts" element={<Forecasts />} />

            {/* Inventory Routes */}
            <Route path="/invoices" element={<Invoices/>} />
            <Route path="/create-invoice" element={<CreateInvoiceContent />} />
            <Route path="/quotes" element={< QuotesPage/>} />
            <Route path="/create-quote" element={<CreateQuotePage />} />
            <Route path="/purchase-orders" element={<PurchaseOrdersPage/>} />
            <Route path="/create-purchase-order" element={<CreatePurchaseOrderForm />} />
            <Route path="/vendors/*" element={<Vendors/>}/>
            <Route path="/sales-orders" element={<SalesOrdersPage/>}/>

            {/* <Route path="reports" element={<ReportsPage/>}/>
            <Route path="/reports" element={<ReportsPage />} />
<Route path="/reports/:folder" element={<ReportsPage />} /> */}
              <Route path="/reports/all" element={<ReportsPage />} />
              <Route path="/reports/favorites" element={<FavoritesPage />} />
              <Route path="/reports/recent" element={<RecentlyViewedPage />} />
              <Route path="/reports/scheduled" element={<ScheduledReportsPage/>}/>
              <Route path="/reports/deleted" element={<RecentlyDeletedPage/>}/>
              <Route path="/reports/accounts" element={<AccountReportsPage/>}/>
              <Route path="/reports/deals" element={<DealReportsPage/>}/>
              <Route path="/reports/leads" element={<LeadReportsPage/>}/>
              <Route path="/reports/campaigns" element={<CampaignReportsPage/>}/>
              <Route path="/reports/cases" element={<CaseSolutionReportsPage/>}/> 
              <Route path="/reports/products" element={<ProductReportsPage/>}/>
              <Route path="/reports/vendors" element={<VendorReportsPage/>}/>
              <Route path="/reports/quotes" element={<QuoteReportsPage/>}/>
              <Route path="/reports/sales-orders" element={<SalesOrderReportsPage/>}/>
              <Route path="/reports/purchase-orders" element={<PurchaseOrderReportsPage/>}/>
              <Route path="/reports/invoices" element={<InvoiceReportsPage/>}/>
              <Route path="/reports/sales-metrics" element={<SalesMetricsReportsPage/>}/>
              <Route path="/reports/email" element={<EmailReportsPage/>}/>
              <Route path="/reports/meetings" element={<MeetingReportsPage/>}/>





            {/* Activities Routes */}
            <Route path="tasks" element={<TasksPage />} />
            <Route path="meetings" element={<MeetingsPage />} />
            <Route path="calls" element={<CallsPage />} />

            {/* Support Routes */}
            <Route path="cases" element={<CasesPage />} />
            <Route path="solutions" element={<SolutionsPage />} />

            {/* Integrations Routes */}
            <Route path="sales-inbox" element={<SalesInboxPage />} />
            <Route path="social" element={<SocialPage />} />
            <Route path="visits" element={<VisitsPage />} />

            {/* Other Routes */}
            <Route path="tickets" element={<TicketsPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="workflows" element={<WorkflowsPage />} />
            <Route path="workflows/builder/:id" element={<WorkflowBuilderPage />} />
            <Route path="workflows/builder" element={<WorkflowBuilderPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="vendors" element={<Vendors />} />
            <Route path="create-vendor" element={<CreateVendor />} />

            <Route path="use-invoice-form" element={<useInvoiceForm/>}/>
            {/* <Route path="use-po-form" element={<usePOForm/>}/>
            <Route path="use-po-storage" element={<usePOStorage/>}/>
            <Route path="use-quote-form" element={<useQuoteForm/>}/>
            <Route path="use-quote-storage" element={<useQuoteStorage/>}/> */}

            

              <Route path="/" element={<OrgOverviewPage />} />
              <Route path="/analytics/org" element={<OrgOverviewPage />} />
              <Route path="/analytics/lead-analytics" element={<LeadAnalytics/>}/>
              <Route path="/analytics/deal-insights" element={<DealInsights/>}/>
              <Route path="/analytics/marketing-metrics" element={<MarketingMetrics/>}/>
              <Route path="/analytics/sales-trend" element={<SalesTrend/>}/>
              <Route path="/analytics/activity-stats" element={<ActivityStats/>}/>

              <Route path="/requests/approvals" element={<Approvals/>}/>
              <Route path="/requests/submitted" element={<SubmittedRequests/>}/>
              <Route path="/requests/pending" element={<PendingRequests/>}/>
              
              <Route path="products" element={<ProductsPage />} />
              {/* <Route path="products/create" element={<CreateProductPage />} />
              <Route path="products/edit/:productId" element={<EditProductPage />} /> */}

              <Route path="price-books" element={<PriceBooksPage />} />
              {/* <Route path="price-books/create" element={<CreatePriceBook />} />
              <Route path="price-books/edit/:priceBookId" element={<EditPriceBookPage />} /> */}
              
              {/* // Quotes routes
<Route path="/quotes" element={<QuotesPage />} />
<Route path="/quotes/create" element={<CreateQuote />} />
<Route path="/quotes/create" element={<CreateQuotePage />} />
<Route path="/quotes/edit/:quoteId" element={<EditQuotePage />} />
<Route path="/quotes/view/:quoteId" element={<ViewQuotePage />} /> */}
              <Route path="/quotes/*" element={<QuotesPage />} />
              


              {/* <Route path="/sales-orders" element={<SalesOrders/>} /> */}
        {/* <Route path="/create-sales-order" element={<CreateSalesOrder />} />
        <Route path="/edit-sales-order/:id" element={<EditSalesOrder />} /> */}
        <Route path="sales-orders" element={<SalesOrdersPage />} />

        <Route path="/reports/*" element={<ReportsPage />} />
      {/* <Route path="/reports/:folder" element={<ReportsPage />} />
      <Route path="/reports/view/:reportId" element={<ReportDetailPage />} /> */}

          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;