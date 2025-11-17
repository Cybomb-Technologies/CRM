// src/components/layout/Sidebar.jsx
//
// Single-file Sidebar containing LEFT mini icon bar + RIGHT dynamic panel.
// Each mini icon shows its own right-side panel (Modules, Reports, Analytics,
// Dashboards, My Requests, Marketplace, Search Records, Ask Zia).
//
// Dependencies: react, react-router-dom (NavLink), framer-motion, lucide-react,
// tailwindcss for styling.
//
// Copy-paste this entire file into: src/components/layout/Sidebar.jsx

import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Folder,
  PieChart,
  BarChart3,
  TrendingUp,
  ClipboardList,
  Layers,
  Search,
  Sparkles,
  Plus,
  Calendar,
  Bell,
  Settings,
  Home,
  Users,
  UserCircle,
  Building2,
  Target,
  FileText,
  Phone,
  Package,
  ChevronDown,
  Star,
  Grid,
  Activity,
  File,
  Download,
  Zap,
  CheckCircle,
} from "lucide-react";

// Utility: classNames
const cn = (...classes) => classes.filter(Boolean).join(" ");

/**
 * Data for panels
 * Keeps content simple and editable.
 */

const modulesPanelData = {
  title: "Modules",
  groups: [
    { header: null, items: [{ name: "Home", path: "/home", icon: Home }] },
    {
      header: "Sales",
      key: "sales",
      items: [
        { name: "Leads", path: "/leads", icon: Users },
        { name: "Contacts", path: "/contacts", icon: UserCircle },
        { name: "Accounts", path: "/accounts", icon: Building2 },
        { name: "Deals", path: "/deals", icon: Target },
        { name: "Forecasts", path: "/forecasts", icon: Calendar },
        { name: "Documents", path: "/documents", icon: FileText },
        { name: "Campaigns", path: "/campaigns", icon: Target },
      ],
    },
    {
      header: "Activities",
      key: "activities",
      items: [
        { name: "All Activities", path: "/activities", icon: Calendar },
        { name: "Tasks", path: "/tasks", icon: CheckCircle }, // Use appropriate icon
        { name: "Meetings", path: "/meetings", icon: Calendar },
        { name: "Calls", path: "/calls", icon: Phone },
      ],
    },
    {
      header: "Inventory",
      key: "inventory",
      items: [
        { name: "Products", path: "/products", icon: Package },
        { name: "Price Books", path: "/price-books", icon: FileText },
        
        { name: "Quotes", path: "/quotes", icon: FileText },
        { name: "Sales Orders", path: "/sales-orders", icon: FileText },
        { name: "Purchase Orders", path: "/purchase-orders", icon: FileText },
        { name: "Invoices", path: "/invoices", icon: FileText },
        { name: "Vendors", path: "/vendors", icon: Building2 },
      ],
    },
  ],
};

const reportsPanelData = {
  title: "Reports",
  groups: [
    {
      header: null,
      items: [
        { name: "All Reports", path: "/reports/all", icon: File },
        { name: "Analytics", path: "/reports/analytics", icon: Activity },
        { name: "Favorites", path: "/reports/favorites", icon: Star },
        { name: "Recently Viewed", path: "/reports/recent", icon: Grid },
        {
          name: "Scheduled Reports",
          path: "/reports/scheduled",
          icon: Calendar,
        },
        {
          name: "Recently Deleted",
          path: "/reports/deleted",
          icon: TrashStub(),
        },
      ],
    },
    {
      header: "By Module",
      key: "by-module",
      items: [
        {
          name: "Account and Contact Reports",
          path: "/reports/accounts",
          icon: Building2,
        },
        { name: "Deal Reports", path: "/reports/deals", icon: Target },
        { name: "Lead Reports", path: "/reports/leads", icon: Users },
        { name: "Campaign Reports", path: "/reports/campaigns", icon: Target },
        {
          name: "Case and Solution Reports",
          path: "/reports/cases",
          icon: FileText,
        },
        { name: "Product Reports", path: "/reports/products", icon: Package },
        { name: "Vendor Reports", path: "/reports/vendors", icon: Building2 },
        { name: "Quote Reports", path: "/reports/quotes", icon: FileText },
        {
          name: "Sales Order Reports",
          path: "/reports/sales-orders",
          icon: FileText,
        },
        {
          name: "Purchase Order Reports",
          path: "/reports/purchase-orders",
          icon: FileText,
        },
        { name: "Invoice Reports", path: "/reports/invoices", icon: FileText },
      ],
    },
  ],
};

