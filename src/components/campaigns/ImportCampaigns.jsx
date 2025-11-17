// src/components/campaigns/ImportCampaigns.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const ImportCampaigns = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full p-10 bg-[#f5f7fb]">
      <h1 className="text-2xl font-semibold mb-8">Import Campaigns</h1>

      <div className="flex gap-10 justify-center mt-10">

        {/* From File */}
        <div className="w-[380px] bg-white shadow-sm rounded-xl p-6 border">
          <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
            <span className="text-green-600 text-xl">⬤</span> From File
          </h2>

          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <p className="text-gray-600 mb-4">Drag and drop your file here.</p>
            <p className="text-gray-600 mb-3">- OR -</p>

            <button className="px-4 py-2 bg-[#4667d8] text-white rounded-md">
              Browse
            </button>
          </div>

          <p className="text-sm mt-4 text-blue-600 cursor-pointer">
            Download sample file CSV or XLSX
          </p>

          <p className="text-xs mt-4 text-gray-600 leading-relaxed">
            You can import up to 5000 records through an .xls, .xlsx, .vcf or
            .csv file. To import more than 5000 records at a time, use a .csv file.
          </p>
        </div>

        {/* From other CRMs */}
        <div className="w-[380px] bg-white shadow-sm rounded-xl p-6 border">
          <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
            <span className="text-green-600 text-xl">⬤</span> From other CRMs
          </h2>

          <p className="text-blue-600 cursor-pointer mb-4">
            Which CRM are you coming from?
          </p>

          <p className="text-gray-600 text-sm">
            Choose a CRM from which you would like to import. Importing data
            from other CRMs is made easy. It is just a click away.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-4 mt-10">
        <button
          className="px-5 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          onClick={() => navigate("/campaigns")}
        >
          Cancel
        </button>

        <button className="px-5 py-2 bg-[#b5b8f2] rounded-md text-white">
          Next
        </button>
      </div>
    </div>
  );
};

export default ImportCampaigns;
