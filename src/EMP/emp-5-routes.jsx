import React from "react";
import { Route } from "react-router-dom";
import SalesOrderReportsPage from "@/components/reports/SalesOrderReportspage";
import PurchaseOrderReportsPage from "@/components/reports/PurchaseOrderReportspage";
import InvoiceReportsPage from "@/components/reports/InvoiceReportspage";
import SalesMetricsReportsPage from "@/components/reports/SalesMetricsReportsPage";
import EmailReportsPage from "@/components/reports/EmailReportspage";
import MeetingReportsPage from "@/components/reports/MeetingReportspage";
import OrgOverviewPage from "@/components/analytics/OrgOverview";
import LeadAnalytics from "@/components/analytics/LeadAnalytics";
import DealInsights from "@/components/analytics/DealInsights";
import MarketingMetrics from "@/components/analytics/MarketingMetrics";
import SalesTrend from "@/components/analytics/SalesTrend";
import ActivityStats from "@/components/analytics/ActivityStats";

const Emp5Routes = (
  <>
    {/* More Reports Routes */}
    <Route path="/reports/sales-orders" element={<SalesOrderReportsPage />} />
    <Route
      path="/reports/purchase-orders"
      element={<PurchaseOrderReportsPage />}
    />
    <Route path="/reports/invoices" element={<InvoiceReportsPage />} />
    <Route
      path="/reports/sales-metrics"
      element={<SalesMetricsReportsPage />}
    />
    <Route path="/reports/email" element={<EmailReportsPage />} />
    <Route path="/reports/meetings" element={<MeetingReportsPage />} />

    {/* Analytics Routes */}
    <Route path="/analytics/org" element={<OrgOverviewPage />} />
    <Route path="/analytics/lead-analytics" element={<LeadAnalytics />} />
    <Route path="/analytics/deal-insights" element={<DealInsights />} />
    <Route path="/analytics/marketing-metrics" element={<MarketingMetrics />} />
    <Route path="/analytics/sales-trend" element={<SalesTrend />} />
    <Route path="/analytics/activity-stats" element={<ActivityStats />} />
  </>
);

export default Emp5Routes;
