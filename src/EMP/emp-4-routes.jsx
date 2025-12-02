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
import InvoiceReportsPage from "@/components/reports/InvoiceReportspage";
import CreateInvoice from "@/pages/files/inventory/CreateInvoice";
import CreateQuote from "@/pages/files/inventory/CreateQuote";
import PurchaseOrderReportsPage from "@/components/reports/PurchaseOrderReportspage";
import CreatePurchaseOrder from "@/pages/files/inventory/CreatePurchaseOrder";
import SalesOrderReportsPage from "@/components/reports/SalesOrderReportspage";
import OrgOverviewPage from "@/components/analytics/OrgOverview";

const Emp4Routes = (
  <>
    {/* Reports Routes */}
    <Route path="/reports/all" element={<AllReportsPage />} />
    <Route path="/reports/favorites" element={<FavoritesPage />} />
    <Route path="/reports/recent" element={<RecentlyViewedPage />} />
    <Route path="/reports/scheduled" element={<ScheduledReportsPage />} />
    <Route path="/reports/deleted" element={<RecentlyDeletedPage />} />
    <Route path="/reports/accounts" element={<AccountReportsPage />} />
    <Route path="/reports/deals" element={<DealReportsPage />} />
    <Route path="/reports/leads" element={<LeadReportsPage />} />
    <Route path="/reports/campaigns" element={<CampaignReportsPage />} />
    <Route path="/reports/cases" element={<CaseSolutionReportsPage />} />
    <Route path="/reports/products" element={<ProductReportsPage />} />
    <Route path="/reports/vendors" element={<VendorReportsPage />} />
    <Route path="/reports/quotes" element={<QuoteReportsPage />} />

    {/* Inventory Report Routes */}
    <Route path="/invoices" element={<InvoiceReportsPage />} />
    <Route path="/create-invoice" element={<CreateInvoice />} />
    <Route path="/quotes" element={<QuoteReportsPage />} />
    <Route path="/create-quote" element={<CreateQuote />} />
    <Route path="/purchase-orders" element={<PurchaseOrderReportsPage />} />
    <Route path="/create-purchase-order" element={<CreatePurchaseOrder />} />
    <Route path="/price-books" element={<ProductReportsPage />} />
    <Route path="/vendors" element={<VendorReportsPage />} />
    <Route path="/sales-orders" element={<SalesOrderReportsPage />} />

    {/* Analytics Route */}
    <Route path="/" element={<OrgOverviewPage />} />
  </>
);

export default Emp4Routes;
