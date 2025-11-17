// src/components/forecasts/ForecastConfig.jsx
import React, { useState, useEffect } from "react";

export default function ForecastConfig({ open, onClose }) {
  const [model, setModel] = useState("topdown");
  const [hierarchy, setHierarchy] = useState("roles");
  const [dealRevenue, setDealRevenue] = useState(false);
  const [dealQuantity, setDealQuantity] = useState(false);
  const [fiscal, setFiscal] = useState({
    type: "Standard Fiscal Year",
    beginsIn: "January",
    setBy: "-",
  });

  // close on Esc
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!open) return null;

  function handleSave() {
    // In real app, call API / persist settings
    const payload = {
      model,
      hierarchy,
      types: {
        dealRevenue,
        dealQuantity,
      },
      fiscal,
    };
    console.log("Saving forecast config", payload);
    onClose();
  }

  return (
    // overlay
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer/modal */}
      <div className="relative w-full md:max-w-3xl mx-4 bg-white rounded-t-lg md:rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Forecast Configuration</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {/* Forecast Model */}
          <div>
            <label className="text-sm text-gray-600 font-medium">Forecast Model</label>

            <div className="mt-3 grid gap-3 md:grid-cols-1">
              <label
                className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer ${
                  model === "topdown" ? "border-blue-300 bg-blue-50" : "border-gray-200 bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="model"
                  value="topdown"
                  checked={model === "topdown"}
                  onChange={() => setModel("topdown")}
                  className="mt-1"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-md bg-gradient-to-b from-yellow-200 to-yellow-100 flex items-center justify-center">
                      {/* little pyramid icon */}
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M12 3 L2 21 H22z" stroke="#FBBD23" strokeWidth="1.5" fill="none"/>
                      </svg>
                    </div>
                    <div className="text-sm font-semibold text-gray-800">Top down</div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500 max-w-xl">
                    Companies target will be split across the role and its members
                  </div>
                </div>
              </label>

              <label
                className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer ${
                  model === "bottomup" ? "border-blue-300 bg-blue-50" : "border-gray-200 bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="model"
                  value="bottomup"
                  checked={model === "bottomup"}
                  onChange={() => setModel("bottomup")}
                  className="mt-1"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M12 21 L22 3 H2z" stroke="#8B8F93" strokeWidth="1.5" fill="none"/>
                      </svg>
                    </div>
                    <div className="text-sm font-semibold text-gray-800">Bottom up</div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500 max-w-xl">
                    Role and it's member target will be summed up as company's target.
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Hierarchy */}
          <div className="flex items-center gap-6">
            <div>
              <label className="text-sm text-gray-600 font-medium">Hierarchy based on</label>
              <div className="mt-2 flex items-center gap-4">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    checked={hierarchy === "roles"}
                    onChange={() => setHierarchy("roles")}
                  />
                  <span>Roles</span>
                </label>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    checked={hierarchy === "territory"}
                    onChange={() => setHierarchy("territory")}
                  />
                  <span>Territory</span>
                </label>
              </div>
            </div>

            <div className="ml-6 flex-1">
              {/* placeholder for info icon if needed */}
            </div>
          </div>

          {/* Enable Forecast Type */}
          <div>
            <label className="text-sm text-gray-600 font-medium">Enable forecast type in your organization</label>

            <div className="mt-3 border border-gray-100 rounded-md p-4 bg-gray-50">
              <label className="flex items-center gap-3">
                <input type="checkbox" checked={dealRevenue} onChange={() => setDealRevenue(!dealRevenue)} />
                <span className="text-sm text-gray-700">Deal Revenue</span>
              </label>

              <label className="flex items-center gap-3 mt-3">
                <input type="checkbox" checked={dealQuantity} onChange={() => setDealQuantity(!dealQuantity)} />
                <span className="text-sm text-gray-700">Deal Quantity</span>
              </label>
            </div>
          </div>

          {/* Fiscal Year */}
          <div className="border border-gray-100 rounded-md p-4 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-gray-800">Fiscal Year</div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2"><span className="w-36 text-gray-500">Fiscal Year Type</span><span>{fiscal.type}</span></div>
                  <div className="flex items-center gap-2"><span className="w-36 text-gray-500">Fiscal Year begins in</span><span>{fiscal.beginsIn}</span></div>
                  <div className="flex items-center gap-2"><span className="w-36 text-gray-500">Set by</span><span>{fiscal.setBy}</span></div>
                </div>
              </div>

              <div>
                <button className="text-sm text-blue-600 hover:underline">Manage</button>
              </div>
            </div>
          </div>

        </div>

        {/* Footer buttons */}
        <div className="px-6 py-4 border-t border-gray-100 bg-white flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-200 text-gray-700 bg-white hover:shadow-sm"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-md bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