const analyticsPanelData = {
  title: "Analytics",
  groups: [
    {
      header: null,
      items: [
        { name: "Tables", path: "/analytics/tables", icon: Grid },
        { name: "Charts", path: "/analytics/charts", icon: BarChart3 },
        { name: "Pivot Tables", path: "/analytics/pivots", icon: File },
        { name: "KPI Widgets", path: "/analytics/kpis", icon: Zap },
      ],
    },
  ],
};

const dashboardsPanelData = {
  title: "Dashboards",
  groups: [
    {
      header: null,
      items: [
        { name: "Org Overview", path: "/dashboards/org", icon: Activity },
        { name: "Lead Analytics", path: "/dashboards/leads", icon: Users },
        { name: "Deal Insights", path: "/dashboards/deals", icon: Target },
        {
          name: "Marketing Metrics",
          path: "/dashboards/marketing",
          icon: FileText,
        },
        {
          name: "Sales Trend",
          path: "/dashboards/sales-trend",
          icon: TrendingUp,
        },
        {
          name: "Activity Stats",
          path: "/dashboards/activity",
          icon: Calendar,
        },
      ],
    },
  ],
};

const requestsPanelData = {
  title: "My Requests",
  groups: [
    {
      header: null,
      items: [
        { name: "Approvals", path: "/requests/approvals", icon: ClipboardList },
        { name: "Submitted Requests", path: "/requests/submitted", icon: File },
        {
          name: "Pending Requests",
          path: "/requests/pending",
          icon: ClockStub(),
        },
      ],
    },
  ],
};

const marketplacePanelData = {
  title: "Marketplace",
  groups: [
    {
      header: "Integrations",
      key: "integrations",
      items: [
        { name: "Zoho", path: "/marketplace/zoho", icon: Layers },
        { name: "Google", path: "/marketplace/google", icon: Download },
        { name: "Microsoft", path: "/marketplace/microsoft", icon: Download },
        { name: "Facebook", path: "/marketplace/facebook", icon: Download },
        { name: "LinkedIn", path: "/marketplace/linkedin", icon: Download },
      ],
    },
    {
      header: "Marketplace",
      key: "marketplace",
      items: [
        { name: "All", path: "/marketplace/all", icon: Layers },
        { name: "Installed", path: "/marketplace/installed", icon: Star },
        { name: "Updates", path: "/marketplace/updates", icon: Download },
      ],
    },
  ],
};

const searchPanelData = {
  title: "Search Records",
  groups: [
    {
      header: null,
      items: [
        // For demonstration: quick links
        { name: "Search People", path: "/search/people", icon: Users },
        { name: "Search Deals", path: "/search/deals", icon: Target },
        { name: "Search Accounts", path: "/search/accounts", icon: Building2 },
        { name: "Advanced Search...", path: "/search/advanced", icon: Search },
      ],
    },
  ],
};

const ziaPanelData = {
  title: "Ask Zia",
  groups: [
    {
      header: null,
      items: [
        { name: "Start Chat", path: "/zia/chat", icon: Sparkles },
        { name: "Suggested Insights", path: "/zia/suggestions", icon: Star },
        { name: "Setup Alerts", path: "/zia/alerts", icon: Bell },
      ],
    },
  ],
};

