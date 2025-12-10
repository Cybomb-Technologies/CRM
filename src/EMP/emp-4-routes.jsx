import React from "react";
import { Route } from "react-router-dom";
import AllReportsPage from "@/pages/reports/AllReportsPage";
import FavoritesPage from "@/components/reports/FavoritesPage";
import RecentlyViewedPage from "@/components/reports/RecentlyViewedPage";
import ScheduledReportsPage from "@/components/reports/ScheduledReports";
import RecentlyDeletedPage from "@/components/reports/RecentlyDeleted";
import AccountReportsPage from "@/components/reports/AccountandContactReports";
import DealReportsPage from "@/components/reports/DealReportsPage";
import LeadReportsPage from "@/components/reports/LeadReportsPage";
import CampaignReportsPage from "@/components/reports/CampaignReportspage";
import CaseSolutionReportsPage from "@/components/reports/Case&SolutionReportspage";
import ProductReportsPage from "@/components/reports/ProductReportsPage";
import VendorReportsPage from "@/components/reports/VendorReportspage";
import QuoteReportsPage from "@/components/reports/QuoteReportspage";
import Invoices from "@/pages/files/inventory/Invoices";
import QuotesPage from "@/pages/files/inventory/QuotesPage";
import CreatePurchaseOrderForm from "@/components/files/inventory/purchaseorders/CreatePurchaseOrderForm";
import PurchaseOrdersPage from "@/pages/files/inventory/PurchaseOrdersPage";
import OrgOverviewPage from "@/components/analytics/OrgOverview";
import SalesOrdersPage from "@/pages/files/inventory/SalesOrdersPage";
import PriceBooksPage from "@/pages/files/inventory/PriceBooksPage";
import CreateInvoiceContent from "@/components/files/inventory/invoices/CreateInvoiceContent";
import MyReportsPage from "@/pages/reports/MyReportsPage";
import Approvals from "@/pages/requests/Approvals";
import PendingRequests from "@/pages/requests/PendingRequests";
import SubmittedRequests from "@/pages/requests/SubmittedRequests";

const Emp4Routes = (
  <>
    {/* Reports Routes */}
    <Route path="reports/all" element={<AllReportsPage />} />
    <Route path="reports/my-reports" element={<MyReportsPage />} />
    <Route path="reports/favorites" element={<FavoritesPage />} />
    <Route path="reports/recent" element={<RecentlyViewedPage />} />
    <Route path="reports/scheduled" element={<ScheduledReportsPage />} />
    <Route path="reports/deleted" element={<RecentlyDeletedPage />} />
    <Route path="reports/accounts" element={<AccountReportsPage />} />
    <Route path="reports/deals" element={<DealReportsPage />} />
    <Route path="reports/leads" element={<LeadReportsPage />} />
    <Route path="reports/campaigns" element={<CampaignReportsPage />} />
    <Route path="reports/cases" element={<CaseSolutionReportsPage />} />
    <Route path="reports/products" element={<ProductReportsPage />} />
    <Route path="reports/vendors" element={<VendorReportsPage />} />
    <Route path="reports/quotes" element={<QuoteReportsPage />} />

    {/* Inventory Report Routes */}
    <Route path="invoices" element={<Invoices />} />
    <Route path="create-invoice" element={<CreateInvoiceContent />} />
    <Route path="quotes" element={<QuotesPage />} />
    <Route path="purchase-orders" element={<PurchaseOrdersPage />} />
    <Route path="create-purchase-order" element={<CreatePurchaseOrderForm />} />
    <Route path="price-books" element={<PriceBooksPage />} />
    <Route path="vendors" element={<VendorReportsPage />} />
    <Route path="sales-orders" element={<SalesOrdersPage />} />

    {/* Requests */}
    <Route path="requests/approvals" element={<Approvals />} />
    <Route path="requests/pending" element={<PendingRequests />} />
    <Route path="requests/submitted" element={<SubmittedRequests />} />

    {/* Analytics Route */}
    <Route index element={<OrgOverviewPage />} />
  </>
);

export default Emp4Routes;
