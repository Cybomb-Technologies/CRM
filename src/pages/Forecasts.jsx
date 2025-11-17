// src/pages/Forecasts.jsx
import React, { useState } from "react";
import ForecastConfig from "../components/forecasts/ForecastConfig";

function Panel({ illustration, title, desc, children, onClick }) {
  return (
    <div className="flex-1 p-8 flex flex-col items-center text-center">
      <div className="w-56 h-40 mb-6 flex items-center justify-center">
        {illustration}
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-xs mb-5">{desc}</p>

      {children ? (
        <div onClick={onClick} className="cursor-pointer">
          {children}
        </div>
      ) : null}
    </div>
  );
}

/* Small SVG illustrations (light outline + yellow accent) */
const PeopleTargetIcon = () => (
  <svg viewBox="0 0 120 80" className="w-full h-full">
    <g fill="none" stroke="#E6E9EE" strokeWidth="2">
      <path d="M10 60c0-12 10-20 22-20s22 8 22 20" />
      <path d="M54 60c0-9 8-16 18-16s18 7 18 16" />
    </g>
    <g fill="none" stroke="#F6B844" strokeWidth="2.5">
      <circle cx="26" cy="30" r="8" />
      <circle cx="62" cy="20" r="8" />
      <path d="M90 18c8 4 16 12 16 22" />
      <circle cx="92" cy="46" r="18" stroke="#E6E9EE" />
      <path d="M100 34 l8-8" stroke="#F6B844" strokeWidth="3" />
    </g>
  </svg>
);

const TrackIcon = () => (
  <svg viewBox="0 0 120 80" className="w-full h-full">
    <g stroke="#E6E9EE" strokeWidth="2" fill="none">
      <rect x="12" y="18" width="36" height="10" rx="3" />
      <rect x="12" y="34" width="36" height="10" rx="3" />
      <rect x="12" y="50" width="36" height="10" rx="3" />
    </g>
    <g fill="none" stroke="#F6B844" strokeWidth="2.5">
      <circle cx="86" cy="40" r="20" />
      <path d="M74 38 l8 6 l12-14" stroke="#F6B844" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
  </svg>
);

const GraphBulbIcon = () => (
  <svg viewBox="0 0 120 80" className="w-full h-full">
    <g fill="none" stroke="#E6E9EE" strokeWidth="2">
      <rect x="14" y="36" width="20" height="24" rx="2" />
      <rect x="36" y="28" width="12" height="32" rx="2" />
      <rect x="50" y="20" width="16" height="40" rx="2" />
    </g>
    <g fill="none" stroke="#F6B844" strokeWidth="2.8">
      <path d="M96 18a18 18 0 11-36 0 18 18 0 0136 0z" />
      <path d="M86 36 v6" strokeLinecap="round" />
    </g>
  </svg>
);

export default function Forecasts() {
  const [openConfig, setOpenConfig] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm p-12">
        <div className="flex justify-end">
          <button className="text-sm text-gray-500 hover:text-gray-700 inline-flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2a10 10 0 100 20 10 10 0 000-20zM12 7a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11 11v6h2v-6h-2z" fill="#9AA3B2" />
            </svg>
            Help
          </button>
        </div>

        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-10">Forecast your sales</h1>

        <div className="flex gap-6">
          <Panel
            illustration={<PeopleTargetIcon />}
            title="Set Sales Target"
            desc="Set target to the users in your organization to motivate the sales."
          />

          <Panel
            illustration={<TrackIcon />}
            title="Track Achievement"
            desc="View all the user's achievements anytime over the target allocated for the forecast period."
            onClick={() => setOpenConfig(true)}
          >
            <button
              onClick={() => setOpenConfig(true)}
              className="bg-gradient-to-b from-blue-500 to-blue-600 text-white px-6 py-2 rounded-md shadow-md hover:shadow-lg transition"
            >
              Configure Now
            </button>
          </Panel>

          <Panel
            illustration={<GraphBulbIcon />}
            title="Predict and Analyse"
            desc="Analyse the results & set better target for forthcoming periods."
          />
        </div>
      </div>

      <ForecastConfig open={openConfig} onClose={() => setOpenConfig(false)} />
    </div>
  );
}