/* ---------- small icon helpers (inline fallback icons) ---------- */
function TrashStub() {
  // simple JS object to be used like an icon component in lists (lucide is preferred)
  return (props) => (
    <svg {...props} viewBox="0 0 24 24" className="w-4 h-4">
      <path
        fill="currentColor"
        d="M9 3h6l1 2h5v2H3V5h5l1-2zM6 9h12v11a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9z"
      />
    </svg>
  );
}
function ClockStub() {
  return (props) => (
    <svg {...props} viewBox="0 0 24 24" className="w-4 h-4">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2zm1 11H7v-2h4V7h2v6z"
      />
    </svg>
  );
}

/* ---------- Sidebar Component ---------- */

export default function Sidebar({ open, setOpen }) {
  // activeMini controls which panel shows on the right
  const [activeMini, setActiveMini] = useState("modules");
  const [activeItem, setActiveItem] = useState("/home");
  const [expanded, setExpanded] = useState({
    sales: true,
    activities: true,
    inventory: true,
    "by-module": true,
    integrations: true,
    marketplace: true,
  });

  if (!open) return null;

  // map id -> data for panels
  const panels = {
    modules: modulesPanelData,
    reports: reportsPanelData,
    analytics: analyticsPanelData,
    dashboards: dashboardsPanelData,
    requests: requestsPanelData,
    marketplace: marketplacePanelData,
    search: searchPanelData,
    zia: ziaPanelData,
  };

  // mini icons ordered to match screenshots
  const miniIcons = [
    { id: "modules", icon: Folder, label: "Modules" },
    { id: "reports", icon: PieChart, label: "Reports" },
    { id: "analytics", icon: BarChart3, label: "Analytics" },
    { id: "dashboards", icon: TrendingUp, label: "Dashboards" },
    { id: "requests", icon: ClipboardList, label: "My Requests" },
    { id: "marketplace", icon: Layers, label: "Marketplace" },
    { id: "search", icon: Search, label: "Search Records" },
    { id: "zia", icon: Sparkles, label: "Ask Zia" },
    // extras shown in the mini bar (create, calendar, notifications, settings)
    { id: "create", icon: Plus, label: "Create" },
    { id: "calendar", icon: Calendar, label: "Calendar" },
    { id: "notifications", icon: Bell, label: "Notifications" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  // panel animation variants
  const panelVariants = {
    hidden: { opacity: 0, x: -12 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -12 },
  };

  // small helper to render group header button with collapse behavior
  const GroupHeader = ({ header, keyName }) => {
    if (!header) return null;
    return (
      <button
        onClick={() =>
          setExpanded((prev) => ({ ...prev, [keyName]: !prev[keyName] }))
        }
        className="flex items-center justify-between w-full text-xs text-gray-300 uppercase tracking-wide mb-2"
      >
        {header}
        <ChevronDown
          className={cn(
            "w-4 h-4 transition-transform",
            expanded[keyName] ? "rotate-0" : "-rotate-90"
          )}
        />
      </button>
    );
  };

  // right panel render
  const RightPanel = ({ panelKey, panelData }) => {
    if (!panelData) return null;

    return (
      <motion.aside
        key={panelKey}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={panelVariants}
        transition={{ duration: 0.18 }}
        className="w-72 bg-[#11233f] text-white border-r border-white/10 flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-start justify-between">
            <h2 className="text-lg font-semibold">{panelData.title}</h2>

            {/* quick mini-actions on header (only for some panels) */}
            <div className="flex items-center gap-2">
              {panelKey === "reports" && (
                <button className="text-gray-300 text-sm px-2 py-1 rounded hover:bg-white/5">
                  New Report
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="text-gray-300 hover:text-white"
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>

          {/* search inside header */}
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={
                panelKey === "search"
                  ? "Global search..."
                  : `Search ${panelData.title}`
              }
              className="w-full py-2 pl-10 pr-3 bg-white/10 rounded-lg text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Scroll Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {panelData.groups.map((group, gi) => (
            <div key={gi} className="mb-5">
              <GroupHeader
                header={group.header}
                keyName={group.key || `g${gi}`}
              />

              <AnimatePresence initial={false}>
                {/* only show items if no header (always show) or expanded */}
                {(group.header === null || expanded[group.key || `g${gi}`]) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-1"
                  >
                    {group.items.map((item, idx) => {
                      const Icon = item.icon;
                      // some items might provide a raw component (like stub)
                      const renderedIcon =
                        typeof Icon === "function" ? (
                          <Icon className="w-4 h-4 mr-3" />
                        ) : (
                          <Icon className="w-4 h-4 mr-3" />
                        );

                      return (
                        <NavLink
                          key={item.path + idx}
                          to={item.path}
                          onClick={() => setActiveItem(item.path)}
                          className={({ isActive }) =>
                            cn(
                              "flex items-center px-3 py-2 rounded-lg text-sm transition-all",
                              isActive || activeItem === item.path
                                ? "bg-blue-500 text-white"
                                : "text-gray-300 hover:bg-white/10 hover:text-white"
                            )
                          }
                        >
                          {renderedIcon}
                          {item.name}
                        </NavLink>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Footer area - workspace selector */}
        <div className="p-3 border-t border-white/5">
          <div className="bg-[#0b2540] rounded-md p-2 text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center text-xs">
                CT
              </div>
              <div>
                <div className="text-xs font-semibold">CRM Teamspace</div>
                <div className="text-[11px] text-gray-400">Workspace</div>
              </div>
            </div>
            <div className="text-gray-300">▾</div>
          </div>
        </div>
      </motion.aside>
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: -320 }}
          animate={{ x: 0 }}
          exit={{ x: -320 }}
          transition={{ type: "spring", damping: 22, stiffness: 200 }}
          className="flex h-screen"
        >
          {/* LEFT MINI ICON BAR */}
          <aside className="w-16 bg-[#0f1c2d] flex flex-col items-center py-5 space-y-5">
            {/* Logo */}
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CT</span>
            </div>

            {/* Icons */}
            <div className="flex-1 flex flex-col items-center space-y-6 pt-4">
              {miniIcons.map((m) => {
                const Icon = m.icon;
                const active = activeMini === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      // for 'create' or 'notifications' you may want custom behavior; for now, switch panel
                      setActiveMini(m.id);
                      // if the mini is one that doesn't have a panel (create/calendar/notifications/settings),
                      // we keep showing the most relevant one or open a compact modal. Here we'll map:
                      // create -> modules (open create menu), calendar -> modules, notifications -> modules, settings -> modules
                      if (!panels[m.id]) {
                        // keep current or set to modules as fallback
                        setActiveMini(m.id);
                      }
                    }}
                    className={cn(
                      "p-2 transition-all group relative rounded-md flex items-center justify-center",
                      active
                        ? "text-white bg-white/5"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                    title={m.label}
                  >
                    <Icon className="w-6 h-6" />
                    {/* Tooltip */}
                    <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-black/80 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                      {m.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Profile */}
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold mb-5">
              DV
            </div>
          </aside>

          {/* RIGHT DYNAMIC PANEL */}
          <div className="flex">
            <AnimatePresence mode="wait">
              {(() => {
                // if clicked mini corresponds to a known panel, show that; else map to a sensible default:
                // 'create' -> modules, 'calendar' -> modules, 'notifications' -> modules, 'settings' -> modules
                const mapToPanel = (id) =>
                  [
                    "modules",
                    "reports",
                    "analytics",
                    "dashboards",
                    "requests",
                    "marketplace",
                    "search",
                    "zia",
                  ].includes(id)
                    ? id
                    : "modules";

                const panelKey = mapToPanel(activeMini);
                const panelData = panels[panelKey];

                return (
                  <RightPanel
                    key={panelKey}
                    panelKey={panelKey}
                    panelData={panelData}
                  />
                );
              })()}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}