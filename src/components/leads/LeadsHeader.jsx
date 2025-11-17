import React, { useState } from "react";

const LeadsHeader = () => {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const menuBox =
    "absolute right-0 mt-1 w-56 bg-white rounded-md shadow-[0_3px_12px_rgba(0,0,0,0.13)] border border-gray-200 z-20";
  const menuItem =
    "w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100";

  const allLeadsOptions = [
    "All Leads",
    "All Locked Leads",
    "Converted Leads",
    "Junk Leads",
    "Mailing Labels",
    "My Converted Leads",
    "My Leads",
    "Not Qualified Leads",
    "Open Leads",
    "Recently Created Leads",
    "Recently Modified Leads",
    "Today's Leads",
    "Unread Leads",
    "Unsubscribed Leads",
  ];

  const createOptions = [
    "Create Lead",
    "Import Leads",
    "Import Notes",
    "Facebook Ads Sync",
    "LinkedIn Ads Sync",
  ];

  const actionsOptions = [
    "Bulk Actions",
    "Export Leads",
    "Mass Update",
    "Delete Selected",
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-2 relative">
      <div className="flex items-center justify-between">
        {/* LEFT TITLE */}
        <h1 className="text-[20px] font-semibold text-gray-800">Leads</h1>

        {/* RIGHT CONTROLS */}
        <div className="flex items-center space-x-2">

          {/* FILTER ICON BUTTON */}
          <button
            className="w-[40px] h-[36px] flex items-center justify-center bg-gradient-to-b from-[#ffffff] to-[#f3f3f3] 
              border border-gray-300 rounded-md shadow-sm hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.8"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 4h18M6 12h12M10 20h4"
              />
            </svg>
          </button>

          {/* ALL LEADS */}
          <div className="relative">
            <button
              onClick={() => toggleMenu("all")}
              className="px-4 py-[7px] text-sm text-gray-700 bg-gradient-to-b from-[#ffffff] to-[#f4f4f4]
                border border-gray-300 rounded-md shadow-sm flex items-center space-x-2 hover:bg-gray-100"
            >
              <span>All Leads</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {openMenu === "all" && (
              <div className={menuBox + " max-h-64 overflow-y-auto"}>
                {allLeadsOptions.map((item, i) => (
                  <button key={i} className={menuItem}>
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* CREATE LEAD */}
          <div className="relative">
  <button
    onClick={() => window.location.href = '/create-lead'} // or use your router
    className="px-4 py-[7px] text-sm bg-[#4675FF] text-white 
      border border-[#3b63d5] rounded-md shadow-sm flex items-center space-x-2 
      hover:bg-[#3b63f0]"
  >
    <span>Create Lead</span>
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {openMenu === "create" && (
              <div className={menuBox}>
                {createOptions.map((item, i) => (
                  <button key={i} className={menuItem}>
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ACTIONS */}
          <div className="relative">
            <button
              onClick={() => toggleMenu("actions")}
              className="px-4 py-[7px] text-sm text-gray-700 bg-gradient-to-b from-[#ffffff] to-[#f4f4f4]
                border border-gray-300 rounded-md shadow-sm flex items-center space-x-2 hover:bg-gray-100"
            >
              <span>Actions</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {openMenu === "actions" && (
              <div className={menuBox}>
                {actionsOptions.map((item, i) => (
                  <button key={i} className={menuItem}>
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CLOSE DROPDOWN ON OUTSIDE CLICK */}
      {openMenu && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setOpenMenu(null)}
        />
      )}
    </div>
  );
};

export default LeadsHeader;
